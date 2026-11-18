from fastapi.security import OAuth2PasswordRequestForm


def test_register_customer(client):
    payload = {
        "name": "Vishesh",
        "email": "vishesh@test.com",
        "password": "Password@123",
        "role": "customer",
    }

    response = client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["success"] is True
    assert data["message"] == "Registration successful"
    assert data["name"] == payload["name"]
    assert data["email"] == payload["email"]
    assert data["role"] == payload["role"]
    assert "id" in data


def test_register_owner(client):
    payload = {
        "name": "Pizza Hut",
        "email": "owner@test.com",
        "password": "Password@123",
        "role": "owner",
    }

    response = client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["success"] is True
    assert data["message"] == "Registration successful"
    assert data["role"] == "owner"


def test_duplicate_email_registration(client):
    payload = {
        "name": "Duplicate User",
        "email": "duplicate@test.com",
        "password": "Password@123",
        "role": "customer",
    }

    client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    response = client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    assert response.status_code == 409


def test_login_success(client):
    register_payload = {
        "name": "Login User",
        "email": "login@test.com",
        "password": "Password@123",
        "role": "customer",
    }

    client.post(
        "/api/v1/auth/register",
        json=register_payload,
    )

    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "login@test.com",
            "password": "Password@123",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["message"] == "Login successful"
    assert data["token_type"] == "bearer"
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["role"] == "customer"


def test_invalid_login(client):
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "wrong@test.com",
            "password": "WrongPassword",
        },
    )

    assert response.status_code == 401


def test_refresh_token(client):
    register_payload = {
        "name": "Refresh User",
        "email": "refresh@test.com",
        "password": "Password@123",
        "role": "customer",
    }

    client.post(
        "/api/v1/auth/register",
        json=register_payload,
    )

    login = client.post(
        "/api/v1/auth/login",
        data={
            "username": "refresh@test.com",
            "password": "Password@123",
        },
    )

    refresh_token = login.json()["refresh_token"]

    response = client.post(
        "/api/v1/auth/refresh",
        json={
            "refresh_token": refresh_token,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["message"] == "Access token refreshed successfully"
    assert data["token_type"] == "bearer"
    assert "access_token" in data


def test_forgot_password(client):
    payload = {
        "name": "Forgot User",
        "email": "forgot@test.com",
        "password": "Password@123",
        "role": "customer",
    }

    client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    response = client.post(
        "/api/v1/auth/forgot-password",
        json={
            "email": "forgot@test.com",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["message"] == "Password reset token generated successfully"
    assert "reset_token" in data


def test_reset_password(client):
    payload = {
        "name": "Reset User",
        "email": "reset@test.com",
        "password": "Password@123",
        "role": "customer",
    }

    client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    forgot = client.post(
        "/api/v1/auth/forgot-password",
        json={
            "email": "reset@test.com",
        },
    )

    token = forgot.json()["reset_token"]

    response = client.post(
        "/api/v1/auth/reset-password",
        json={
            "reset_token": token,
            "new_password": "NewPassword@123",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["message"] == "Password reset successfully"