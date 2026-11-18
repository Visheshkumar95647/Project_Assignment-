from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String,
        nullable=False,
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    password = Column(
        String,
        nullable=False,
    )

    role = Column(
        String,
        nullable=False,
    )

    restaurants = relationship(
        "Restaurant",
        back_populates="owner",
        cascade="all, delete-orphan",
    )
    cart = relationship(
        "Cart",
        back_populates="user",
        uselist=False,
    )
    orders = relationship(
        "Order",
        back_populates="customer",
    )
    favourite_restaurants = relationship(
        "FavouriteRestaurant",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    preferences = relationship(
        "Preference",
        back_populates="user",
        cascade="all, delete-orphan",
    )
