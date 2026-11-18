from tests.utils import get_customer_token


def test_get_preferences_without_login(client):
    response = client.get("/api/v1/preferences")

    assert response.status_code == 401


def test_create_preferences(client):
    headers = get_customer_token(client)

    payload = {
        "dietary_restrictions": "Vegetarian, Vegan",
        "favorite_categories": [1, 2],
    }

    response = client.post(
        "/api/v1/preferences",
        json=payload,
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["dietary_restrictions"] == "Vegetarian, Vegan"
    assert "id" in data
    assert "user_id" in data


def test_get_preferences(client):
    headers = get_customer_token(client)

    response = client.get(
        "/api/v1/preferences",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert "id" in data
    assert "user_id" in data
    assert "dietary_restrictions" in data
    assert "favorite_categories" in data


def test_update_preferences(client):
    headers = get_customer_token(client)

    payload = {
        "dietary_restrictions": "High Protein",
        "favorite_categories": [3],
    }

    response = client.put(
        "/api/v1/preferences",
        json=payload,
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["dietary_restrictions"] == "High Protein"
    assert "id" in data
    assert "user_id" in data


def test_create_preferences_without_token(client):
    payload = {
        "dietary_restrictions": "Vegetarian",
        "favorite_categories": [],
    }

    response = client.post(
        "/api/v1/preferences",
        json=payload,
    )

    assert response.status_code == 401


def test_update_preferences_without_token(client):
    payload = {
        "dietary_restrictions": "Keto",
        "favorite_categories": [1],
    }

    response = client.put(
        "/api/v1/preferences",
        json=payload,
    )

    assert response.status_code == 401