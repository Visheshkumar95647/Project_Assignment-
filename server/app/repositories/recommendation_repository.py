from sqlalchemy.orm import Session
from app.models.favourite_restaurant import FavouriteRestaurant
from app.models.menu_item import MenuItem
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.restaurant import Restaurant
from sqlalchemy import desc, func
from app.models.preference import Preference
from app.models.category import Category
def get_user_preference(
    db: Session,
    user_id: int,
):
    return (
        db.query(Preference)
        .filter(
            Preference.user_id == user_id
        )
        .first()
    )
def get_restaurants_by_categories(
    db: Session,
    category_ids: list[int],
):
    return (
        db.query(Restaurant)
        .join(Restaurant.categories)
        .filter(
            Category.id.in_(category_ids)
        )
        .distinct()
        .all()
    )
def get_user_orders(
    db: Session,
    user_id: int,
):
    return (
        db.query(Order)
        .filter(
            Order.customer_id == user_id
        )
        .all()
    )


def get_user_favorites(
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


def get_restaurants_by_category(
    db: Session,
    category_id: int,
):
    return (
        db.query(Restaurant)
        .join(Restaurant.menu_items)
        .filter(
            MenuItem.category_id == category_id
        )
        .distinct()
        .all()
    )


def get_menu_items_by_category(
    db: Session,
    category_id: int,
):
    return (
        db.query(MenuItem)
        .filter(
            MenuItem.category_id == category_id,
            MenuItem.is_available.is_(True),
        )
        .all()
    )





def get_popular_restaurants(
    db: Session,
):

    restaurants = (
        db.query(Restaurant)
        .join(Order)
        .group_by(Restaurant.id)
        .order_by(
            desc(
                func.count(Order.id)
            )
        )
        .all()
    )

    if restaurants:
        return restaurants

    return (
        db.query(Restaurant)
        .all()
    )


def get_popular_menu_items(
    db: Session,
):

    items = (
        db.query(MenuItem)
        .join(OrderItem)
        .filter(
            MenuItem.is_available.is_(True),
        )
        .group_by(MenuItem.id)
        .order_by(
            desc(
                func.sum(OrderItem.quantity)
            )
        )
        .all()
    )

    if items:
        return items

    return (
        db.query(MenuItem)
        .filter(
            MenuItem.is_available.is_(True)
        )
        .all()
    )


def get_order_items(
    db: Session,
    order_id: int,
):
    return (
        db.query(OrderItem)
        .filter(
            OrderItem.order_id == order_id
        )
        .all()
    )