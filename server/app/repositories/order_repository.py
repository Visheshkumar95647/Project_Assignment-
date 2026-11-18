from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.order_item import OrderItem

def create_order(db:Session , order:Order):
    db.add(order)
    db.commit()
    db.refresh(order)
    return order;

def create_order_item(
    db: Session,
    order_item: OrderItem,
):
    db.add(order_item)

    db.commit()

    db.refresh(order_item)

    return order_item
def get_order_by_id(
    db: Session,
    order_id: int,
):
    return (
        db.query(Order)
        .filter(
            Order.id == order_id
        )
        .first()
    )


def get_customer_orders(
    db: Session,
    customer_id: int,
):
    return (
        db.query(Order)
        .filter(
            Order.customer_id == customer_id
        )
        .order_by(Order.created_at.desc())
        .all()
    )


def get_owner_orders(
    db: Session,
    owner_id: int,
):
    return (
        db.query(Order)
        .join(Order.restaurant)
        .filter(
            Order.restaurant.has(
                owner_id=owner_id
            )
        )
        .order_by(Order.created_at.desc())
        .all()
    )


def update_order(
    db: Session,
    order: Order,
):
    db.commit()

    db.refresh(order)

    return order


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


def calculate_order_total(
    order_items,
):
    total = 0

    for item in order_items:

        total += (
            item.quantity
            * item.price
        )

    return total


def search_customer_orders(
    db: Session,
    customer_id: int,
    keyword: str | None = None,
    status: str | None = None,
):
    query = (
        db.query(Order)
        .filter(Order.customer_id == customer_id)
        .order_by(Order.created_at.desc())
    )

    if keyword:
        from app.models.restaurant import Restaurant
        query = query.join(Order.restaurant).filter(
            Restaurant.name.ilike(f"%{keyword}%")
        )

    if status:
        query = query.filter(Order.status == status)

    return query.all()
