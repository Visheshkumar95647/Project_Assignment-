from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.schemas.auth import (
    RegisterRequest,
    RegisterResponse,
    TokenResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    GenericResponse,
    UserProfileResponse,
)
from app.core.security import (
    get_current_user,
    require_customer,
    require_owner,
)
from app.services.auth_service import (
    register_user,
    authenticate_user,
    refresh_access_token,
    forgot_password,
    reset_password,
)

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=201,
)
def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
):
    user = register_user(
        db=db,
        payload=payload,
    )

    return RegisterResponse(
        success=True,
        message="Registration successful",
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
    )


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    token = authenticate_user(
        db=db,
        email=form_data.username,
        password=form_data.password,
    )

    return TokenResponse(
        success=True,
        message="Login successful",
        access_token=token["access_token"],
        refresh_token=token["refresh_token"],
        token_type="bearer",
        role=token["role"],
    )


@router.post(
    "/refresh",
    response_model=RefreshTokenResponse,
)
def refresh_token(
    payload: RefreshTokenRequest,
):
    access_token = refresh_access_token(
        payload.refresh_token,
    )

    return RefreshTokenResponse(
        success=True,
        message="Access token refreshed successfully",
        access_token=access_token,
        token_type="bearer",
    )


@router.post(
    "/forgot-password",
    response_model=ForgotPasswordResponse,
)
def forgot(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    token = forgot_password(
        db=db,
        email=payload.email,
    )

    return ForgotPasswordResponse(
        success=True,
        message="Password reset token generated successfully",
        reset_token=token,
    )


@router.post(
    "/reset-password",
    response_model=GenericResponse,
)
def reset(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    reset_password(
        db=db,
        reset_token=payload.reset_token,
        new_password=payload.new_password,
    )

    return GenericResponse(
        success=True,
        message="Password reset successfully",
    )
