import requests

def test():
    # 1. Login
    res = requests.post("http://127.0.0.1:8000/api/v1/auth/login", data={"username":"admin", "password":"admin123"})
    token = res.json()["access_token"]
    
    # 2. Get Exams
    headers = {"Authorization": f"Bearer {token}"}
    exams = requests.get("http://127.0.0.1:8000/api/v1/exams/", headers=headers).json()
    exam_id = exams[0]["id"] if exams else 1
    
    print("TESTING EXAM ID:", exam_id)
    
    # 3. Get Metrics
    res = requests.get(f"http://127.0.0.1:8000/api/v1/admin/exams/{exam_id}/metrics", headers=headers)
    print("STATUS", res.status_code)
    try:
        print("JSON", res.json())
    except:
        print("TEXT", res.text)

if __name__ == "__main__":
    test()
