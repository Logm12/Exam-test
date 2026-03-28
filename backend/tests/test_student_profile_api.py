import pytest
from fastapi.testclient import TestClient
from app.main import app
import uuid

client = TestClient(app)

def get_auth_token():
    # Register a new user just for testing profile to ensure fresh state
    test_username = f"testuser_{uuid.uuid4().hex[:6]}"
    res = client.post("/api/v1/auth/register", json={
        "username": test_username,
        "password": "password123",
        "email": f"{test_username}@example.com",
        "full_name": "Test User"
    })
    
    # Login
    res = client.post("/api/v1/auth/login", data={
        "username": test_username,
        "password": "password123"
    })
    return res.json()["access_token"]

def test_get_profile_empty():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Should return 404 since profile isn't created yet
    res = client.get("/api/v1/students/me/profile", headers=headers)
    assert res.status_code == 404

def test_put_profile_create_and_update():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create profile
    profile_data = {
        "full_name": "Test Student",
        "cccd": "012345678901",
        "address": "Hanoi",
        "phone": "0987654321",
        "email": "student@vnu.edu.vn",
        "date_of_birth": "2000-01-01",
        "school": "VNU",
        "mssv": "20050000",
        "class_name": "K65",
        "lien_chi_doan": "Khoa CNTT"
    }
    
    res = client.put("/api/v1/students/me/profile", headers=headers, json=profile_data)
    assert res.status_code == 200
    data = res.json()
    assert data["cccd"] == "012345678901"
    
    # Update profile
    profile_data["address"] = "Ho Chi Minh"
    res = client.put("/api/v1/students/me/profile", headers=headers, json=profile_data)
    assert res.status_code == 200
    assert res.json()["address"] == "Ho Chi Minh"
    
    # Get profile
    res = client.get("/api/v1/students/me/profile", headers=headers)
    assert res.status_code == 200
    assert res.json()["address"] == "Ho Chi Minh"
