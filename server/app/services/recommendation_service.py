from collections import Counter

from sqlalchemy.orm import Session

from app.repositories.recommendation_repository import (
    get_menu_items_by_category,
    get_order_items,
    get_popular_menu_items,
    get_popular_restaurants,
    get_restaurants_by_category,
    get_restaurants_by_categories,
    get_user_favorites,
    get_user_orders,
    get_user_preference,
)


def recommend_restaurants(
    db: Session,
    user_id: int,
):
    # -------------------------
    # 1. Order History
    # -------------------------

    orders = get_user_orders(
        db,
        user_id,
    )

    if orders:

        categories = []

        for order in orders:

            items = get_order_items(
                db,
                order.id,
            )

            for item in items:
                categories.append(
                    item.menu_item.category_id
                )

        most_common = Counter(categories).most_common(1)

        if most_common:
            return get_restaurants_by_category(
                db,
                most_common[0][0],
            )

    # -------------------------
    # 2. Favourite Restaurants
    # -------------------------

    favorites = get_user_favorites(
        db,
        user_id,
    )

    if favorites:

        categories = []

        for favorite in favorites:

            for menu_item in favorite.restaurant.menu_items:

                categories.append(
                    menu_item.category_id
                )

        most_common = Counter(categories).most_common(1)

        if most_common:

            restaurants = get_restaurants_by_category(
                db,
                most_common[0][0],
            )

            favorite_ids = [
                favorite.restaurant.id
                for favorite in favorites
            ]

            restaurants = [
                restaurant
                for restaurant in restaurants
                if restaurant.id not in favorite_ids
            ]

            if restaurants:
                return restaurants

    # -------------------------
    # 3. Preference Categories
    # -------------------------

    preference = get_user_preference(
        db,
        user_id,
    )

    if (
        preference
        and preference.favorite_categories
    ):

        category_ids = [
            category.id
            for category in preference.favorite_categories
        ]

        restaurants = get_restaurants_by_categories(
            db,
            category_ids,
        )

        if restaurants:
            return restaurants

    # -------------------------
    # 4. Popular
    # -------------------------

    return get_popular_restaurants(
        db,
    )


def recommend_menu_items(
    db: Session,
    user_id: int,
):
    # -------------------------
    # 1. Recommend from Order History
    # -------------------------

    orders = get_user_orders(
        db,
        user_id,
    )

    if orders:

        categories = []

        for order in orders:

            items = get_order_items(
                db,
                order.id,
            )

            for item in items:

                categories.append(
                    item.menu_item.category_id
                )

        most_common = Counter(
            categories
        ).most_common(1)

        if most_common:

            return get_menu_items_by_category(
                db,
                most_common[0][0],
            )

    # -------------------------
    # 2. Recommend from Preferences
    # -------------------------

    preference = get_user_preference(
        db,
        user_id,
    )

    if (
        preference
        and preference.favorite_categories
    ):

        items = []

        for category in preference.favorite_categories:

            items.extend(
                get_menu_items_by_category(
                    db,
                    category.id,
                )
            )

        if items:
            return items

    # -------------------------
    # 3. Popular Menu Items
    # -------------------------

    return get_popular_menu_items(
        db,
    )


def recommend_popular(
    db: Session,
):
    return {
        "restaurants": get_popular_restaurants(
            db,
        ),
        "menu_items": get_popular_menu_items(
            db,
        ),
    }