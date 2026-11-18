from sqlalchemy.orm import Session

from app.exceptions.custom_exceptions import (
    ForbiddenException,
    RestaurantNotFoundException,
)

from app.models.restaurant import Restaurant

from app.repositories.restaurant_repository import (
    create_restaurant,
    delete_restaurant,
    get_all_restaurants,
    get_restaurant_by_id,
    get_restaurants_by_owner,
    search_restaurants,
    update_restaurant,
)


def create_new_restaurant(
    db: Session,
    payload,
    owner_id: int,
):
    restaurant = Restaurant(
        name=payload.name,
        description=payload.description,
        address=payload.address,
        phone=payload.phone,
        location=payload.location,
        image_url=payload.image_url,
        owner_id=owner_id,
    )

    return create_restaurant(
        db=db,
        restaurant=restaurant,
    )


def fetch_restaurant(
    db: Session,
    restaurant_id: int,
):
    restaurant = get_restaurant_by_id(
        db=db,
        restaurant_id=restaurant_id,
    )

    if not restaurant:
        raise RestaurantNotFoundException()

    return restaurant


def fetch_all_restaurants(
    db: Session,
):
    return get_all_restaurants(db)


def fetch_owner_restaurants(
    db: Session,
    owner_id: int,
):
    return get_restaurants_by_owner(
        db=db,
        owner_id=owner_id,
    )


def edit_restaurant(
    db: Session,
    restaurant_id: int,
    payload,
    owner_id: int,
):
    restaurant = get_restaurant_by_id(
        db=db,
        restaurant_id=restaurant_id,
    )

    if not restaurant:
        raise RestaurantNotFoundException()

    if restaurant.owner_id != owner_id:
        raise ForbiddenException(
            "You are not allowed to update this restaurant."
        )

    update_data = payload.model_dump(
        exclude_unset=True,
    )

    for key, value in update_data.items():
        setattr(
            restaurant,
            key,
            value,
        )

    return update_restaurant(
        db=db,
        restaurant=restaurant,
    )


def remove_restaurant(
    db: Session,
    restaurant_id: int,
    owner_id: int,
):
    restaurant = get_restaurant_by_id(
        db=db,
        restaurant_id=restaurant_id,
    )

    if not restaurant:
        raise RestaurantNotFoundException()

    if restaurant.owner_id != owner_id:
        raise ForbiddenException(
            "You are not allowed to delete this restaurant."
        )

    delete_restaurant(
        db=db,
        restaurant=restaurant,
    )


def search_restaurant(
    db: Session,
    keyword: str | None = None,
    location: str | None = None,
    category: str | None = None,
):
    return search_restaurants(
        db=db,
        keyword=keyword,
        location=location,
        category=category,
    )