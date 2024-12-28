from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from passlib.hash import bcrypt
from bson.objectid import ObjectId
from config import get_mongo_client, settings
from jose import jwt, JWTError
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

# Initialize MongoDB client and database
client = get_mongo_client()
db = client[settings.MONGO_DB]  # Access the configured database
users_collection = db["users"]  # Define the users collection
SECRET_KEY = settings.JWT_SECRET
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Define the router
router = APIRouter()


# Helper function to hash passwords
def hash_password(password: str) -> str:
    return bcrypt.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.verify(password, hashed)


# Define schemas
class UserSchema(BaseModel):
    username: str
    email: EmailStr
    admission_number: str
    password: str  # Raw password for input


class UserResponseSchema(BaseModel):
    id: str
    username: str
    email: EmailStr
    admission_number: str

    class Config:
        form_attributes = True


class LoginSchema(BaseModel):
    email: EmailStr
    password: str


class LoginResponseSchema(BaseModel):
    id: str
    username: str
    email: EmailStr
    admission_number: str
    access_token: str
    refresh_token: str

    class Config:
        form_attributes = True


class ProtectedResponseSchema(BaseModel):
    message: str
    user: UserResponseSchema


def generate_access_token(data: dict) -> str:
    """
    Generate an access token with a short expiration time.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def generate_refresh_token(data: dict) -> str:
    """
    Generate a refresh token with a longer expiration time.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """
    Decode a JWT token and return its payload.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        )


# Routes
@router.post(
    "/create", response_model=UserResponseSchema, status_code=status.HTTP_201_CREATED
)
async def register_user(user: UserSchema):
    """
    Endpoint to register a new user in the MongoDB database.
    """
    # Check if email already exists
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered.",
        )

    # Hash the user's password
    hashed_password = hash_password(user.password)

    # Create a new user document
    user_data = {
        "username": user.username,
        "email": user.email,
        "admission_number": user.admission_number,
        "hashed_password": hashed_password,
    }

    # Insert the user into the database
    result = users_collection.insert_one(user_data)

    # Fetch the inserted user for the response
    inserted_user = users_collection.find_one({"_id": result.inserted_id})

    # Return the user data excluding the password
    return UserResponseSchema(
        id=str(inserted_user["_id"]),
        username=inserted_user["username"],
        email=inserted_user["email"],
        admission_number=inserted_user["admission_number"],
    )


@router.post("/login", response_model=LoginResponseSchema)
async def login(user: LoginSchema):
    """
    Login endpoint for user authentication.
    """
    # Find user by email
    user_data = users_collection.find_one({"email": user.email})
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # Verify password
    if not verify_password(user.password, user_data["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # Generate tokens
    access_token = generate_access_token({"sub": str(user_data["_id"])})
    refresh_token = generate_refresh_token({"sub": str(user_data["_id"])})

    # Return user data with tokens
    return LoginResponseSchema(
        id=str(user_data["_id"]),
        username=user_data["username"],
        email=user_data["email"],
        admission_number=user_data["admission_number"],
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout():
    """
    Logout endpoint (stateless).
    """
    return {
        "message": "Successfully logged out. Tokens should be discarded client-side."
    }


@router.get("/dashboard", response_model=ProtectedResponseSchema)
async def dashboard(current_user: UserResponseSchema = Depends(decode_token)):
    """
    Protected route for dashboard access.
    """
    user_data = users_collection.find_one({"_id": ObjectId(current_user.id)})
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found."
        )

    return ProtectedResponseSchema(
        message="Welcome to your dashboard!",
        user=UserResponseSchema(
            id=str(user_data["_id"]),
            username=user_data["username"],
            email=user_data["email"],
            admission_number=user_data["admission_number"],
        ),
    )


# Dependency for protected routes
async def get_current_user(token: str = Depends(decode_token)):
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token."
        )
    user_data = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found."
        )
    return UserResponseSchema(
        id=str(user_data["_id"]),
        username=user_data["username"],
        email=user_data["email"],
        admission_number=user_data["admission_number"],
    )


@router.get("/users/{user_id}", response_model=UserResponseSchema)
async def get_user_by_id(user_id: str):
    logger.info(f"Fetching user with ID: {user_id}")
    try:
        object_id = ObjectId(user_id)
    except Exception as e:
        logger.error(f"Invalid ObjectId format for ID {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format.",
        )

    user_data = users_collection.find_one({"_id": object_id})
    if not user_data:
        logger.warning(f"No user found with ID: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found."
        )

    logger.info(f"User data retrieved: {user_data}")
    return UserResponseSchema(
        id=str(user_data["_id"]),
        username=user_data["username"],
        email=user_data["email"],
        admission_number=user_data["admission_number"],
    )
