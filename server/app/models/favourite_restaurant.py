from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
)

from sqlalchemy.orm import relationship

from app.core.database import Base


class FavouriteRestaurant(Base):
    __tablename__ = "favourite_restaurants"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    restaurant_id = Column(
        Integer,
        ForeignKey("restaurants.id"),
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="favourite_restaurants",
    )

    restaurant = relationship(
        "Restaurant",
        back_populates="favourite_restaurants",
    )