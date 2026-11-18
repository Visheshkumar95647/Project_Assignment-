from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.logger import get_logger
from app.core.security import require_customer

from app.schemas.cart import (
    AddToCartRequest,
    UpdateCartItemRequest,
    CartResponse,
    GenericCartResponse,
)

from app.services.cart_service import (
    add_item_to_cart,
    fetch_cart,
    update_item_quantity,
    remove_item,
    clear_customer_cart,
)

router = APIRouter(
    prefix="/api/v1/cart",
    tags=["Cart"],
)

logger = get_logger(__name__)

@router.post(
    "/items",
    response_model=CartResponse,
)
def add_item(
    payload: AddToCartRequest,
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    cart = add_item_to_cart(
        db=db,
        payload=payload,
        user_id=current_user["user_id"],
    )

    logger.info(
        f"User {current_user['user_id']} added menu item "
        f"{payload.menu_item_id} to cart."
    )

    return cart

@router.get(
    "",
    response_model=CartResponse,
)
def get_cart(
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    return fetch_cart(
        db=db,
        user_id=current_user["user_id"],
    )

@router.put(
    "/items/{cart_item_id}",
    response_model=CartResponse,
)
def update_quantity(
    cart_item_id: int,
    payload: UpdateCartItemRequest,
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    cart = update_item_quantity(
        db=db,
        cart_item_id=cart_item_id,
        payload=payload,
        user_id=current_user["user_id"],
    )

    logger.info(
        f"User {current_user['user_id']} updated cart item "
        f"{cart_item_id}."
    )

    return cart

@router.delete(
    "/items/{cart_item_id}",
    response_model=GenericCartResponse,
)
def delete_item(
    cart_item_id: int,
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    return remove_item(
        db=db,
        cart_item_id=cart_item_id,
        user_id=current_user["user_id"],
    )

@router.delete(
    "/clear",
    response_model=GenericCartResponse,
)
def clear_cart(
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    return clear_customer_cart(
        db=db,
        user_id=current_user["user_id"],
    )
