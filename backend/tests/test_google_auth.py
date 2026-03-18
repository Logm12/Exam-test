import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

from app.api.deps import get_db
from unittest.mock import AsyncMock, MagicMock

async def override_get_db():
    mock_db = AsyncMock()
    mock_result = MagicMock()
    mock_scalars = MagicMock()
    mock_scalars.first.return_value = None
    mock_result.scalars.return_value = mock_scalars
    mock_db.execute.return_value = mock_result
    yield mock_db

app.dependency_overrides[get_db] = override_get_db

app.dependency_overrides[get_db] = override_get_db

def test_google_auth_success():
    """Test successful Google OAuth login."""
    with patch("app.api.endpoints.auth.id_token.verify_oauth2_token") as mock_verify:
        # Mock Google validating the token and returning user info
        mock_verify.return_value = {
            "iss": "https://accounts.google.com",
            "sub": "1234567890",
            "email": "student@example.com",
            "email_verified": True,
            "name": "Test Student"
        }
        
        response = client.post(
            "/api/v1/auth/google",
            json={"token": "valid_google_jwt_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        assert data["user"]["email"] == "student@example.com"

def test_google_auth_invalid_token():
    """Test Google OAuth login with an invalid token."""
    with patch("app.api.endpoints.auth.id_token.verify_oauth2_token") as mock_verify:
        # Prevent Google from validating
        mock_verify.side_effect = ValueError("Invalid token")
        
        response = client.post(
            "/api/v1/auth/google",
            json={"token": "invalid_token"}
        )
        
        assert response.status_code == 400
        assert response.json()["detail"] == "Invalid Google token"
