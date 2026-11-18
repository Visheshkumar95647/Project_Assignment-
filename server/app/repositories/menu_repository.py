from sqlalchemy.orm import Session

from app.models.menu_item import MenuItem


def create_menu_item(
    db: Session,
    menu_item: MenuItem,
):
    db.add(menu_item)

    db.commit()

    db.refresh(menu_item)

    return menu_item


def get_menu_item_by_id(
    db: Session,
    menu_item_id: int,
):
    return (
        db.query(MenuItem)
        .filter(
            MenuItem.id == menu_item_id
        )
        .first()
    )


def get_all_menu_items(
    db: Session,
):
    return db.query(MenuItem).all()


def get_menu_by_restaurant(
    db: Session,
    restaurant_id: int,
):
    return (
        db.query(MenuItem)
        .filter(
            MenuItem.restaurant_id == restaurant_id
        )
        .all()
    )


def get_menu_by_category(
    db: Session,
    category_id: int,
):
    return (
        db.query(MenuItem)
        .filter(
            MenuItem.category_id == category_id
        )
        .all()
    )


def search_menu_items(
    db: Session,
    keyword: str,
):
    return (
        db.query(MenuItem)
        .filter(
            MenuItem.name.ilike(
                f"%{keyword}%"
            )
        )
        .all()
    )


def update_menu_item(
    db: Session,
    menu_item: MenuItem,
):
    db.commit()

    db.refresh(menu_item)

    return menu_item


def delete_menu_item(
    db: Session,
    menu_item: MenuItem,
):
    db.delete(menu_item)

    db.commit()


def get_special_items(
    db: Session,
):
    return (
        db.query(MenuItem)
        .filter(
            MenuItem.is_special.is_(True)
        )
        .all()
    )


def get_deal_of_day_items(
    db: Session,
):
    return (
        db.query(MenuItem)
        .filter(
            MenuItem.is_deal_of_day.is_(True)
        )
        .all()
    )


def get_available_items(
    db: Session,
):
    return (
        db.query(MenuItem)
        .filter(
            MenuItem.is_available.is_(True)
        )
        .all()
    )

    from sqlalchemy.orm import Session

from app.models.category import Category


def get_category_by_id(
    db: Session,
    category_id: int,
):
    return (
        db.query(Category)
        .filter(
            Category.id == category_id,
        )
        .first()
    )


def get_category_by_id_and_restaurant(
    db: Session,
    category_id: int,
    restaurant_id: int,
):
    return (
        db.query(Category)
        .filter(
            Category.id == category_id,
            Category.restaurant_id == restaurant_id,
        )
        .first()
    )