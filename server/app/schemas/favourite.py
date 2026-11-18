from pydantic import BaseModel


class FavoriteRestaurantResponse(BaseModel):
    id: int

    restaurant_id: int

    restaurant_name: str

    class Config:
        from_attributes = True


class GenericFavoriteResponse(BaseModel):
    success: bool = True

    message: str