import asyncio
import httpx

async def main():
    async with httpx.AsyncClient(base_url="http://localhost:8000/api/v1") as client:
        # 1. Login as student
        r = await client.post("/auth/login", data={"username": "student", "password": "password123"})
        if r.status_code != 200:
            print(f"Login failed: {r.text}")
            return
        token = r.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # 2. Get exams
        r = await client.get("/exams/", headers=headers)
        exams = [e for e in r.json() if e["is_published"]]
        if not exams:
            print("No published exams found.")
            return
            
        exam_id = exams[0]["id"]
        print(f"Selected exam ID: {exam_id}")
        
        # 3. Get questions (via student exam endpoint)
        r = await client.get(f"/exams/{exam_id}/student", headers=headers)
        if r.status_code != 200:
            print(f"Failed to get student exam: {r.text}")
            return
        exam_data = r.json()
        questions = exam_data.get("questions", [])
        print(f"Found {len(questions)} questions")
        
        # 4. Generate random answers
        answers = {}
        for q in questions:
            if q["type"] == "multiple_choice":
                opts = list(q["options"].keys())
                answers[str(q["id"])] = opts[0] if opts else "A"
            else:
                answers[str(q["id"])] = "Test answer"
                
        # 5. Submit
        payload = {
            "answers": answers,
            "forced_submit": False,
            "violation_count": 0
        }
        print(f"Submitting payload: {payload}")
        r = await client.post(f"/exams/{exam_id}/submit", json=payload, headers=headers)
        print(f"Submit response [{r.status_code}]: {r.text}")

if __name__ == "__main__":
    asyncio.run(main())
