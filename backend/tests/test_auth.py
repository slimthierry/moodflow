import pytest
from httpx import AsyncClient


class TestAuth:
    async def test_register_success(self, client: AsyncClient):
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "new@example.com",
                "name": "New User",
                "password": "StrongPass123!",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["email"] == "new@example.com"

    async def test_register_duplicate_email(self, client: AsyncClient, registered_user: dict):
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": registered_user["email"],
                "name": "Another User",
                "password": "AnotherPass123!",
            },
        )
        assert response.status_code == 409

    async def test_login_success(self, client: AsyncClient, registered_user: dict):
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": registered_user["email"],
                "password": registered_user["password"],
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "access_token" in data["data"]
        assert "refresh_token" in data["data"]

    async def test_login_wrong_password(self, client: AsyncClient, registered_user: dict):
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": registered_user["email"],
                "password": "WrongPassword123!",
            },
        )
        assert response.status_code == 401

    async def test_get_me(self, client: AsyncClient, auth_headers: dict):
        response = await client.get("/api/v1/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["email"] == "test@example.com"

    async def test_get_me_unauthorized(self, client: AsyncClient):
        response = await client.get("/api/v1/auth/me")
        assert response.status_code in [401, 422]
