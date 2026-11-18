from tests.utils import get_customer_token, get_owner_token


def test_create_order_without_login(client):
    response = client.post("/api/v1/orders")

    assert response.status_code == 401


def test_get_order_history(client):
    headers = get_customer_token(client)

    response = client.get(
        "/api/v1/orders/history",
        headers=headers,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_invalid_order(client):
    headers = get_customer_token(client)

    response = client.get(
        "/api/v1/orders/999999",
        headers=headers,
    )

    assert response.status_code == 404


def test_create_order_empty_cart(client):
    headers = get_customer_token(client)

    response = client.post(
        "/api/v1/orders",
        headers=headers,
    )

    # Your service raises CartNotFoundException first
    assert response.status_code == 404


def test_get_owner_orders_without_login(client):
    response = client.get("/api/v1/orders/owner")

    assert response.status_code == 401


def test_get_owner_orders_without_owner(client):
    headers = get_customer_token(client)

    response = client.get(
        "/api/v1/orders/owner",
        headers=headers,
    )

    # Customer cannot access owner endpoint
    assert response.status_code == 403


def test_update_invalid_order(client):
    headers = get_owner_token(client)

    response = client.patch(
        "/api/v1/orders/999999/status",
        json={
            "status": "Completed",
        },
        headers=headers,
    )

    assert response.status_code == 404