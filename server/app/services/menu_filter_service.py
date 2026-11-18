from sqlalchemy.orm import Session

from app.repositories.menu_filter_repository import (
    search_menu_items as search_items_repo,
)


def search_menu_items(
    db: Session,
    keyword: str | None = None,
    category: str | None = None,
    restaurant_id: int | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    category_id: int | None = None,
):
    return search_items_repo(
        db=db,
        keyword=keyword,
        category=category,
        restaurant_id=restaurant_id,
        min_price=min_price,
        max_price=max_price,
        category_id=category_id,
    )