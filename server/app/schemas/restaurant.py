from pydantic import BaseModel, Field

from app.schemas.category import CategoryResponse


class RestaurantCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    description: str = Field(min_length=5)
    address: str
    phone: str
    location: str | None = None
    image_url: str | None = None


class RestaurantUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    address: str | None = None
    phone: str | None = None
    location: str | None = None
    image_url: str | None = None


class RestaurantResponse(BaseModel):
    success: bool = True
    id: int
    name: str
    description: str
    address: str
    phone: str
    location: str | None
    image_url: str | None
    categories: list[CategoryResponse] = []

    class Config:
        from_attributes = True


class RestaurantListResponse(BaseModel):
    success: bool = True
    restaurants: list[RestaurantResponse]


class GenericRestaurantResponse(BaseModel):
    success: bool = True
    message: str