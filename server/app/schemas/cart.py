from pydantic import BaseModel, Field


class AddToCartRequest(BaseModel):
    menu_item_id: int
    quantity: int = Field(
        gt=0,
    )


class UpdateCartItemRequest(BaseModel):
    quantity: int = Field(
        gt=0,
    )


class CartItemResponse(BaseModel):
    id: int
    menu_item_id: int
    menu_item_name: str
    price: float
    quantity: int
    subtotal: float

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    success: bool = True

    cart_id: int

    items: list[CartItemResponse]

    total_amount: float

    class Config:
        from_attributes = True


class GenericCartResponse(BaseModel):
    success: bool = True
    message: str