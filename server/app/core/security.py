from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from app.exceptions.custom_exceptions import (
    ForbiddenException,
    UnauthorizedException,
)
from app.utils.jwt import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
):
    payload = decode_access_token(token)

    email = payload.get("sub")
    role = payload.get("role")
    user_id = payload.get("user_id")

    if not email or not role or not user_id:
        raise UnauthorizedException(
            "Invalid token payload"
        )

    return {
        "user_id": user_id,
        "email": email,
        "role": role,
    }


def require_customer(
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "customer":
        raise ForbiddenException(
            "Only customers can access this resource"
        )

    return current_user


def require_owner(
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "owner":
        raise ForbiddenException(
            "Only restaurant owners can access this resource"
        )

    return current_user
