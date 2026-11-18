import uuid


def get_customer_token(client):
    email = f"{uuid.uuid4()}@test.com"

    payload = {
        "name": "Test Customer",
        "email": email,
        "password": "Password@123",
        "role": "customer",
    }

    client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": email,
            "password": payload["password"],
        },
    )

    token = response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}"
    }


def get_owner_token(client):
    email = f"{uuid.uuid4()}@test.com"

    payload = {
        "name": "Test Owner",
        "email": email,
        "password": "Password@123",
        "role": "owner",
    }

    client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": email,
            "password": payload["password"],
        },
    )

    token = response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}"
    }