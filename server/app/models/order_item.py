from sqlalchemy import (
    Column,
    Float,
    ForeignKey,
    Integer,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    order_id = Column(
        Integer,
        ForeignKey(
            "orders.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    menu_item_id = Column(
        Integer,
        ForeignKey(
            "menu_items.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    quantity = Column(
        Integer,
        nullable=False,
    )

    price = Column(
        Float,
        nullable=False,
    )

    order = relationship(
        "Order",
        back_populates="order_items",
        passive_deletes=True,
    )

    menu_item = relationship(
        "MenuItem",
        back_populates="order_items",
        passive_deletes=True,
    )