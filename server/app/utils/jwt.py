from datetime import datetime, timedelta, UTC

from jose import JWTError, jwt

from app.core.config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS,
)
from app.exceptions.custom_exceptions import UnauthorizedException


def create_access_token(data: dict) -> str:
    payload = data.copy()

    payload["type"] = "access"

    payload["exp"] = (
        datetime.now(UTC)
        + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def create_refresh_token(data: dict) -> str:
    payload = data.copy()

    payload["type"] = "refresh"

    payload["exp"] = (
        datetime.now(UTC)
        + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        if payload.get("type") != "access":
            raise UnauthorizedException(
                "Invalid access token"
            )

        return payload

    except JWTError:
        raise UnauthorizedException(
            "Invalid or expired access token"
        )


def decode_refresh_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        if payload.get("type") != "refresh":
            raise UnauthorizedException(
                "Invalid refresh token"
            )

        return payload

    except JWTError:
        raise UnauthorizedException(
            "Invalid or expired refresh token"
        )