from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.logger import get_logger
from app.core.security import require_customer

from app.schemas.preference import (
    PreferenceCreate,
    PreferenceUpdate,
    PreferenceResponse,
)

from app.services.preference_service import (
    fetch_user_preference,
    create_user_preference,
    update_user_preference,
    add_category_to_favorites,
    remove_category_from_favorites,
)

router = APIRouter(
    prefix="/api/v1/preferences",
    tags=["Preferences"],
)

logger = get_logger(__name__)


@router.get(
    "",
    response_model=PreferenceResponse,
)
def get_preference(
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):
    return fetch_user_preference(
        db=db,
        user_id=current_user["user_id"],
    )


@router.post(
    "",
    response_model=PreferenceResponse,
)
def create_preference(
    payload: PreferenceCreate,
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):
    preference = fetch_user_preference(
        db,
        current_user["user_id"],
    )

    if preference:

        preference = update_user_preference(
            db=db,
            preference_id=preference.id,
            dietary_restrictions=payload.dietary_restrictions,
        )

    else:

        preference = create_user_preference(
            db=db,
            user_id=current_user["user_id"],
            dietary_restrictions=payload.dietary_restrictions,
        )

    return preference


@router.put(
    "",
    response_model=PreferenceResponse,
)
def update_preference(
    payload: PreferenceUpdate,
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):
    preference = fetch_user_preference(
        db,
        current_user["user_id"],
    )

    if not preference:

        preference = create_user_preference(
            db=db,
            user_id=current_user["user_id"],
            dietary_restrictions=payload.dietary_restrictions,
        )

    else:

        preference = update_user_preference(
            db=db,
            preference_id=preference.id,
            dietary_restrictions=payload.dietary_restrictions,
        )

    return preference


@router.post(
    "/categories/{category_id}",
    response_model=PreferenceResponse,
)
def add_favorite_category(
    category_id: int,
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    preference = fetch_user_preference(
        db,
        current_user["user_id"],
    )

    if not preference:

        preference = create_user_preference(
            db,
            current_user["user_id"],
        )

    preference = add_category_to_favorites(
        db=db,
        preference_id=preference.id,
        category_id=category_id,
    )

    if not preference:
        raise HTTPException(
            status_code=404,
            detail="Preference or Category not found",
        )

    return preference


@router.delete(
    "/categories/{category_id}",
    response_model=PreferenceResponse,
)
def remove_favorite_category(
    category_id: int,
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    preference = fetch_user_preference(
        db,
        current_user["user_id"],
    )

    if not preference:
        raise HTTPException(
            status_code=404,
            detail="Preference not found",
        )

    preference = remove_category_from_favorites(
        db=db,
        preference_id=preference.id,
        category_id=category_id,
    )

    return preference