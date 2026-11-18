from tests.utils import get_customer_token


def test_get_restaurant_recommendations_without_login(client):
    response = client.get("/api/v1/recommendations/restaurants")

    assert response.status_code == 401


def test_get_menu_recommendations_without_login(client):
    response = client.get("/api/v1/recommendations/menu")

    assert response.status_code == 401


def test_get_popular_recommendations_without_login(client):
    response = client.get("/api/v1/recommendations/popular")

    assert response.status_code == 200

    data = response.json()

    assert "restaurants" in data
    assert "menu_items" in data


def test_get_restaurant_recommendations(client):
    headers = get_customer_token(client)

    response = client.get(
        "/api/v1/recommendations/restaurants",
        headers=headers,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_menu_recommendations(client):
    headers = get_customer_token(client)

    response = client.get(
        "/api/v1/recommendations/menu",
        headers=headers,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_popular_recommendations(client):
    headers = get_customer_token(client)

    response = client.get(
        "/api/v1/recommendations/popular",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert "restaurants" in data
    assert "menu_items" in data


def test_recommendations_for_new_customer(client):
    headers = get_customer_token(client)

    response = client.get(
        "/api/v1/recommendations/restaurants",
        headers=headers,
    )

    assert response.status_code == 200