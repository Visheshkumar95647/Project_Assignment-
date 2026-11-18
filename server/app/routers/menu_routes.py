from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.logger import get_logger
from app.core.security import require_owner

from app.schemas.menu_item import (
    MenuItemCreate,
    MenuItemUpdate,
    MenuItemResponse,
    GenericMenuResponse,
)

from app.services.menu_service import (
    create_new_menu_item,
    fetch_menu_item,
    fetch_all_menu_items,
    fetch_restaurant_menu,
    fetch_category_menu,
    fetch_available_menu,
    fetch_special_menu,
    fetch_deal_of_day,
    search_menu,
    edit_menu_item,
    remove_menu_item,
    mark_today_special,
    remove_today_special,
    mark_deal_of_day,
    remove_deal_of_day,
)

from app.services.menu_filter_service import search_menu_items

router = APIRouter(
    prefix="/api/v1/menu",
    tags=["Menu"],
)

logger = get_logger(__name__)


@router.post(
    "",
    response_model=MenuItemResponse,
)
def create_menu(
    payload: MenuItemCreate,
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):
    menu_item = create_new_menu_item(
        db=db,
        payload=payload,
        owner_id=current_user["user_id"],
    )

    logger.info(
        f"Menu item '{menu_item.name}' created by owner "
        f"{current_user['user_id']}"
    )

    return menu_item


@router.get(
    "",
    response_model=list[MenuItemResponse],
)
def get_menu(
    db: Session = Depends(get_db),
):
    return fetch_all_menu_items(db)


@router.get(
    "/search",
    response_model=list[MenuItemResponse],
)
def search(
    keyword: str = Query(
        ...,
        min_length=1,
        max_length=100,
    ),
    db: Session = Depends(get_db),
):
    return search_menu(
        db=db,
        keyword=keyword,
    )


@router.get(
    "/filter",
    response_model=list[MenuItemResponse],
)
def filter_menu(
    keyword: str | None = Query(
        None,
        description="Search by menu item name",
    ),
    category: str | None = Query(
        None,
        description="Filter by category name",
    ),
    restaurant_id: int | None = Query(
        None,
        description="Filter by restaurant",
    ),
    min_price: float | None = Query(
        None,
        description="Minimum price",
    ),
    max_price: float | None = Query(
        None,
        description="Maximum price",
    ),
    category_id: int | None = Query(
        None,
        description="Filter by category",
    ),
    db: Session = Depends(get_db),
):
    """Search and filter menu items by category, restaurant, price and keyword"""

    return search_menu_items(
        db=db,
        keyword=keyword,
        category=category,
        restaurant_id=restaurant_id,
        min_price=min_price,
        max_price=max_price,
        category_id=category_id,
    )


@router.get(
    "/restaurant/{restaurant_id}",
    response_model=list[MenuItemResponse],
)
def restaurant_menu(
    restaurant_id: int,
    db: Session = Depends(get_db),
):
    return fetch_restaurant_menu(
        db=db,
        restaurant_id=restaurant_id,
    )


@router.get(
    "/category/{category_id}",
    response_model=list[MenuItemResponse],
)
def category_menu(
    category_id: int,
    db: Session = Depends(get_db),
):
    return fetch_category_menu(
        db=db,
        category_id=category_id,
    )


@router.get(
    "/available",
    response_model=list[MenuItemResponse],
)
def available_menu(
    db: Session = Depends(get_db),
):
    return fetch_available_menu(db)


@router.get(
    "/specials",
    response_model=list[MenuItemResponse],
)
def specials(
    db: Session = Depends(get_db),
):
    return fetch_special_menu(db)


@router.get(
    "/deals",
    response_model=list[MenuItemResponse],
)
def deals(
    db: Session = Depends(get_db),
):
    return fetch_deal_of_day(db)


@router.get(
    "/{menu_item_id}",
    response_model=MenuItemResponse,
)
def get_menu_item(
    menu_item_id: int,
    db: Session = Depends(get_db),
):
    return fetch_menu_item(
        db=db,
        menu_item_id=menu_item_id,
    )


@router.put(
    "/{menu_item_id}",
    response_model=MenuItemResponse,
)
def update_menu(
    menu_item_id: int,
    payload: MenuItemUpdate,
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):
    menu_item = edit_menu_item(
        db=db,
        menu_item_id=menu_item_id,
        payload=payload,
        owner_id=current_user["user_id"],
    )

    logger.info(
        f"Menu item '{menu_item.name}' updated by owner "
        f"{current_user['user_id']}"
    )

    return menu_item


@router.delete(
    "/{menu_item_id}",
    response_model=GenericMenuResponse,
)
def delete_menu(
    menu_item_id: int,
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):
    remove_menu_item(
        db=db,
        menu_item_id=menu_item_id,
        owner_id=current_user["user_id"],
    )

    logger.info(
        f"Menu item {menu_item_id} deleted by owner "
        f"{current_user['user_id']}"
    )

    return {
        "success": True,
        "message": "Menu item deleted successfully",
    }


@router.patch(
    "/{menu_item_id}/special",
    response_model=MenuItemResponse,
)
def add_special(
    menu_item_id: int,
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):
    menu_item = mark_today_special(
        db=db,
        menu_item_id=menu_item_id,
        owner_id=current_user["user_id"],
    )

    logger.info(
        f"Menu item {menu_item.id} marked as today's special."
    )

    return menu_item


@router.delete(
    "/{menu_item_id}/special",
    response_model=MenuItemResponse,
)
def delete_special(
    menu_item_id: int,
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):
    menu_item = remove_today_special(
        db=db,
        menu_item_id=menu_item_id,
        owner_id=current_user["user_id"],
    )

    logger.info(
        f"Menu item {menu_item.id} removed from today's special."
    )

    return menu_item


@router.patch(
    "/{menu_item_id}/deal",
    response_model=MenuItemResponse,
)
def add_deal(
    menu_item_id: int,
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):
    menu_item = mark_deal_of_day(
        db=db,
        menu_item_id=menu_item_id,
        owner_id=current_user["user_id"],
    )

    logger.info(
        f"Menu item {menu_item.id} marked as deal of the day."
    )

    return menu_item


@router.delete(
    "/{menu_item_id}/deal",
    response_model=MenuItemResponse,
)
def delete_deal(
    menu_item_id: int,
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):
    menu_item = remove_deal_of_day(
        db=db,
        menu_item_id=menu_item_id,
        owner_id=current_user["user_id"],
    )

    logger.info(
        f"Menu item {menu_item.id} removed from deal of the day."
    )

    return menu_item