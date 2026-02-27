import pytest
from httpx import AsyncClient


class TestDashboard:
    async def test_get_dashboard(self, client: AsyncClient, auth_headers: dict):
        response = await client.get("/api/v1/dashboard", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "summary" in data["data"]
        assert "weekly_trend" in data["data"]
        assert "recent_entries" in data["data"]

    async def test_get_dashboard_unauthorized(self, client: AsyncClient):
        response = await client.get("/api/v1/dashboard")
        assert response.status_code in [401, 422]

    async def test_dashboard_with_entries(self, client: AsyncClient, auth_headers: dict):
        # Create some mood entries
        for i in range(3):
            await client.post(
                "/api/v1/moods",
                headers=auth_headers,
                json={
                    "date": f"2024-01-{15 + i}",
                    "mood_score": 6 + i,
                    "energy_level": 5 + i,
                    "sleep_hours": 7.0,
                    "tags": [],
                },
            )

        response = await client.get("/api/v1/dashboard", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["summary"]["total_entries"] >= 3
