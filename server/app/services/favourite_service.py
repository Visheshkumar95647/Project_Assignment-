from sqlalchemy.orm import Session

from app.exceptions.custom_exceptions import (
    RestaurantNotFoundException,
)

from app.models.favourite_restaurant import FavouriteRestaurant

from app.repositories.favourite_repository import (
    get_favorites,
    get_favorite,
    add_favorite,
    remove_favorite,
)

from app.repositories.restaurant_repository import (
    get_restaurant_by_id,
)


def fetch_favorites(
    db: Session,
    user_id: int,
):

    favorites = get_favorites(
        db,
        user_id,
    )

    return [
        {
            "id": favorite.id,
            "restaurant_id": favorite.restaurant.id,
            "restaurant_name": favorite.restaurant.name,
        }
        for favorite in favorites
    ]


def add_favorite_restaurant(
    db: Session,
    restaurant_id: int,
    user_id: int,
):

    restaurant = get_restaurant_by_id(
        db,
        restaurant_id,
    )

    if not restaurant:
        raise RestaurantNotFoundException()

    favorite = get_favorite(
        db,
        user_id,
        restaurant_id,
    )

    if favorite:
        return {
            "success": True,
            "message": "Restaurant already in favorites.",
        }

    add_favorite(
        db,
        FavouriteRestaurant(
            user_id=user_id,
            restaurant_id=restaurant_id,
        ),
    )

    return {
        "success": True,
        "message": "Restaurant added to favorites.",
    }


def remove_favorite_restaurant(
    db: Session,
    restaurant_id: int,
    user_id: int,
):

    favorite = get_favorite(
        db,
        user_id,
        restaurant_id,
    )

    if not favorite:
        raise RestaurantNotFoundException(
            "Favorite restaurant not found."
        )

    remove_favorite(
        db,
        favorite,
    )

    return {
        "success": True,
        "message": "Restaurant removed from favorites.",
    }