from app.core.database import SessionLocal
from app.models.category import Category
from app.models.restaurant import Restaurant


def seed_categories():

    db = SessionLocal()

    try:

        restaurants = db.query(Restaurant).all()

        if not restaurants:
            print("No restaurants found. Seed restaurants first.")
            return

        categories = [
            "Indian",
            "Chinese",
            "Italian",
            "South Indian",
            "Desserts",
            "Beverages",
        ]

        for restaurant in restaurants:

            for category_name in categories:

                exists = (
                    db.query(Category)
                    .filter(
                        Category.name == category_name,
                        Category.restaurant_id == restaurant.id,
                    )
                    .first()
                )

                if not exists:

                    category = Category(
                        name=category_name,
                        restaurant_id=restaurant.id,
                    )

                    db.add(category)

        db.commit()

        print("Categories seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_categories()