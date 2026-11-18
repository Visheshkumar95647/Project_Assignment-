from pydantic import AliasChoices, BaseModel, EmailStr, Field


class ProfileResponse(BaseModel):
    success: bool = True

    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(
        validation_alias=AliasChoices(
            "current_password",
            "currentPassword",
            "old_password",
        )
    )

    new_password: str = Field(
        min_length=8,
        validation_alias=AliasChoices(
            "new_password",
            "newPassword",
        ),
    )


class GenericProfileResponse(BaseModel):
    success: bool = True
    message: str