import secrets

token = secrets.token_urlsafe(64)

print(f"JWT_SECRET: {token}")
