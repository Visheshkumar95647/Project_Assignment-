import os
from dotenv import load_dotenv

load_dotenv()

APP_NAME = os.getenv(
    "APP_NAME",
    "Food Ordering API",
)

APP_VERSION = os.getenv(
    "APP_VERSION",
    "1.0.0",
)

APP_DESCRIPTION = os.getenv(
    "APP_DESCRIPTION",
    "Food Ordering Backend using FastAPI",
)

HOST = os.getenv(
    "HOST",
    "0.0.0.0",
)

PORT = int(
    os.getenv(
        "PORT",
        8000,
    )
)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/food_ordering_db",
)

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "change-me",
)

ALGORITHM = os.getenv(
    "ALGORITHM",
    "HS256",
)

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        60,
    )
)

REFRESH_TOKEN_EXPIRE_DAYS = int(
    os.getenv(
        "REFRESH_TOKEN_EXPIRE_DAYS",
        7,
    )
)

LOG_LEVEL = os.getenv(
    "LOG_LEVEL",
    "INFO",
)

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "*",
)