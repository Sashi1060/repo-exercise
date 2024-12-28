from fastapi import FastAPI
from contextlib import asynccontextmanager
from config import get_mongo_client
import logging
from models.UserModel import router as user_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI.
    This manages startup and shutdown events.
    """
    # Startup actions
    try:
        client = get_mongo_client()
        client.server_info()  # Test the connection
        logger.info("Successfully connected to MongoDB.")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")

    # Yield control to the app
    yield

    # Shutdown actions (if needed)
    logger.info("Application is shutting down.")


# Create the FastAPI app with lifespan
app = FastAPI(lifespan=lifespan)

app.include_router(user_router, prefix="/users")


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
