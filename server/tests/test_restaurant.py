def get_owner_token(client):
    register_payload = {
        "name": "Restaurant Owner",
        "email": "owner@test.com",
        "password": "Password@123",
        "role": "owner",
    }

    client.post(
        "/api/v1/auth/register",
        json=register_payload,
    )

    login = client.post(
        "/api/v1/auth/login",
        data={
            "username": "owner@test.com",
            "password": "Password@123",
        },
    )

    token = login.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}


def test_get_restaurants(client):
    response = client.get("/api/v1/restaurants")

    assert response.status_code == 200


def test_search_restaurants(client):
    response = client.get(
        "/api/v1/restaurants/search",
        params={
            "keyword": "Pizza",
        },
    )

    assert response.status_code == 200


def test_get_restaurant_invalid_id(client):
    response = client.get("/api/v1/restaurants/999999")

    assert response.status_code == 404


def test_create_restaurant(client):
    headers = get_owner_token(client)

    payload = {
        "name": "Dominos",
        "description": "Best Pizza",
        "address": "123 MG Road, Delhi",
        "phone": "9876543210",
        "location": "Delhi",
        "image_url": "https://image.com/pizza.jpg",
    }

    response = client.post(
        "/api/v1/restaurants",
        json=payload,
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == payload["name"]
    assert data["location"] == payload["location"]


def test_get_owner_restaurants(client):
    headers = get_owner_token(client)

    response = client.get(
        "/api/v1/restaurants/owner/my-restaurants",
        headers=headers,
    )

    assert response.status_code == 200


def test_update_restaurant(client):
    headers = get_owner_token(client)

    payload = {
        "name": "Original",
        "description": "Original Restaurant",
        "address": "Sector 18, Noida",
        "phone": "9876543210",
        "location": "Delhi",
        "image_url": "https://image.com/test.jpg",
    }

    created = client.post(
        "/api/v1/restaurants",
        json=payload,
        headers=headers,
    )
    print(created.status_code)
    print(created.json())
    restaurant_id = created.json()["id"]

    response = client.put(
        f"/api/v1/restaurants/{restaurant_id}",
        json={"name": "Updated Restaurant"},
        headers=headers,
    )

    assert response.status_code == 200

    assert response.json()["name"] == "Updated Restaurant"


def test_delete_restaurant(client):
    headers = get_owner_token(client)

    payload = {
    "name": "Delete Restaurant",
    "description": "Restaurant To Delete",
    "address": "Sector 18, Noida",
    "phone": "9876543210",
    "location": "Delhi",
    "image_url": "https://image.com/test.jpg",
    }

    created = client.post(
        "/api/v1/restaurants",
        json=payload,
        headers=headers,
    )
    print(created.status_code)
    print(created.json())
    restaurant_id = created.json()["id"]

    response = client.delete(
        f"/api/v1/restaurants/{restaurant_id}",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["message"] == "Restaurant deleted successfully"


def test_create_restaurant_without_token(client):
    payload = {
        "name": "Unauthorized",
        "description": "Desc",
        "location": "Delhi",
        "image_url": "https://image.com/test.jpg",
    }

    response = client.post(
        "/api/v1/restaurants",
        json=payload,
    )

    assert response.status_code == 401
