from sqlalchemy.orm import Session

from app.exceptions.custom_exceptions import (
    ConflictException,
    UnauthorizedException,
)
from app.models.user import User
from app.repositories.user_repository import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    update_user_password,
)
from app.schemas.auth import RegisterRequest
from app.utils.jwt import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
)
from app.utils.password import (
    hash_password,
    verify_password,
)

# Temporary in-memory store for reset tokens
reset_tokens: dict[str, str] = {}


def register_user(
    db: Session,
    payload: RegisterRequest,
) -> User:
    """
    Register a new user.
    """

    existing_user = get_user_by_email(
        db,
        payload.email,
    )

    if existing_user:
        raise ConflictException(
            "Email already registered"
        )

    user = create_user(
        db=db,
        name=payload.name,
        email=payload.email,
        password=hash_password(payload.password),
        role=payload.role,
    )

    return user


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    """
    Authenticate user and generate JWT tokens.
    """

    user = get_user_by_email(
        db,
        email,
    )

    if not user:
        raise UnauthorizedException(
            "Invalid email or password"
        )

    if not verify_password(
        password,
        user.password,
    ):
        raise UnauthorizedException(
            "Invalid email or password"
        )

    access_token = create_access_token(
        data={
            "user_id": user.id,
            "sub": user.email,
            "role": user.role,
        }
    )

    refresh_token = create_refresh_token(
        data={
            "user_id": user.id,
            "sub": user.email,
            "role": user.role,
        }
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "role": user.role,
    }


def refresh_access_token(
    refresh_token: str,
):
    """
    Generate new access token from refresh token.
    """

    payload = decode_refresh_token(
        refresh_token,
    )

    access_token = create_access_token(
        data={
            "user_id": payload["user_id"],
            "sub": payload["sub"],
            "role": payload["role"],
        }
    )

    return access_token


def forgot_password(
    db: Session,
    email: str,
):
    """
    Generate password reset token.
    """

    user = get_user_by_email(
        db,
        email,
    )

    if not user:
        raise UnauthorizedException(
            "User not found"
        )

    reset_token = create_access_token(
        data={
            "user_id": user.id,
            "sub": user.email,
            "role": user.role,
        }
    )

    reset_tokens[reset_token] = user.email

    return reset_token


def reset_password(
    db: Session,
    reset_token: str,
    new_password: str,
):
    """
    Reset user's password.
    """

    email = reset_tokens.get(
        reset_token,
    )

    if not email:
        raise UnauthorizedException(
            "Invalid or expired reset token"
        )

    user = get_user_by_email(
        db,
        email,
    )

    if not user:
        raise UnauthorizedException(
            "User not found"
        )

    update_user_password(
        db=db,
        user=user,
        new_password=hash_password(
            new_password,
        ),
    )

    del reset_tokens[reset_token]


def get_current_user(
    db: Session,
    user_id: int,
) -> User:
    """
    Get current authenticated user.
    """

    user = get_user_by_id(
        db,
        user_id,
    )

    if not user:
        raise UnauthorizedException(
            "User not found"
        )

    return user