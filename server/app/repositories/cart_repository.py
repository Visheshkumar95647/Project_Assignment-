from sqlalchemy.orm import Session

from app.models.cart import Cart
from app.models.cart_item import CartItem


def create_cart(
    db: Session,
    cart: Cart,
):
    db.add(cart)

    db.commit()

    db.refresh(cart)

    return cart


def get_cart_by_user(
    db: Session,
    user_id: int,
):
    return (
        db.query(Cart)
        .filter(
            Cart.user_id == user_id
        )
        .first()
    )


def create_cart_item(
    db: Session,
    cart_item: CartItem,
):
    db.add(cart_item)

    db.commit()

    db.refresh(cart_item)

    return cart_item


def get_cart_item_by_id(
    db: Session,
    cart_item_id: int,
):
    return (
        db.query(CartItem)
        .filter(
            CartItem.id == cart_item_id
        )
        .first()
    )


def get_cart_item(
    db: Session,
    cart_id: int,
    menu_item_id: int,
):
    return (
        db.query(CartItem)
        .filter(
            CartItem.cart_id == cart_id,
            CartItem.menu_item_id == menu_item_id,
        )
        .first()
    )


def get_cart_items(
    db: Session,
    cart_id: int,
):
    return (
        db.query(CartItem)
        .filter(
            CartItem.cart_id == cart_id
        )
        .all()
    )


def update_cart_item(
    db: Session,
    cart_item: CartItem,
):
    db.commit()

    db.refresh(cart_item)

    return cart_item


def delete_cart_item(
    db: Session,
    cart_item: CartItem,
):
    db.delete(cart_item)

    db.commit()


def clear_cart(
    db: Session,
    cart: Cart,
):
    (
        db.query(CartItem)
        .filter(
            CartItem.cart_id == cart.id
        )
        .delete()
    )

    db.commit()


def calculate_total(
    cart: Cart,
):
    total = 0

    for item in cart.cart_items:
        total += (
            item.quantity
            * item.menu_item.price
        )

    return total