from sqlalchemy.orm import Session

from app.exceptions.custom_exceptions import (
    UserNotFoundException,
    InvalidCredentialsException,
)

from app.repositories.profile_repository import (
    get_user_profile,
    update_profile,
    change_password,
)

from app.utils.password import (
    verify_password,
    hash_password,
)


def fetch_profile(
    db: Session,
    user_id: int,
):

    user = get_user_profile(
        db,
        user_id,
    )

    if not user:
        raise UserNotFoundException()

    return {
        "success": True,
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
    }


def edit_profile(
    db: Session,
    payload,
    user_id: int,
):

    user = get_user_profile(
        db,
        user_id,
    )

    if not user:
        raise UserNotFoundException()

    update_data = payload.model_dump(
        exclude_unset=True,
    )

    for key, value in update_data.items():
        setattr(
            user,
            key,
            value,
        )

    update_profile(
        db,
        user,
    )

    return {
        "success": True,
        "message": "Profile updated successfully",
    }


def update_user_password(
    db: Session,
    payload,
    user_id: int,
):

    user = get_user_profile(
        db,
        user_id,
    )

    if not user:
        raise UserNotFoundException()

    if not verify_password(
        payload.current_password,
        user.password,
    ):
        raise InvalidCredentialsException(
            "Current password is incorrect."
        )

    user.password = hash_password(
        payload.new_password,
    )

    change_password(
        db,
        user,
    )

    return {
        "success": True,
        "message": "Password changed successfully",
    }