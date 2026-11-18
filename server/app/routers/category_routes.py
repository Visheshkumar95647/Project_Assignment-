from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.logger import get_logger
from app.core.security import require_owner

from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    GenericCategoryResponse,
)

from app.services.category_service import (
    create_new_category,
    fetch_category,
    fetch_all_categories,
    fetch_restaurant_categories,
    edit_category,
    remove_category,
    search_category,
)

router = APIRouter(
    prefix="/api/v1/categories",
    tags=["Categories"],
)

logger = get_logger(__name__)


@router.post(
    "",
    response_model=CategoryResponse,
)
def create_category(
    payload: CategoryCreate,
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):
    category = create_new_category(
        db=db,
        payload=payload,
        owner_id=current_user["user_id"],
    )

    logger.info(
        f"Category '{category.name}' created by owner "
        f"{current_user['user_id']}"
    )

    return category


@router.get(
    "",
    response_model=list[CategoryResponse],
)
def get_categories(
    db: Session = Depends(get_db),
):
    return fetch_all_categories(db)


@router.get(
    "/search",
    response_model=list[CategoryResponse],
)
def search_categories(
    keyword: str = Query(
        ...,
        min_length=1,
        max_length=100,
    ),
    db: Session = Depends(get_db),
):
    return search_category(
        db=db,
        keyword=keyword,
    )


@router.get(
    "/restaurant/{restaurant_id}",
    response_model=list[CategoryResponse],
)
def restaurant_categories(
    restaurant_id: int,
    db: Session = Depends(get_db),
):
    return fetch_restaurant_categories(
        db=db,
        restaurant_id=restaurant_id,
    )


@router.get(
    "/{category_id}",
    response_model=CategoryResponse,
)
def get_category(
    category_id: int,
    db: Session = Depends(get_db),
):
    return fetch_category(
        db=db,
        category_id=category_id,
    )


@router.put(
    "/{category_id}",
    response_model=CategoryResponse,
)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):
    category = edit_category(
        db=db,
        category_id=category_id,
        payload=payload,
        owner_id=current_user["user_id"],
    )

    logger.info(
        f"Category '{category.name}' updated."
    )

    return category


@router.delete(
    "/{category_id}",
    response_model=GenericCategoryResponse,
)
def delete_category(
    category_id: int,
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
):
    remove_category(
        db=db,
        category_id=category_id,
        owner_id=current_user["user_id"],
    )

    logger.info(
        f"Category {category_id} deleted."
    )

    return {
        "success": True,
        "message": "Category deleted successfully",
    }