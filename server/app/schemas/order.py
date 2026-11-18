from typing import Literal

from pydantic import BaseModel
from datetime import datetime


OrderStatus = Literal[
    "Pending",
    "Preparing",
    "Ready",
    "Completed",
    "Cancelled",
]

class OrderItemResponse(BaseModel):
    id:int
    menu_item_id:int
    menu_item_name:str
    quantity:int
    price:float
    subtotal:float

    class config:
        from_attributes = True

class OrderResponse(BaseModel):
    success: bool = True

    id: int

    customer_id: int
    customer_name: str
    customer_email: str
    customer_phone: str | None = None

    restaurant_id: int

    status: OrderStatus

    total_amount: float

    created_at: datetime

    items: list[OrderItemResponse]

    class Config:
        from_attributes = True
        
class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class GenericOrderResponse(BaseModel):
    success: bool = True
    message: str
    