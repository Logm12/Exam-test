import asyncio
import httpx
from app.main import app

async def test():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Login
        res = await client.post("/api/v1/auth/login", data={"username":"admin", "password":"admin123"})
        if res.status_code != 200:
            print("Login Failed:", res.status_code, res.text)
            return
            
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # 2. Get Exams
        exams_res = await client.get("/api/v1/exams/", headers=headers)
        exams = exams_res.json()
        
        exam_id = exams[0]["id"] if isinstance(exams, list) and exams else 1
        print("TESTING EXAM ID:", exam_id)
        
        # 3. Get Metrics
        try:
            res = await client.get(f"/api/v1/admin/exams/{exam_id}/metrics", headers=headers)
            print("STATUS", res.status_code)
            try:
                print("JSON", res.json())
            except:
                print("TEXT", res.text)
        except Exception as e:
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
