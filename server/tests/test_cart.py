from tests.utils import get_customer_token, get_owner_token


def create_menu_item(client, restaurant_name="Cart Restaurant", category_name="Burger", menu_name="Veg Burger"):
    owner_headers = get_owner_token(client)

    restaurant = client.post(
        "/api/v1/restaurants",
        json={
            "name": restaurant_name,
            "description": "Restaurant for cart testing",
            "address": "Delhi",
            "phone": "9876543210",
            "location": "Delhi",
            "image_url": "https://image.com/test.jpg",
        },
        headers=owner_headers,
    )

    assert restaurant.status_code == 200, restaurant.json()

    restaurant_id = restaurant.json()["id"]

    category = client.post(
        "/api/v1/categories",
        json={
            "name": category_name,
            "restaurant_id": restaurant_id,
        },
        headers=owner_headers,
    )

    assert category.status_code == 200, category.json()

    category_id = category.json()["id"]

    menu = client.post(
        "/api/v1/menu",
        json={
            "name": menu_name,
            "description": "Very tasty food",
            "price": 150,
            "image_url": "https://image.com/menu.jpg",
            "category_id": category_id,
            "restaurant_id": restaurant_id,
        },
        headers=owner_headers,
    )

    assert menu.status_code == 200, menu.json()

    return {
        "restaurant_id": restaurant_id,
        "menu_item_id": menu.json()["id"],
    }


def test_get_cart_without_login(client):
    response = client.get("/api/v1/cart")
    assert response.status_code == 401


def test_add_item_to_cart(client):
    menu = create_menu_item(client)

    headers = get_customer_token(client)

    response = client.post(
        "/api/v1/cart/items",
        json={
            "menu_item_id": menu["menu_item_id"],
            "quantity": 2,
        },
        headers=headers,
    )

    assert response.status_code == 200, response.json()

    assert response.json()["success"] is True


def test_get_cart(client):
    menu = create_menu_item(client)

    headers = get_customer_token(client)

    client.post(
        "/api/v1/cart/items",
        json={
            "menu_item_id": menu["menu_item_id"],
            "quantity": 1,
        },
        headers=headers,
    )

    response = client.get(
        "/api/v1/cart",
        headers=headers,
    )

    assert response.status_code == 200, response.json()


def test_update_cart_item_quantity(client):
    menu = create_menu_item(client)

    headers = get_customer_token(client)

    add = client.post(
        "/api/v1/cart/items",
        json={
            "menu_item_id": menu["menu_item_id"],
            "quantity": 1,
        },
        headers=headers,
    )

    assert add.status_code == 200, add.json()

    cart_item_id = add.json()["items"][0]["id"]

    response = client.put(
        f"/api/v1/cart/items/{cart_item_id}",
        json={
            "quantity": 5,
        },
        headers=headers,
    )

    assert response.status_code == 200, response.json()

    assert response.json()["success"] is True


def test_remove_cart_item(client):
    menu = create_menu_item(client)

    headers = get_customer_token(client)

    add = client.post(
        "/api/v1/cart/items",
        json={
            "menu_item_id": menu["menu_item_id"],
            "quantity": 1,
        },
        headers=headers,
    )

    assert add.status_code == 200, add.json()

    cart_item_id = add.json()["items"][0]["id"]

    response = client.delete(
        f"/api/v1/cart/items/{cart_item_id}",
        headers=headers,
    )

    assert response.status_code == 200, response.json()

    assert response.json()["success"] is True


def test_clear_cart(client):
    menu = create_menu_item(client)

    headers = get_customer_token(client)

    client.post(
        "/api/v1/cart/items",
        json={
            "menu_item_id": menu["menu_item_id"],
            "quantity": 2,
        },
        headers=headers,
    )

    response = client.delete(
        "/api/v1/cart/clear",
        headers=headers,
    )

    assert response.status_code == 200, response.json()

    assert response.json()["success"] is True

