from pydantic import BaseModel, Field


class MenuItemCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100,
    )

    description: str = Field(
        min_length=2,
    )

    price: float = Field(
        gt=0,
    )

    image_url: str | None = None

    category_id: int

    restaurant_id: int


class MenuItemUpdate(BaseModel):
    name: str | None = None

    description: str | None = None

    price: float | None = Field(
        default=None,
        gt=0,
    )

    image_url: str | None = None

    is_available: bool | None = None

    is_special: bool | None = None

    is_deal_of_day: bool | None = None

    category_id: int | None = None


class MenuItemResponse(BaseModel):
    success: bool = True

    id: int

    name: str

    description: str

    price: float

    image_url: str | None

    is_available: bool

    is_special: bool

    is_deal_of_day: bool

    restaurant_id: int

    category_id: int

    class Config:
        from_attributes = True


class GenericMenuResponse(BaseModel):
    success: bool = True

    message: str