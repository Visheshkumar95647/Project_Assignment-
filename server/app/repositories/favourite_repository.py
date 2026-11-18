from sqlalchemy.orm import Session

from app.models.favourite_restaurant import FavouriteRestaurant


def get_favorites(
    db: Session,
    user_id: int,
):
    return (
        db.query(FavouriteRestaurant)
        .filter(
            FavouriteRestaurant.user_id == user_id
        )
        .all()
    )


def get_favorite(
    db: Session,
    user_id: int,
    restaurant_id: int,
):
    return (
        db.query(FavouriteRestaurant)
        .filter(
            FavouriteRestaurant.user_id == user_id,
            FavouriteRestaurant.restaurant_id == restaurant_id,
        )
        .first()
    )


def add_favorite(
    db: Session,
    favorite: FavouriteRestaurant,
):
    db.add(favorite)

    db.commit()

    db.refresh(favorite)

    return favorite


def remove_favorite(
    db: Session,
    favorite: FavouriteRestaurant,
):
    db.delete(favorite)

    db.commit()