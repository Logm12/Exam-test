import asyncio
import os
from fastapi.testclient import TestClient
from app.main import app

ADMIN_USERNAME = os.environ.get("TEST_ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("TEST_ADMIN_PASSWORD", "admin123")

def test():
    client = TestClient(app)

    # 1. Login
    res = client.post("/api/v1/auth/login", data={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD})
    
    if res.status_code != 200:
        print("Login Failed:", res.status_code, res.text)
        return
        
    token = res.json()["access_token"]
    
    # 2. Get Exams
    headers = {"Authorization": f"Bearer {token}"}
    exams_res = client.get("/api/v1/exams/", headers=headers)
    
    exams = exams_res.json()
    print("EXAMS RESPONSE:", type(exams), len(exams) if isinstance(exams, list) else "Not list")
    
    if isinstance(exams, list) and exams:
        exam_id = exams[0]["id"]
    else:
        exam_id = 1
        
    print("USING EXAM ID:", exam_id)
    
    # 3. Get Metrics
    try:
        res = client.get(f"/api/v1/admin/exams/{exam_id}/metrics", headers=headers)
        print("STATUS", res.status_code)
        try:
            print("JSON", res.json())
        except:
            print("TEXT", res.text)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test()
