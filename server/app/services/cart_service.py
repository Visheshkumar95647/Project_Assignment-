from sqlalchemy.orm import Session

from app.exceptions.custom_exceptions import (
    CartEmptyException,
    CartNotFoundException,
    MenuItemNotFoundException,
    DifferentRestaurantCartException,
)
from app.models.cart import Cart
from app.models.cart_item import CartItem

from app.repositories.cart_repository import (
    calculate_total,
    clear_cart,
    create_cart,
    create_cart_item,
    delete_cart_item,
    get_cart_by_user,
    get_cart_item,
    get_cart_item_by_id,
    update_cart_item,
)

from app.repositories.menu_repository import (
    get_menu_item_by_id,
)

def build_cart_response(
    cart: Cart,
):
    items = []

    for item in cart.cart_items:

        items.append(
            {
                "id": item.id,
                "menu_item_id": item.menu_item.id,
                "menu_item_name": item.menu_item.name,
                "price": item.menu_item.price,
                "quantity": item.quantity,
                "subtotal": (item.quantity * item.menu_item.price),
            }
        )

    return {
        "success": True,
        "cart_id": cart.id,
        "items": items,
        "total_amount": calculate_total(cart),
    }


def fetch_cart(
    db: Session,
    user_id: int,
):

    cart = get_cart_by_user(
        db,
        user_id,
    )

    if not cart:
        raise CartNotFoundException()

    if not cart.cart_items:
        raise CartEmptyException()

    return build_cart_response(cart)


def add_item_to_cart(
    db: Session,
    payload,
    user_id: int,
):

    menu_item = get_menu_item_by_id(
        db,
        payload.menu_item_id,
    )

    if not menu_item:
        raise MenuItemNotFoundException()

    if not menu_item.is_available:
        raise MenuItemNotFoundException(
            "Menu item is unavailable."
        )

    cart = get_cart_by_user(
        db,
        user_id,
    )

    if not cart:

        cart = create_cart(
            db,
            Cart(
                user_id=user_id,
            ),
        )

    else:
        if cart.cart_items:

            existing_restaurant_id = (
                cart.cart_items[0]
                .menu_item
                .restaurant_id
            )

            if (
                existing_restaurant_id
                != menu_item.restaurant_id
            ):
                raise DifferentRestaurantCartException()

    cart_item = get_cart_item(
        db,
        cart.id,
        payload.menu_item_id,
    )

    if cart_item:

        cart_item.quantity += payload.quantity

        update_cart_item(
            db,
            cart_item,
        )

    else:

        create_cart_item(
            db,
            CartItem(
                cart_id=cart.id,
                menu_item_id=payload.menu_item_id,
                quantity=payload.quantity,
            ),
        )

    db.refresh(cart)

    return build_cart_response(cart)

def update_item_quantity(
    db: Session,
    cart_item_id: int,
    payload,
    user_id: int,
):

    cart = get_cart_by_user(
        db,
        user_id,
    )

    if not cart:
        raise CartNotFoundException()

    cart_item = get_cart_item_by_id(
        db,
        cart_item_id,
    )

    if not cart_item:
        raise CartNotFoundException()

    if cart_item.cart_id != cart.id:
        raise CartNotFoundException()

    cart_item.quantity = payload.quantity

    update_cart_item(
        db=db,
        cart_item=cart_item,
    )

    db.refresh(cart)

    return build_cart_response(cart)


def remove_item(
    db: Session,
    cart_item_id: int,
    user_id: int,
):

    cart = get_cart_by_user(
        db,
        user_id,
    )

    if not cart:
        raise CartNotFoundException()

    cart_item = get_cart_item_by_id(
        db,
        cart_item_id,
    )

    if not cart_item:
        raise CartNotFoundException()

    if cart_item.cart_id != cart.id:
        raise CartNotFoundException()

    delete_cart_item(
        db=db,
        cart_item=cart_item,
    )
    return {
        "success": True,
        "message": "Item removed successfully",
    }


def clear_customer_cart(
    db: Session,
    user_id: int,
):

    cart = get_cart_by_user(
        db,
        user_id,
    )

    if not cart:
        raise CartNotFoundException()

    clear_cart(
        db=db,
        cart=cart,
    )
    return {
        "success": True,
        "message": "Cart cleared successfully",
    }


def calculate_cart_total(
    db: Session,
    user_id: int,
):

    cart = get_cart_by_user(
        db,
        user_id,
    )

    if not cart:
        raise CartNotFoundException()

    return {
        "total_amount": calculate_total(cart),
    }
