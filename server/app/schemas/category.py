from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100,
    )

    restaurant_id: int


class CategoryUpdate(BaseModel):
    name: str | None = None


class CategoryResponse(BaseModel):
    success: bool = True

    id: int

    name: str

    restaurant_id: int

    class Config:
        from_attributes = True


class GenericCategoryResponse(BaseModel):
    success: bool = True

    message: str