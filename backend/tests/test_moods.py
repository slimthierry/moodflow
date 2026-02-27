import pytest
from httpx import AsyncClient


class TestMoods:
    async def test_create_mood_entry(self, client: AsyncClient, auth_headers: dict):
        response = await client.post(
            "/api/v1/moods",
            headers=auth_headers,
            json={
                "date": "2024-01-15",
                "mood_score": 7,
                "energy_level": 6,
                "anxiety_level": 3,
                "sleep_hours": 7.5,
                "notes": "Had a good day at work",
                "weather": "sunny",
                "tags": ["work", "exercise"],
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["mood_score"] == 7
        assert len(data["data"]["tags"]) == 2

    async def test_list_mood_entries(self, client: AsyncClient, auth_headers: dict):
        # Create an entry first
        await client.post(
            "/api/v1/moods",
            headers=auth_headers,
            json={
                "date": "2024-01-15",
                "mood_score": 7,
                "tags": [],
            },
        )

        response = await client.get("/api/v1/moods", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]) >= 1

    async def test_create_mood_entry_invalid_score(self, client: AsyncClient, auth_headers: dict):
        response = await client.post(
            "/api/v1/moods",
            headers=auth_headers,
            json={
                "date": "2024-01-15",
                "mood_score": 15,
                "tags": [],
            },
        )
        assert response.status_code == 422

    async def test_create_mood_entry_unauthorized(self, client: AsyncClient):
        response = await client.post(
            "/api/v1/moods",
            json={
                "date": "2024-01-15",
                "mood_score": 7,
                "tags": [],
            },
        )
        assert response.status_code in [401, 422]
