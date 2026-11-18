from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.logger import get_logger
from app.core.security import require_owner

from app.schemas.restaurant import (
    RestaurantCreate,
    RestaurantUpdate,
    RestaurantResponse,
    GenericRestaurantResponse,
)

from app.services.restaurant_service import (
    create_new_restaurant,
    fetch_all_restaurants,
    fetch_owner_restaurants,
    fetch_restaurant,
    edit_restaurant,
    remove_restaurant,
    search_restaurant,
)

router = APIRouter(
    prefix="/api/v1/restaurants",
    tags=["Restaurants"],
)

logger = get_logger(__name__)


@router.post(
    "",
    response_model=RestaurantResponse,
)
def create_restaurant(
    payload: RestaurantCreate,
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):
    restaurant = create_new_restaurant(
        db=db,
        payload=payload,
        owner_id=current_user["user_id"],
    )

    logger.info(
        f"Restaurant '{restaurant.name}' created by owner "
        f"{current_user['user_id']}"
    )

    return restaurant


@router.get(
    "",
    response_model=list[RestaurantResponse],
)
def get_restaurants(
    db: Session = Depends(get_db),
):
    return fetch_all_restaurants(db)


@router.get(
    "/search",
    response_model=list[RestaurantResponse],
)
def search_restaurants(
    keyword: str | None = Query(
        None,
        min_length=1,
        max_length=100,
        description="Search restaurant by name",
    ),
    location: str | None = Query(
        None,
        min_length=1,
        max_length=100,
        description="Search restaurant by location",
    ),
    category: str | None = Query(
        None,
        min_length=1,
        max_length=100,
        description="Search restaurant by category",
    ),
    db: Session = Depends(get_db),
):
    return search_restaurant(
        db=db,
        keyword=keyword,
        location=location,
        category=category,
    )


@router.get(
    "/owner/my-restaurants",
    response_model=list[RestaurantResponse],
)
def get_owner_restaurants(
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):
    return fetch_owner_restaurants(
        db=db,
        owner_id=current_user["user_id"],
    )


@router.get(
    "/{restaurant_id}",
    response_model=RestaurantResponse,
)
def get_restaurant(
    restaurant_id: int,
    db: Session = Depends(get_db),
):
    return fetch_restaurant(
        db=db,
        restaurant_id=restaurant_id,
    )


@router.put(
    "/{restaurant_id}",
    response_model=RestaurantResponse,
)
def update_restaurant(
    restaurant_id: int,
    payload: RestaurantUpdate,
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):
    restaurant = edit_restaurant(
        db=db,
        restaurant_id=restaurant_id,
        payload=payload,
        owner_id=current_user["user_id"],
    )

    logger.info(
        f"Restaurant '{restaurant.name}' updated by owner "
        f"{current_user['user_id']}"
    )

    return restaurant


@router.delete(
    "/{restaurant_id}",
    response_model=GenericRestaurantResponse,
)
def delete_restaurant(
    restaurant_id: int,
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):
    remove_restaurant(
        db=db,
        restaurant_id=restaurant_id,
        owner_id=current_user["user_id"],
    )

    logger.info(
        f"Restaurant {restaurant_id} deleted by owner "
        f"{current_user['user_id']}"
    )

    return {
        "success": True,
        "message": "Restaurant deleted successfully",
    }