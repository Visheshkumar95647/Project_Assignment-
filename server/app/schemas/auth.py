from typing import Literal

from pydantic import BaseModel, EmailStr, Field


RoleType = Literal["customer", "owner"]


class RegisterRequest(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100,
    )
    email: EmailStr
    password: str = Field(
        min_length=6,
    )
    role: RoleType


class RegisterResponse(BaseModel):
    success: bool = True
    message: str = "Registration successful"
    id: int
    name: str
    email: EmailStr
    role: RoleType


class TokenResponse(BaseModel):
    success: bool = True
    message: str = "Login successful"
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    role: RoleType


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class RefreshTokenResponse(BaseModel):
    success: bool = True
    message: str = "Access token refreshed successfully"
    access_token: str
    token_type: str = "bearer"


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    success: bool = True
    message: str
    reset_token: str


class ResetPasswordRequest(BaseModel):
    reset_token: str
    new_password: str = Field(
        min_length=6,
    )


class GenericResponse(BaseModel):
    success: bool = True
    message: str


class UserProfileResponse(BaseModel):
    success: bool = True
    id: int
    name: str
    email: EmailStr
    role: RoleType