from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.logger import get_logger
from app.core.security import require_customer

from app.services.recommendation_service import (
    recommend_restaurants,
    recommend_menu_items,
    recommend_popular,
)

router = APIRouter(
    prefix="/api/v1/recommendations",
    tags=["Recommendations"],
)

logger = get_logger(__name__)

@router.get(
    "/restaurants",
)
def restaurant_recommendations(
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    recommendations = recommend_restaurants(
        db=db,
        user_id=current_user["user_id"],
    )

    logger.info(
        f"Restaurant recommendations generated for user "
        f"{current_user['user_id']}"
    )

    return recommendations

@router.get(
    "/menu",
)
def menu_recommendations(
    current_user=Depends(require_customer),
    db: Session = Depends(get_db),
):

    recommendations = recommend_menu_items(
        db=db,
        user_id=current_user["user_id"],
    )

    logger.info(
        f"Menu recommendations generated for user "
        f"{current_user['user_id']}"
    )

    return recommendations

@router.get(
    "/popular",
)
def popular_recommendations(
    db: Session = Depends(get_db),
):

    logger.info(
        "Popular recommendations requested."
    )

    return recommend_popular(
        db=db,
    )
