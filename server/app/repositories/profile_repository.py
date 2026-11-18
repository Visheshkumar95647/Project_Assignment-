from sqlalchemy.orm import Session

from app.models.user import User


def get_user_profile(
    db: Session,
    user_id: int,
):
    return (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )


def update_profile(
    db: Session,
    user: User,
):
    db.commit()

    db.refresh(user)

    return user


def change_password(
    db: Session,
    user: User,
):
    db.commit()

    db.refresh(user)

    return user