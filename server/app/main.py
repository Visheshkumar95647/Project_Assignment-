from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.routers import restaurant
from app.core.config import APP_NAME, APP_DESCRIPTION, APP_VERSION
from app.middleware.cors import add_cors
from app.middleware.request_logger import RequestLoggerMiddleware

from app.exceptions.custom_exceptions import (
    BadRequestException,
    ConflictException,
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

from app.exceptions.handlers import (
    bad_request_exception_handler,
    conflict_exception_handler,
    different_restaurant_cart_exception_handler,
    restaurant_not_found_handler,
    menu_item_not_found_handler,
    category_not_found_handler,
    cart_not_found_handler,
    cart_empty_handler,
    order_not_found_handler,
    unauthorized_handler,
    forbidden_handler,
    user_not_found_handler,
    invalid_credentials_handler,
)
from app.routers import auth_routes
from app.routers import menu_routes
from app.routers import category_routes
from app.routers import cart_routes
from app.routers import order_routes
from app.routers import favourite_routes
from app.routers import preference_routes
from app.routers import profile_routes
from app.routers import recommendation_routes

app = FastAPI(
    title=APP_NAME,
    description=APP_DESCRIPTION,
    version=APP_VERSION,
)

# Middleware
add_cors(app)
app.add_middleware(RequestLoggerMiddleware)

# Exception Handlers
app.add_exception_handler(
    DifferentRestaurantCartException,
    different_restaurant_cart_exception_handler,
)
app.add_exception_handler(
    RestaurantNotFoundException,
    restaurant_not_found_handler,
)
app.add_exception_handler(
    BadRequestException,
    bad_request_exception_handler,
)
app.add_exception_handler(
    MenuItemNotFoundException,
    menu_item_not_found_handler,
)
app.add_exception_handler(
    ConflictException,
    conflict_exception_handler,
)
app.add_exception_handler(
    CategoryNotFoundException,
    category_not_found_handler,
)

app.add_exception_handler(
    CartNotFoundException,
    cart_not_found_handler,
)

app.add_exception_handler(
    CartEmptyException,
    cart_empty_handler,
)

app.add_exception_handler(
    OrderNotFoundException,
    order_not_found_handler,
)

app.add_exception_handler(
    UnauthorizedException,
    unauthorized_handler,
)
app.add_exception_handler(
    UserNotFoundException,
    user_not_found_handler,
)

app.add_exception_handler(
    InvalidCredentialsException,
    invalid_credentials_handler,
)
app.add_exception_handler(
    ForbiddenException,
    forbidden_handler,
)



@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception,
):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal Server Error",
        },
    )


@app.get("/")   
def home():
    return {
        "success": True,
        "message": f"Welcome to {APP_NAME}",
    }

app.include_router(auth_routes.router)
app.include_router(restaurant.router)
app.include_router(category_routes.router)
app.include_router(cart_routes.router)
app.include_router(menu_routes.router)
app.include_router(order_routes.router)
app.include_router(favourite_routes.router)
app.include_router(preference_routes.router)
app.include_router(profile_routes.router)
app.include_router(recommendation_routes.router)