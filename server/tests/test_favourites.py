from tests.utils import get_customer_token, get_owner_token


def create_restaurant(client):
    owner_headers = get_owner_token(client)

    response = client.post(
        "/api/v1/restaurants",
        json={
            "name": "Favorite Test Restaurant",
            "description": "Restaurant for favorites testing",
            "address": "Delhi",
            "phone": "9876543210",
            "location": "Delhi",
            "image_url": "https://example.com/image.jpg",
        },
        headers=owner_headers,
    )

    assert response.status_code == 200, response.json()

    return response.json()["id"]


def test_get_favorites_without_login(client):
    response = client.get("/api/v1/favorites")

    assert response.status_code == 401


def test_add_favorite_without_login(client):
    response = client.post("/api/v1/favorites/1")

    assert response.status_code == 401


def test_remove_favorite_without_login(client):
    response = client.delete("/api/v1/favorites/1")

    assert response.status_code == 401


def test_get_favorites(client):
    headers = get_customer_token(client)

    response = client.get(
        "/api/v1/favorites",
        headers=headers,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_add_favorite(client):
    restaurant_id = create_restaurant(client)

    headers = get_customer_token(client)

    response = client.post(
        f"/api/v1/favorites/{restaurant_id}",
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["success"] is True


def test_remove_favorite(client):
    restaurant_id = create_restaurant(client)

    headers = get_customer_token(client)

    add = client.post(
        f"/api/v1/favorites/{restaurant_id}",
        headers=headers,
    )

    assert add.status_code == 200

    response = client.delete(
        f"/api/v1/favorites/{restaurant_id}",
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["success"] is True


def test_add_same_favorite_twice(client):
    restaurant_id = create_restaurant(client)

    headers = get_customer_token(client)

    first = client.post(
        f"/api/v1/favorites/{restaurant_id}",
        headers=headers,
    )

    assert first.status_code == 200

    second = client.post(
        f"/api/v1/favorites/{restaurant_id}",
        headers=headers,
    )

    # Your service returns success even if already favorited
    assert second.status_code == 200
    assert second.json()["success"] is True