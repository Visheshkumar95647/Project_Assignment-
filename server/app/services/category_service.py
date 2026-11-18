from sqlalchemy.orm import Session

from app.exceptions.custom_exceptions import (
    CategoryNotFoundException,
    ForbiddenException,
    RestaurantNotFoundException,
)

from app.models.category import Category

from app.repositories.category_repository import (
    create_category,
    delete_category,
    get_all_categories,
    get_categories_by_restaurant,
    get_category_by_id,
    search_categories,
    update_category,
)

from app.repositories.restaurant_repository import (
    get_restaurant_by_id,
)


def create_new_category(
    db: Session,
    payload,
    owner_id: int,
):
    restaurant = get_restaurant_by_id(
        db,
        payload.restaurant_id,
    )

    if not restaurant:
        raise RestaurantNotFoundException()

    if restaurant.owner_id != owner_id:
        raise ForbiddenException(
            "You cannot add categories to this restaurant."
        )

    category = Category(
        name=payload.name,
        restaurant_id=payload.restaurant_id,
    )

    return create_category(
        db=db,
        category=category,
    )


def fetch_category(
    db: Session,
    category_id: int,
):
    category = get_category_by_id(
        db=db,
        category_id=category_id,
    )

    if not category:
        raise CategoryNotFoundException()

    return category


def fetch_all_categories(
    db: Session,
):
    return get_all_categories(db)


def fetch_restaurant_categories(
    db: Session,
    restaurant_id: int,
):
    restaurant = get_restaurant_by_id(
        db,
        restaurant_id,
    )

    if not restaurant:
        raise RestaurantNotFoundException()

    return get_categories_by_restaurant(
        db=db,
        restaurant_id=restaurant_id,
    )


def edit_category(
    db: Session,
    category_id: int,
    payload,
    owner_id: int,
):
    category = get_category_by_id(
        db=db,
        category_id=category_id,
    )

    if not category:
        raise CategoryNotFoundException()

    restaurant = get_restaurant_by_id(
        db,
        category.restaurant_id,
    )

    if not restaurant:
        raise RestaurantNotFoundException()

    if restaurant.owner_id != owner_id:
        raise ForbiddenException(
            "You cannot update this category."
        )

    update_data = payload.model_dump(
        exclude_unset=True,
    )

    for key, value in update_data.items():
        setattr(
            category,
            key,
            value,
        )

    return update_category(
        db=db,
        category=category,
    )


def remove_category(
    db: Session,
    category_id: int,
    owner_id: int,
):
    category = get_category_by_id(
        db=db,
        category_id=category_id,
    )

    if not category:
        raise CategoryNotFoundException()

    restaurant = get_restaurant_by_id(
        db,
        category.restaurant_id,
    )

    if not restaurant:
        raise RestaurantNotFoundException()

    if restaurant.owner_id != owner_id:
        raise ForbiddenException(
            "You cannot delete this category."
        )

    delete_category(
        db=db,
        category=category,
    )


def search_category(
    db: Session,
    keyword: str,
):
    return search_categories(
        db=db,
        keyword=keyword,
    )