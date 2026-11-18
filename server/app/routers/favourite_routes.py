from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.logger import get_logger
from app.core.security import require_customer

from app.schemas.favourite import (
    FavoriteRestaurantResponse,
    GenericFavoriteResponse,
)

from app.services.favourite_service import (
    fetch_favorites,
    add_favorite_restaurant,
    remove_favorite_restaurant,
)

router = APIRouter(
    prefix="/api/v1/favorites",
    tags=["Favorites"],
)

logger = get_logger(__name__)


@router.get(
    "",
    response_model=list[FavoriteRestaurantResponse],
)
def get_favorites(
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    return fetch_favorites(
        db=db,
        user_id=current_user["user_id"],
    )


@router.post(
    "/{restaurant_id}",
    response_model=GenericFavoriteResponse,
)
def add_favorite(
    restaurant_id: int,
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    response = add_favorite_restaurant(
        db=db,
        restaurant_id=restaurant_id,
        user_id=current_user["user_id"],
    )

    logger.info(
        f"User {current_user['user_id']} added favorite restaurant {restaurant_id}"
    )

    return response


@router.delete(
    "/{restaurant_id}",
    response_model=GenericFavoriteResponse,
)
def remove_favorite(
    restaurant_id: int,
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    response = remove_favorite_restaurant(
        db=db,
        restaurant_id=restaurant_id,
        user_id=current_user["user_id"],
    )

    logger.info(
        f"User {current_user['user_id']} removed favorite restaurant {restaurant_id}"
    )

    return response