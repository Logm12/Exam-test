from locust import HttpUser, task, between
import random

class StudentUser(HttpUser):
    wait_time = between(1, 4)
    
    def on_start(self):
        # Giả lập đăng ký & đăng nhập để lấy token (Tuỳ chọn: Nếu muốn test load auth)
        # Để đơn giản, giả lập test load các GET /exams/1/student và POST /exams/1/draft
        self.exam_id = 1
        self.user_id = random.randint(1000, 9999)
        self.token = "dev_token" # Requires turning off JWT dependency OR generating real tokens
        self.headers = {"Authorization": f"Bearer {self.token}"}

    @task(3)
    def view_exam(self):
        # Lấy đề thi (Database Heavy)
        self.client.get(f"/api/v1/exams/{self.exam_id}/student", headers=self.headers)
        
    @task(5)
    def save_draft(self):
        # Lưu nháp lên Redis liên tục (Write Cache)
        draft_payload = {
            "answers": {
                "1": "A",
                "2": "C"
            }
        }
        self.client.post(f"/api/v1/exams/{self.exam_id}/draft", json=draft_payload, headers=self.headers)

    @task(1)
    def submit_exam(self):
        submit_payload = {
            "answers": {
                "1": "A",
                "2": "C"
            }
        }
        self.client.post(f"/api/v1/exams/{self.exam_id}/submit", json=submit_payload, headers=self.headers)
