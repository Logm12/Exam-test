import sys
import traceback
from fastapi.testclient import TestClient

try:
    from app.main import app
    client = TestClient(app)
    response = client.post("/api/v1/auth/register", json={"username": "test100", "password": "123"})
    print("STATUS:", response.status_code)
    try:
        print("BODY:", response.json())
    except:
        print("BODY:", response.text)
except Exception as e:
    traceback.print_exc()
