from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///db.sqlite")
    cors_origin: str = os.getenv("CORS_ORIGIN", "http://localhost:8000")
    domain: str = os.getenv("DOMAIN", "localhost")
    jwt_secret: str = os.getenv("JWT_SECRET", "your-32-char-secret-here-1234567890")

def get_settings():
    return Settings()