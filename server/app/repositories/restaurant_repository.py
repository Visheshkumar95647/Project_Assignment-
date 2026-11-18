from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.restaurant import Restaurant
# from app.models.cuisine import Cuisine


def create_restaurant(
    db: Session,
    restaurant: Restaurant,
):

    db.add(restaurant)
    db.commit()
    db.refresh(restaurant)

    return restaurant


def get_restaurant_by_id(
    db: Session,
    restaurant_id: int,
):

    return (
        db.query(Restaurant)
        .filter(Restaurant.id == restaurant_id)
        .first()
    )


def get_all_restaurants(
    db: Session,
):

    return (
        db.query(Restaurant)
        .all()
    )


def get_restaurants_by_owner(
    db: Session,
    owner_id: int,
):

    return (
        db.query(Restaurant)
        .filter(Restaurant.owner_id == owner_id)
        .all()
    )


def update_restaurant(
    db: Session,
    restaurant: Restaurant,
):

    db.commit()
    db.refresh(restaurant)

    return restaurant


def delete_restaurant(
    db: Session,
    restaurant: Restaurant,
):

    db.delete(restaurant)
    db.commit()


def search_restaurants(
    db: Session,
    keyword: str | None = None,
    location: str | None = None,
    category: str | None = None,
):
    from app.models.category import Category
    
    query = db.query(Restaurant)
    joined_category = False

    if keyword:
        query = query.filter(
            Restaurant.name.ilike(f"%{keyword}%")
        )

    if location:
        query = query.filter(
            or_(
                Restaurant.location.ilike(f"%{location}%"),
                Restaurant.address.ilike(f"%{location}%"),
            )
        )

    if category:
        query = query.outerjoin(Restaurant.categories)
        joined_category = True
        query = query.filter(
            Category.name.ilike(f"%{category}%")
        )

    if joined_category:
        query = query.distinct()

    return query.all()