from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os
import pymongo

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    MONGO_USERNAME: str = os.getenv("MONGO_USERNAME")
    MONGO_PASSWORD: str = os.getenv("MONGO_PASSWORD")
    MONGO_HOST: str = os.getenv("MONGO_HOST", "127.0.0.1")
    MONGO_PORT: int = int(os.getenv("MONGO_PORT", 27017))
    MONGO_AUTH_SOURCE: str = os.getenv("MONGO_AUTH_SOURCE", "admin")
    MONGO_DB: str = os.getenv("MONGO_DB")
    JWT_SECRET: str = os.getenv("JWT_SECRET")

    @property
    def mongo_uri(self):
        return f"mongodb://{self.MONGO_USERNAME}:{self.MONGO_PASSWORD}@{self.MONGO_HOST}:{self.MONGO_PORT}/{self.MONGO_DB}?authSource={self.MONGO_AUTH_SOURCE}"


settings = Settings()


def get_mongo_client():
    return pymongo.MongoClient(settings.mongo_uri)
