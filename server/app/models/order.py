from datetime import datetime, UTC
import string

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from app.core.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer , primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    restaurant_id = Column(
    Integer,
    ForeignKey(
        "restaurants.id",
        ondelete="CASCADE",
    ),
    nullable=False,
)
    status = Column(String, nullable=False, default="pending")
    total_amount = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now(UTC))
    customer = relationship("User",back_populates="orders")
    restaurant = relationship("Restaurant",back_populates="orders")
    order_items = relationship("OrderItem",back_populates="order",cascade="all, delete-orphan")

    