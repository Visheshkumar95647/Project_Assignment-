from sqlalchemy.orm import Session

from app.exceptions.custom_exceptions import (
    MenuItemNotFoundException,
    CategoryNotFoundException,
    RestaurantNotFoundException,
    ForbiddenException,
    BadRequestException
)

from app.models.menu_item import MenuItem

from app.repositories.menu_repository import (
    create_menu_item,
    get_menu_item_by_id,
    get_all_menu_items,
    get_menu_by_restaurant,
    get_menu_by_category,
    get_available_items,
    get_special_items,
    get_deal_of_day_items,
    search_menu_items,
    update_menu_item,
    delete_menu_item,
    get_category_by_id_and_restaurant,
)

from app.repositories.restaurant_repository import (
    get_restaurant_by_id,
)

from app.repositories.category_repository import (
    get_category_by_id,
)


def create_new_menu_item(
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
        raise ForbiddenException("You cannot add menu items to this restaurant.")

    category = get_category_by_id(
        db,
        payload.category_id,
    )

    if not category:
        raise CategoryNotFoundException()

    # Ensure the category belongs to the selected restaurant
    if category.restaurant_id != payload.restaurant_id:
        raise ForbiddenException("Category does not belong to this restaurant.")

    menu_item = MenuItem(
        name=payload.name,
        description=payload.description,
        price=payload.price,
        image_url=payload.image_url,
        restaurant_id=payload.restaurant_id,
        category_id=payload.category_id,
        is_available=True,
        is_special=False,
        is_deal_of_day=False,
    )

    return create_menu_item(
        db=db,
        menu_item=menu_item,
    )


def fetch_menu_item(
    db: Session,
    menu_item_id: int,
):

    menu_item = get_menu_item_by_id(
        db,
        menu_item_id,
    )

    if not menu_item:
        raise MenuItemNotFoundException()

    return menu_item


def fetch_all_menu_items(
    db: Session,
):

    return get_all_menu_items(db)


def fetch_restaurant_menu(
    db: Session,
    restaurant_id: int,
):

    restaurant = get_restaurant_by_id(
        db,
        restaurant_id,
    )

    if not restaurant:
        raise RestaurantNotFoundException()

    return get_menu_by_restaurant(
        db,
        restaurant_id,
    )


def fetch_category_menu(
    db: Session,
    category_id: int,
):

    category = get_category_by_id(
        db,
        category_id,
    )

    if not category:
        raise CategoryNotFoundException()

    return get_menu_by_category(
        db,
        category_id,
    )


def fetch_available_menu(
    db: Session,
):

    return get_available_items(db)


def fetch_special_menu(
    db: Session,
):

    return get_special_items(db)


def fetch_deal_of_day(
    db: Session,
):

    return get_deal_of_day_items(db)


def search_menu(
    db: Session,
    keyword: str,
):

    return search_menu_items(
        db,
        keyword,
    )


def edit_menu_item(
    db: Session,
    menu_item_id: int,
    payload,
    owner_id: int,
):
    menu_item = get_menu_item_by_id(
        db=db,
        menu_item_id=menu_item_id,
    )

    if not menu_item:
        raise MenuItemNotFoundException()

    restaurant = get_restaurant_by_id(
        db=db,
        restaurant_id=menu_item.restaurant_id,
    )

    if not restaurant:
        raise RestaurantNotFoundException()

    if restaurant.owner_id != owner_id:
        raise ForbiddenException("You cannot update this menu item.")

    if payload.category_id is not None:
        category = get_category_by_id_and_restaurant(
            db=db,
            category_id=payload.category_id,
            restaurant_id=restaurant.id,
        )

        if not category:
            raise BadRequestException("Category does not belong to this restaurant.")

    update_data = payload.model_dump(
        exclude_unset=True,
    )

    for key, value in update_data.items():
        setattr(
            menu_item,
            key,
            value,
        )

    return update_menu_item(
        db=db,
        menu_item=menu_item,
    )


def remove_menu_item(
    db: Session,
    menu_item_id: int,
    owner_id: int,
):
    menu_item = get_menu_item_by_id(
        db,
        menu_item_id,
    )

    if not menu_item:
        raise MenuItemNotFoundException()

    restaurant = get_restaurant_by_id(
        db,
        menu_item.restaurant_id,
    )

    if not restaurant:
        raise RestaurantNotFoundException()

    if restaurant.owner_id != owner_id:
        raise ForbiddenException("You cannot delete this menu item.")

    delete_menu_item(
        db=db,
        menu_item=menu_item,
    )


def mark_today_special(
    db: Session,
    menu_item_id: int,
    owner_id: int,
):
    menu_item = get_menu_item_by_id(
        db,
        menu_item_id,
    )

    if not menu_item:
        raise MenuItemNotFoundException()

    restaurant = get_restaurant_by_id(
        db,
        menu_item.restaurant_id,
    )

    if restaurant.owner_id != owner_id:
        raise ForbiddenException("You cannot update this menu item.")

    menu_item.is_special = True

    return update_menu_item(
        db=db,
        menu_item=menu_item,
    )


def remove_today_special(
    db: Session,
    menu_item_id: int,
    owner_id: int,
):
    menu_item = get_menu_item_by_id(
        db,
        menu_item_id,
    )

    if not menu_item:
        raise MenuItemNotFoundException()

    restaurant = get_restaurant_by_id(
        db,
        menu_item.restaurant_id,
    )

    if restaurant.owner_id != owner_id:
        raise ForbiddenException("You cannot update this menu item.")

    menu_item.is_special = False

    return update_menu_item(
        db=db,
        menu_item=menu_item,
    )


def mark_deal_of_day(
    db: Session,
    menu_item_id: int,
    owner_id: int,
):
    menu_item = get_menu_item_by_id(
        db,
        menu_item_id,
    )

    if not menu_item:
        raise MenuItemNotFoundException()

    restaurant = get_restaurant_by_id(
        db,
        menu_item.restaurant_id,
    )

    if restaurant.owner_id != owner_id:
        raise ForbiddenException("You cannot update this menu item.")

    menu_item.is_deal_of_day = True

    return update_menu_item(
        db=db,
        menu_item=menu_item,
    )


def remove_deal_of_day(
    db: Session,
    menu_item_id: int,
    owner_id: int,
):
    menu_item = get_menu_item_by_id(
        db,
        menu_item_id,
    )

    if not menu_item:
        raise MenuItemNotFoundException()

    restaurant = get_restaurant_by_id(
        db,
        menu_item.restaurant_id,
    )

    if restaurant.owner_id != owner_id:
        raise ForbiddenException("You cannot update this menu item.")

    menu_item.is_deal_of_day = False

    return update_menu_item(
        db=db,
        menu_item=menu_item,
    )
