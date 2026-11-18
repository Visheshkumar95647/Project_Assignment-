from app.core.database import SessionLocal
from app.repositories.user_repository import (
    create_user,
    get_user_by_email,
)
from app.utils.password import hash_password


def seed_users():
    db = SessionLocal()

    try:
        users = [
            {
                "name": "Customer One",
                "email": "customer1@example.com",
                "password": hash_password("customer123"),
                "role": "customer",
            },
            {
                "name": "Customer Two",
                "email": "customer2@example.com",
                "password": hash_password("customer123"),
                "role": "customer",
            },
            {
                "name": "Owner One",
                "email": "owner1@example.com",
                "password": hash_password("owner123"),
                "role": "owner",
            },
            {
                "name": "Owner Two",
                "email": "owner2@example.com",
                "password": hash_password("owner123"),
                "role": "owner",
            },
        ]

        for user in users:

            if not get_user_by_email(db, user["email"]):

                create_user(
                    db,
                    name=user["name"],
                    email=user["email"],
                    password=user["password"],
                    role=user["role"],
                )

        print("Users seeded successfully.")

    finally:
        db.close()

if __name__ == "__main__":
    seed_users()