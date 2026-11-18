from app.core.database import SessionLocal
from app.models.restaurant import Restaurant
from app.models.user import User


def seed_restaurants():

    db = SessionLocal()

    try:

        owner1 = (
            db.query(User)
            .filter(User.email == "owner1@example.com")
            .first()
        )

        owner2 = (
            db.query(User)
            .filter(User.email == "owner2@example.com")
            .first()
        )

        if not owner1 or not owner2:
            print(
                "Restaurant owners not found. "
                "Run user seed first."
            )
            return

        restaurants = [
            {
                "name": "Spice Garden",
                "description": "Authentic Indian Cuisine",
                "address": "Sector 29, Gurgaon",
                "phone": "9876543210",
                "image_url": "https://images.unsplash.com/photo-1585521537190-6ba7f3e91490?w=500&h=400&fit=crop",
                "owner_id": owner1.id,
                "location": "Gurgaon",
            },
            {
                "name": "Dragon Bowl",
                "description": "Chinese Cuisine & Noodles",
                "address": "Cyber Hub, Gurgaon",
                "phone": "9876543211",
                "image_url": "https://images.unsplash.com/photo-1565958011504-98d15fac0f46?w=500&h=400&fit=crop",
                "owner_id": owner2.id,
                "location": "Gurgaon",
            },
            {
                "name": "Pizza Palace",
                "description": "Italian Pizzas & Pasta",
                "address": "South Delhi",
                "phone": "9876543212",
                "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=400&fit=crop",
                "owner_id": owner1.id,
                "location": "Delhi",
            },
            {
                "name": "Sushi Masters",
                "description": "Japanese Sushi & Ramen",
                "address": "MG Road, Bangalore",
                "phone": "9876543213",
                "image_url": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=400&fit=crop",
                "owner_id": owner2.id,
                "location": "Bangalore",
            },
            {
                "name": "Taco Fiesta",
                "description": "Mexican Street Food",
                "address": "Bandra, Mumbai",
                "phone": "9876543214",
                "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=400&fit=crop",
                "owner_id": owner1.id,
                "location": "Mumbai",
            },
        ]

        for restaurant_data in restaurants:

            existing_restaurant = (
                db.query(Restaurant)
                .filter(
                    Restaurant.name == restaurant_data["name"]
                )
                .first()
            )

            if not existing_restaurant:

                restaurant = Restaurant(
                    name=restaurant_data["name"],
                    description=restaurant_data["description"],
                    address=restaurant_data["address"],
                    phone=restaurant_data["phone"],
                    image_url=restaurant_data["image_url"],
                    location=restaurant_data.get("location"),
                    owner_id=restaurant_data["owner_id"],
                )

                db.add(restaurant)

        db.commit()

        print("Restaurants seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_restaurants()