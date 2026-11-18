from sqlalchemy.orm import Session
from app.constants.order_status import PENDING
from app.exceptions.custom_exceptions import (
    CartEmptyException,
    CartNotFoundException,
    OrderNotFoundException,
    ForbiddenException,
)
from app.models.order import Order
from app.models.order_item import OrderItem

from app.repositories.cart_repository import (
    get_cart_by_user,
    calculate_total,
    clear_cart,
)

from app.repositories.order_repository import (
    create_order,
    create_order_item,
    get_order_by_id,
    get_customer_orders,
    get_owner_orders,
    update_order,
)


from app.models.user import User

def build_order_response(order: Order):
    items = []

    for item in order.order_items:
        items.append(
            {
                "id": item.id,
                "menu_item_id": item.menu_item.id,
                "menu_item_name": item.menu_item.name,
                "quantity": item.quantity,
                "price": item.price,
                "subtotal": item.quantity * item.price,
            }
        )

    return {
        "success": True,
        "id": order.id,

        "customer_id": order.customer_id,

        "customer_name": order.customer.name,
        "customer_email": order.customer.email,
        "customer_phone": getattr(order.customer, "phone", None),

        "restaurant_id": order.restaurant_id,
        "status": order.status,
        "total_amount": order.total_amount,
        "created_at": order.created_at,
        "items": items,
    }


def place_order(
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

    restaurant_id = cart.cart_items[0].menu_item.restaurant_id

    order = create_order(
        db,
        Order(
            customer_id=user_id,
            restaurant_id=restaurant_id,
            total_amount=calculate_total(cart),
            status=PENDING,
        ),
    )

    for item in cart.cart_items:

        create_order_item(
            db,
            OrderItem(
                order_id=order.id,
                menu_item_id=item.menu_item_id,
                quantity=item.quantity,
                price=item.menu_item.price,
            ),
        )

    clear_cart(
        db,
        cart,
    )

    db.refresh(order)

    return build_order_response(order)


def fetch_customer_orders(
    db: Session,
    user_id: int,
):

    orders = get_customer_orders(
        db,
        user_id,
    )

    return [build_order_response(order) for order in orders]


def fetch_order(
    db: Session,
    order_id: int,
    user_id: int,
):

    order = get_order_by_id(
        db,
        order_id,
    )

    if not order:
        raise OrderNotFoundException()

    if order.customer_id != user_id:
        raise ForbiddenException("You cannot access this order.")

    return build_order_response(order)


def fetch_order_history(
    db: Session,
    user_id: int,
):

    orders = get_customer_orders(
        db,
        user_id,
    )

    completed_orders = [
        order
        for order in orders
        if order.status
        in (
            "Completed",
            "Cancelled",
        )
    ]

    return [build_order_response(order) for order in completed_orders]


def fetch_active_orders(
    db: Session,
    user_id: int,
):

    orders = get_customer_orders(
        db,
        user_id,
    )

    active_orders = [
        order
        for order in orders
        if order.status
        in (
            "Pending",
            "Preparing",
            "Ready",
        )
    ]

    return [build_order_response(order) for order in active_orders]


def fetch_owner_orders(
    db: Session,
    owner_id: int,
):

    orders = get_owner_orders(
        db,
        owner_id,
    )

    return [build_order_response(order) for order in orders]


def update_order_status(
    db: Session,
    order_id: int,
    payload,
    owner_id: int,
):

    order = get_order_by_id(
        db,
        order_id,
    )

    if not order:
        raise OrderNotFoundException()

    if order.restaurant.owner_id != owner_id:
        raise ForbiddenException("You cannot update this order.")

    order.status = payload.status

    update_order(
        db=db,
        order=order,
    )

    return {
        "success": True,
        "message": "Order status updated successfully",
    }


def search_order_history(
    db: Session,
    user_id: int,
    keyword: str | None = None,
    status: str | None = None,
):
    from app.repositories.order_repository import search_customer_orders

    orders = search_customer_orders(
        db=db,
        customer_id=user_id,
        keyword=keyword,
        status=status,
    )

    return [build_order_response(order) for order in orders]
