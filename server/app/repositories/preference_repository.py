# from sqlalchemy.orm import Session

# from app.models.preference import Preference


# def get_user_preference(
#     db: Session,
#     user_id: int,
# ):
#     return (
#         db.query(Preference)
#         .filter(Preference.user_id == user_id)
#         .first()
#     )


# def get_preference_by_id(
#     db: Session,
#     preference_id: int,
# ):
#     return (
#         db.query(Preference)
#         .filter(Preference.id == preference_id)
#         .first()
#     )


# def create_preference(
#     db: Session,
#     user_id: int,
#     dietary_restrictions: str | None = None,
# ):
#     preference = Preference(
#         user_id=user_id,
#         dietary_restrictions=dietary_restrictions,
#     )
#     db.add(preference)
#     db.commit()
#     db.refresh(preference)
#     return preference


# def update_preference(
#     db: Session,
#     preference_id: int,
#     dietary_restrictions: str | None = None,
# ):
#     preference = get_preference_by_id(db, preference_id)
#     if not preference:
#         return None

#     if dietary_restrictions is not None:
#         preference.dietary_restrictions = dietary_restrictions

#     db.commit()
#     db.refresh(preference)
#     return preference


# def add_favorite_cuisine(
#     db: Session,
#     preference_id: int,
#     cuisine_id: int,
# ):
#     preference = get_preference_by_id(db, preference_id)
#     if not preference:
#         return None

#     from app.models.cuisine import Cuisine

#     cuisine = db.query(Cuisine).filter(Cuisine.id == cuisine_id).first()
#     if not cuisine:
#         return None

#     if cuisine not in preference.favorite_cuisines:
#         preference.favorite_cuisines.append(cuisine)
#         db.commit()
#         db.refresh(preference)

#     return preference


# def remove_favorite_cuisine(
#     db: Session,
#     preference_id: int,
#     cuisine_id: int,
# ):
#     preference = get_preference_by_id(db, preference_id)
#     if not preference:
#         return None

#     from app.models.cuisine import Cuisine

#     cuisine = db.query(Cuisine).filter(Cuisine.id == cuisine_id).first()
#     if cuisine and cuisine in preference.favorite_cuisines:
#         preference.favorite_cuisines.remove(cuisine)
#         db.commit()
#         db.refresh(preference)

#     return preference
 

from sqlalchemy.orm import Session

from app.models.preference import Preference
from app.models.category import Category


def get_user_preference(
    db: Session,
    user_id: int,
):
    return (
        db.query(Preference)
        .filter(Preference.user_id == user_id)
        .first()
    )


def get_preference_by_id(
    db: Session,
    preference_id: int,
):
    return (
        db.query(Preference)
        .filter(Preference.id == preference_id)
        .first()
    )


def create_preference(
    db: Session,
    user_id: int,
    dietary_restrictions: str | None = None,
):
    preference = Preference(
        user_id=user_id,
        dietary_restrictions=dietary_restrictions,
    )
    db.add(preference)
    db.commit()
    db.refresh(preference)
    return preference


def update_preference(
    db: Session,
    preference_id: int,
    dietary_restrictions: str | None = None,
):
    preference = get_preference_by_id(
        db,
        preference_id,
    )

    if not preference:
        return None

    if dietary_restrictions is not None:
        preference.dietary_restrictions = dietary_restrictions

    db.commit()
    db.refresh(preference)

    return preference


def add_favorite_category(
    db: Session,
    preference_id: int,
    category_id: int,
):
    preference = get_preference_by_id(
        db,
        preference_id,
    )

    if not preference:
        return None

    category = (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )

    if not category:
        return None

    if category not in preference.favorite_categories:
        preference.favorite_categories.append(category)
        db.commit()
        db.refresh(preference)

    return preference


def remove_favorite_category(
    db: Session,
    preference_id: int,
    category_id: int,
):
    preference = get_preference_by_id(
        db,
        preference_id,
    )

    if not preference:
        return None

    category = (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )

    if (
        category
        and category in preference.favorite_categories
    ):
        preference.favorite_categories.remove(category)
        db.commit()
        db.refresh(preference)

    return preference