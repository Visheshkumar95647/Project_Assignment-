from tests.utils import get_owner_token

def test_get_menu_items(client):
    response = client.get("/api/v1/menu")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_available_menu_items(client):
    response = client.get("/api/v1/menu/available")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_invalid_menu_item(client):
    response = client.get("/api/v1/menu/999999")

    assert response.status_code == 404


def test_create_menu_item_without_token(client):
    payload = {
        "name": "Veg Burger",
        "description": "Test Burger",
        "price": 120,
        "category_id": 1,
        "restaurant_id": 1,
    }

    response = client.post(
        "/api/v1/menu",
        json=payload,
    )

    assert response.status_code == 401


def test_create_menu_item(client):
    headers = get_owner_token(client)

    restaurant = client.post(
        "/api/v1/restaurants",
        json={
            "name": "Menu Restaurant",
            "description": "Best Menu Restaurant",
            "address": "123 MG Road",
            "phone": "9876543210",
            "location": "Delhi",
            "image_url": "https://image.com/test.jpg",
        },
        headers=headers,
    )

    assert restaurant.status_code == 200, restaurant.json()

    restaurant_id = restaurant.json()["id"]

    category = client.post(
        "/api/v1/categories",
        json={
            "name": "Burger",
            "restaurant_id": restaurant_id,
        },
        headers=headers,
    )

    assert category.status_code == 200, category.json()

    category_id = category.json()["id"]

    payload = {
        "name": "Veg Burger",
        "description": "Loaded Veg Burger",
        "price": 199,
        "image_url": "https://image.com/burger.jpg",
        "category_id": category_id,
        "restaurant_id": restaurant_id,
    }

    response = client.post(
        "/api/v1/menu",
        json=payload,
        headers=headers,
    )

    assert response.status_code == 200, response.json()

    data = response.json()

    assert data["name"] == payload["name"]
    assert data["price"] == payload["price"]


def test_update_menu_item(client):
    headers = get_owner_token(client)

    restaurant = client.post(
        "/api/v1/restaurants",
        json={
            "name": "Update Menu",
            "description": "Restaurant For Update",
            "address": "123 MG Road",
            "phone": "9876543210",
            "location": "Delhi",
            "image_url": "https://image.com/test.jpg",
        },
        headers=headers,
    )

    assert restaurant.status_code == 200, restaurant.json()

    restaurant_id = restaurant.json()["id"]

    category = client.post(
        "/api/v1/categories",
        json={
            "name": "Pizza",
            "restaurant_id": restaurant_id,
        },
        headers=headers,
    )

    assert category.status_code == 200, category.json()

    category_id = category.json()["id"]

    menu = client.post(
        "/api/v1/menu",
        json={
            "name": "Margherita",
            "description": "Cheese Pizza",
            "price": 299,
            "image_url": "https://image.com/pizza.jpg",
            "category_id": category_id,
            "restaurant_id": restaurant_id,
        },
        headers=headers,
    )

    assert menu.status_code == 200, menu.json()

    menu_id = menu.json()["id"]

    response = client.put(
        f"/api/v1/menu/{menu_id}",
        json={
            "price": 349,
        },
        headers=headers,
    )

    assert response.status_code == 200, response.json()
    assert response.json()["price"] == 349


def test_delete_menu_item(client):
    headers = get_owner_token(client)

    restaurant = client.post(
        "/api/v1/restaurants",
        json={
            "name": "Delete Menu",
            "description": "Restaurant For Delete",
            "address": "123 MG Road",
            "phone": "9876543210",
            "location": "Delhi",
            "image_url": "https://image.com/test.jpg",
        },
        headers=headers,
    )

    assert restaurant.status_code == 200, restaurant.json()

    restaurant_id = restaurant.json()["id"]

    category = client.post(
        "/api/v1/categories",
        json={
            "name": "Chinese",
            "restaurant_id": restaurant_id,
        },
        headers=headers,
    )

    assert category.status_code == 200, category.json()

    category_id = category.json()["id"]

    menu = client.post(
        "/api/v1/menu",
        json={
            "name": "Noodles",
            "description": "Veg Noodles",
            "price": 180,
            "image_url": "https://image.com/noodles.jpg",
            "category_id": category_id,
            "restaurant_id": restaurant_id,
        },
        headers=headers,
    )

    assert menu.status_code == 200, menu.json()

    menu_id = menu.json()["id"]

    response = client.delete(
        f"/api/v1/menu/{menu_id}",
        headers=headers,
    )

    assert response.status_code == 200, response.json()

    data = response.json()

    assert data["success"] is True