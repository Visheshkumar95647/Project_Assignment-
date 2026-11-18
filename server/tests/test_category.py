from tests.utils import get_owner_token
def test_get_categories(client):
    response = client.get("/api/v1/categories")

    assert response.status_code == 200


def test_search_categories(client):
    response = client.get(
        "/api/v1/categories/search",
        params={
            "keyword": "Pizza",
        },
    )

    assert response.status_code == 200


def test_create_category_without_token(client):
    payload = {
        "name": "Pizza",
    }

    response = client.post(
        "/api/v1/categories",
        json=payload,
    )

    assert response.status_code == 401


def test_create_category(client):
    headers = get_owner_token(client)

    restaurant = client.post(
        "/api/v1/restaurants",
        json={
            "name": "Food Court",
            "description": "Best Food Restaurant",
            "address": "123 MG Road, Delhi",
            "phone": "9876543210",
            "location": "Delhi",
            "image_url": "https://image.com/test.jpg",
        },
        headers=headers,
    )

    assert restaurant.status_code == 200, restaurant.json()

    restaurant_id = restaurant.json()["id"]

    payload = {
        "name": "Pizza",
        "restaurant_id": restaurant_id,
    }

    response = client.post(
        "/api/v1/categories",
        json=payload,
        headers=headers,
    )

    assert response.status_code == 200, response.json()

    data = response.json()

    assert data["name"] == "Pizza"
    assert data["restaurant_id"] == restaurant_id


def test_search_non_existing_category(client):
    response = client.get(
        "/api/v1/categories/search",
        params={
            "keyword": "XYZ123",
        },
    )

    assert response.status_code == 200

    assert response.json() == []


def test_get_categories_after_creation(client):
    response = client.get("/api/v1/categories")

    assert response.status_code == 200

    assert isinstance(response.json(), list)