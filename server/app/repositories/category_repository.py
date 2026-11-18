from sqlalchemy.orm import Session

from app.models.category import Category


def create_category(
    db: Session,
    category: Category,
) -> Category:

    db.add(category)

    db.commit()

    db.refresh(category)

    return category


def get_category_by_id(
    db: Session,
    category_id: int,
) -> Category | None:

    return (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )


def get_all_categories(
    db: Session,
):

    return db.query(Category).all()


def get_categories_by_restaurant(
    db: Session,
    restaurant_id: int,
):

    return (
        db.query(Category)
        .filter(
            Category.restaurant_id == restaurant_id
        )
        .all()
    )


def update_category(
    db: Session,
    category: Category,
):

    db.commit()

    db.refresh(category)

    return category


def delete_category(
    db: Session,
    category: Category,
):

    db.delete(category)

    db.commit()


def search_categories(
    db: Session,
    keyword: str,
):

    return (
        db.query(Category)
        .filter(
            Category.name.ilike(
                f"%{keyword}%"
            )
        )
        .all()
    )