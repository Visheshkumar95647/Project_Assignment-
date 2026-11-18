from sqlalchemy.orm import Session

from app.repositories.preference_repository import (
    get_user_preference,
    create_preference,
    update_preference,
    add_favorite_category,
    remove_favorite_category,
)


def fetch_user_preference(
    db: Session,
    user_id: int,
):
    preference = get_user_preference(
        db,
        user_id,
    )

    if not preference:
        preference = create_preference(
            db,
            user_id,
            dietary_restrictions=None,
        )

    return preference


def create_user_preference(
    db: Session,
    user_id: int,
    dietary_restrictions: str | None = None,
):
    return create_preference(
        db,
        user_id,
        dietary_restrictions,
    )


def update_user_preference(
    db: Session,
    preference_id: int,
    dietary_restrictions: str | None = None,
):
    return update_preference(
        db,
        preference_id,
        dietary_restrictions,
    )


def add_category_to_favorites(
    db: Session,
    preference_id: int,
    category_id: int,
):
    return add_favorite_category(
        db,
        preference_id,
        category_id,
    )


def remove_category_from_favorites(
    db: Session,
    preference_id: int,
    category_id: int,
):
    return remove_favorite_category(
        db,
        preference_id,
        category_id,
    )