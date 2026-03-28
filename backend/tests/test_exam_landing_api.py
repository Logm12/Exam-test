import pytest
from fastapi.testclient import TestClient
from datetime import datetime
from app.main import app

client = TestClient(app)

def test_get_exam_landing_public():
    # This should return 404 since exam doesn't exist
    response = client.get("/api/v1/exams/9999/landing")
    assert response.status_code == 404

    # The actual integration test will need a seeded exam
    # but for now we just want to ensure the endpoint exists
    # and doesn't require auth (returns 404 not 401)
    
def test_get_exam_landing_no_auth():
    # Attempt to fetch landing config for a non-existent exam
    res = client.get("/api/v1/exams/99999/landing")
    # Should be 404 because exam doesn't exist, NOT 401 Unauthorized
    assert res.status_code == 404 

