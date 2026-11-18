from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.logger import get_logger
from app.core.security import get_current_user

from app.schemas.profile import (
    ProfileResponse,
    ProfileUpdate,
    ChangePasswordRequest,
    GenericProfileResponse,
)

from app.services.profile_service import (
    fetch_profile,
    edit_profile,
    update_user_password,
)

router = APIRouter(
    prefix="/api/v1/profile",
    tags=["Profile"],
)

logger = get_logger(__name__)


@router.get(
    "",
    response_model=ProfileResponse,
)
def get_profile(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return fetch_profile(
        db=db,
        user_id=current_user["user_id"],
    )


@router.put(
    "",
    response_model=GenericProfileResponse,
)
def update_profile(
    payload: ProfileUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    response = edit_profile(
        db=db,
        payload=payload,
        user_id=current_user["user_id"],
    )

    logger.info(
        f"Profile updated for user {current_user['user_id']}"
    )

    return response


@router.patch(
    "/password",
    response_model=GenericProfileResponse,
)
def change_password(
    payload: ChangePasswordRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    response = update_user_password(
        db=db,
        payload=payload,
        user_id=current_user["user_id"],
    )

    logger.info(
        f"Password changed for user {current_user['user_id']}"
    )

    return response