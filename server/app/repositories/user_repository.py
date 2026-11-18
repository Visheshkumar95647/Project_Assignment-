from sqlalchemy.orm import Session

from app.models.user import User


def create_user(
    db: Session,
    name: str,
    email: str,
    password: str,
    role: str,
) -> User:
    """
    Create a new user.
    """
    user = User(
        name=name,
        email=email,
        password=password,
        role=role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_user_by_id(
    db: Session,
    user_id: int,
) -> User | None:
    """
    Get user by ID.
    """
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


def get_user_by_email(
    db: Session,
    email: str,
) -> User | None:
    """
    Get user by email.
    """
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def update_user_password(
    db: Session,
    user: User,
    new_password: str,
) -> User:
    """
    Update user's password.
    """
    user.password = new_password

    db.commit()
    db.refresh(user)

    return user


def get_all_users(
    db: Session,
) -> list[User]:
    """
    Get all users.
    """
    return (
        db.query(User)
        .all()
    )


def delete_user(
    db: Session,
    user: User,
) -> None:
    """
    Delete a user.
    """
    db.delete(user)
    db.commit()