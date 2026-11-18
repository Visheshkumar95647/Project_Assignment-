from pydantic import BaseModel

from app.schemas.category import CategoryResponse


class PreferenceCreate(BaseModel):
    dietary_restrictions: str | None = None


class PreferenceUpdate(BaseModel):
    dietary_restrictions: str | None = None
    favorite_category_ids: list[int] | None = None


class PreferenceResponse(BaseModel):
    id: int
    user_id: int
    dietary_restrictions: str | None
    favorite_categories: list[CategoryResponse] = []

    class Config:
        from_attributes = True


class GenericPreferenceResponse(BaseModel):
    success: bool = True
    message: str