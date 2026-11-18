from fastapi import status

class UserNotFoundException(Exception):
    pass


class RestaurantNotFoundException(Exception):
    pass


class MenuItemNotFoundException(Exception):
    pass


class CategoryNotFoundException(Exception):
    pass


class CartNotFoundException(Exception):
    pass


class CartEmptyException(Exception):
    pass


class OrderNotFoundException(Exception):
    pass


class InvalidCredentialsException(Exception):
    def __init__(self, message="Invalid credentials"):
        self.message = message
        super().__init__(message)


class UnauthorizedException(Exception):
    def __init__(self, message="Unauthorized"):
        self.message = message
        super().__init__(message)


class ForbiddenException(Exception):
    def __init__(self, message="Access denied"):
        self.message = message
        super().__init__(message)


class ConflictException(Exception):
    def __init__(self, message="Resource already exists"):
        self.message = message
        super().__init__(message)

class BadRequestException(Exception):
    def __init__(
        self,
        detail: str = "Bad Request",
    ):
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = detail
class DifferentRestaurantCartException(Exception):
    def __init__(
        self,
        message="Your cart contains items from another restaurant. Please clear the cart before adding items from a different restaurant.",
    ):
        self.message = message
        super().__init__(message)