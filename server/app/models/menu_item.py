from sqlalchemy import (
    Boolean,
    Column,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


class MenuItem(Base):
    __tablename__ = "menu_items"

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

    price = Column(
        Float,
        nullable=False,
    )

    image_url = Column(
        String,
        nullable=True,
    )

    is_available = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    is_special = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_deal_of_day = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    restaurant_id = Column(
        Integer,
        ForeignKey(
            "restaurants.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    category_id = Column(
        Integer,
        ForeignKey(
            "categories.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    restaurant = relationship(
        "Restaurant",
        back_populates="menu_items",
        passive_deletes=True,
    )

    category = relationship(
        "Category",
        back_populates="menu_items",
        passive_deletes=True,
    )

    cart_items = relationship(
        "CartItem",
        back_populates="menu_item",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    order_items = relationship(
        "OrderItem",
        back_populates="menu_item",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )