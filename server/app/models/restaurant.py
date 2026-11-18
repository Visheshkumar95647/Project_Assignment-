from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    String,
    Text,
    Table,
)
from sqlalchemy.orm import relationship

from app.core.database import Base
# from app.models.cuisine import restaurant_cuisine


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String,
        nullable=False,
    )

    description = Column(
        Text,
        nullable=False,
    )

    address = Column(
        String,
        nullable=False,
    )

    phone = Column(
        String,
        nullable=False,
    )

    location = Column(
        String,
        nullable=True,
    )
    image_url = Column(
        String,
        nullable=True,
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    owner = relationship(
        "User",
        back_populates="restaurants",
    )
    categories = relationship(
        "Category",
        back_populates="restaurant",
        cascade="all, delete-orphan",
    )
    menu_items = relationship(
        "MenuItem",
        back_populates="restaurant",
        cascade="all, delete-orphan",
    )
    orders = relationship(
    "Order",
    back_populates="restaurant",
    cascade="all, delete-orphan",
    passive_deletes=True,
)
    favourite_restaurants = relationship(
        "FavouriteRestaurant",
        back_populates="restaurant",
        cascade="all, delete-orphan",
    )