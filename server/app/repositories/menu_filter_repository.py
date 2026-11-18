from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.menu_item import MenuItem
from app.models.category import Category


def search_menu_items(
    db: Session,
    keyword: str | None = None,
    category: str | None = None,
    restaurant_id: int | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    category_id: int | None = None,
):
    query = (
        db.query(MenuItem)
        .join(Category)
    )

    if keyword:
        query = query.filter(
            MenuItem.name.ilike(f"%{keyword}%")
        )

    if restaurant_id:
        query = query.filter(
            Category.restaurant_id == restaurant_id
        )

    if category_id:
        query = query.filter(
            MenuItem.category_id == category_id
        )

    if min_price is not None:
        query = query.filter(
            MenuItem.price >= min_price
        )

    if max_price is not None:
        query = query.filter(
            MenuItem.price <= max_price
        )

    if category:
        query = query.filter(
            Category.name.ilike(f"%{category}%")
        )

    return query.all()