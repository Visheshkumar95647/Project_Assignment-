from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.logger import get_logger
from app.core.security import (
    require_customer,
    require_owner,
)

from app.schemas.order import (
    OrderResponse,
    OrderStatusUpdate,
    GenericOrderResponse,
)

from app.services.order_service import (
    place_order,
    fetch_active_orders,
    fetch_order_history,
    fetch_order,
    fetch_owner_orders,
    update_order_status,
    search_order_history,
)

router = APIRouter(
    prefix="/api/v1/orders",
    tags=["Orders"],
)

logger = get_logger(__name__)

@router.post(
    "",
    response_model=OrderResponse,
)
def create_order(
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    order = place_order(
        db=db,
        user_id=current_user["user_id"],
    )

    logger.info(
        f"Order placed by customer "
        f"{current_user['user_id']}"
    )

    return order
@router.get(
    "",
    response_model=list[OrderResponse],
)
def get_orders(
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    return fetch_active_orders(
        db=db,
        user_id=current_user["user_id"],
    )
@router.get(
    "/history",
    response_model=list[OrderResponse],
)
def history(
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    return fetch_order_history(
        db=db,
        user_id=current_user["user_id"],
    )


@router.get(
    "/search",
    response_model=list[OrderResponse],
)
def search_history(
    keyword: str | None = Query(None, description="Search by restaurant name"),
    status: str | None = Query(None, description="Filter by order status"),
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):
    """Search order history with optional filters"""
    return search_order_history(
        db=db,
        user_id=current_user["user_id"],
        keyword=keyword,
        status=status,
    )


@router.get(
    "/owner",
    response_model=list[OrderResponse],
)
def owner_orders(
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):

    return fetch_owner_orders(
        db=db,
        owner_id=current_user["user_id"],
    )
@router.get(
    "/{order_id}",
    response_model=OrderResponse,
)
def get_order(
    order_id: int,
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    return fetch_order(
        db=db,
        order_id=order_id,
        user_id=current_user["user_id"],
    )
@router.patch(
    "/{order_id}/status",
    response_model=GenericOrderResponse,
)
def change_status(
    order_id: int,
    payload: OrderStatusUpdate,
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):

    response = update_order_status(
        db=db,
        order_id=order_id,
        payload=payload,
        owner_id=current_user["user_id"],
    )

    logger.info(
        f"Owner {current_user['user_id']} "
        f"updated order {order_id} "
        f"to {payload.status}"
    )

    return response
