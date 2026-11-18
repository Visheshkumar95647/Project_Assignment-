from fastapi import Request, status
from fastapi.responses import JSONResponse

from app.exceptions.custom_exceptions import (
    DifferentRestaurantCartException,
    RestaurantNotFoundException,
    MenuItemNotFoundException,
    CategoryNotFoundException,
    CartNotFoundException,
    CartEmptyException,
    OrderNotFoundException,
    UnauthorizedException,
    ForbiddenException,
    UserNotFoundException,
    InvalidCredentialsException,
)
from app.exceptions.custom_exceptions import ConflictException
from fastapi import Request
from fastapi.responses import JSONResponse

from app.exceptions.custom_exceptions import (
    BadRequestException,
)

async def different_restaurant_cart_exception_handler(
    request: Request,
    exc: DifferentRestaurantCartException,
):
    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "message": exc.message,
        },
    )

async def bad_request_exception_handler(
    request: Request,
    exc: BadRequestException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
        },
    )
async def conflict_exception_handler(
    request: Request,
    exc: ConflictException,
):
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={
            "success": False,
            "message": exc.message,
        },
    )



async def restaurant_not_found_handler(
    request: Request,
    exc: RestaurantNotFoundException,
):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "success": False,
            "message": "Restaurant not found",
        },
    )


async def menu_item_not_found_handler(
    request: Request,
    exc: MenuItemNotFoundException,
):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "success": False,
            "message": "Menu item not found",
        },
    )


async def category_not_found_handler(
    request: Request,
    exc: CategoryNotFoundException,
):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "success": False,
            "message": "Category not found",
        },
    )


async def cart_not_found_handler(
    request: Request,
    exc: CartNotFoundException,
):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "success": False,
            "message": "Cart not found",
        },
    )


async def cart_empty_handler(
    request: Request,
    exc: CartEmptyException,
):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "message": "Cart is empty",
        },
    )


async def order_not_found_handler(
    request: Request,
    exc: OrderNotFoundException,
):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "success": False,
            "message": "Order not found",
        },
    )


async def unauthorized_handler(
    request: Request,
    exc: UnauthorizedException,
):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={
            "success": False,
            "message": exc.message,
        },
    )


async def forbidden_handler(
    request: Request,
    exc: ForbiddenException,
):
    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN,
        content={
            "success": False,
            "message": exc.message,
        },
    )
async def user_not_found_handler(
    request: Request,
    exc: UserNotFoundException,
):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "success": False,
            "message": "User not found",
        },
    )
async def invalid_credentials_handler(
    request: Request,
    exc: InvalidCredentialsException,
):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={
            "success": False,
            "message": exc.message,
        },
    )
