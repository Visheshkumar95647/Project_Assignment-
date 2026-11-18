from app.core.database import SessionLocal
from app.models.category import Category
from app.models.menu_item import MenuItem
from app.models.restaurant import Restaurant


def seed_menu_items():

    db = SessionLocal()

    try:

        restaurants = db.query(Restaurant).all()

        if not restaurants:
            print("No restaurants found. Seed restaurants first.")
            return

        for restaurant in restaurants:

            categories = (
                db.query(Category)
                .filter(
                    Category.restaurant_id == restaurant.id
                )
                .all()
            )

            if not categories:
                print(
                    f"No categories found for "
                    f"{restaurant.name}"
                )
                continue

            menu_items = [
                {
                    "name": "Paneer Butter Masala",
                    "description": "Creamy cottage cheese curry",
                    "price": 299,
                    "category": "Indian",
                    "image_url": "https://images.unsplash.com/photo-1601667089162-04a1f3a77f9e?w=400&h=400&fit=crop",
                    "is_special": True,
                },
                {
                    "name": "Hakka Noodles",
                    "description": "Vegetable hakka noodles",
                    "price": 249,
                    "category": "Chinese",
                    "image_url": "https://images.unsplash.com/photo-1609501676725-7186f017a4b8?w=400&h=400&fit=crop",
                    "is_special": False,
                },
                {
                    "name": "Margherita Pizza",
                    "description": "Classic cheese pizza",
                    "price": 399,
                    "category": "Italian",
                    "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop",
                    "is_special": False,
                    "is_deal_of_day": True,
                },
                {
                    "name": "Masala Dosa",
                    "description": "South Indian dosa",
                    "price": 199,
                    "category": "South Indian",
                    "image_url": "https://images.unsplash.com/photo-1644018545476-e48897970ff5?w=400&h=400&fit=crop",
                    "is_special": True,
                },
                {
                    "name": "Brownie",
                    "description": "Chocolate brownie",
                    "price": 149,
                    "category": "Desserts",
                    "image_url": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop",
                    "is_special": False,
                },
                {
                    "name": "Cold Coffee",
                    "description": "Chilled coffee",
                    "price": 129,
                    "category": "Beverages",
                    "image_url": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop",
                    "is_special": False,
                },
            ]

            for item in menu_items:

                category = (
                    db.query(Category)
                    .filter(
                        Category.restaurant_id == restaurant.id,
                        Category.name == item["category"],
                    )
                    .first()
                )

                if not category:
                    continue

                exists = (
                    db.query(MenuItem)
                    .filter(
                        MenuItem.name == item["name"],
                        MenuItem.restaurant_id == restaurant.id,
                    )
                    .first()
                )

                if exists:
                    continue

                menu_item = MenuItem(
                    name=item["name"],
                    description=item["description"],
                    price=item["price"],
                    image_url=item.get("image_url"),
                    is_special=item.get("is_special", False),
                    is_deal_of_day=item.get("is_deal_of_day", False),
                    restaurant_id=restaurant.id,
                    category_id=category.id,
                )

                db.add(menu_item)

        db.commit()

        print("Menu items seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_menu_items()   