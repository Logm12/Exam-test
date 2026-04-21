"""
Regression test suite for ExamOS / FDB TALENT backend API.
Covers:
  1. Auth (admin + student login)
  2. Exams list
  3. Admin metrics (recent 500 fix)
  4. 404 for non-existent exam metrics
  5. RBAC -- student cannot access admin metrics
"""
import os
import requests, sys

BASE = "http://127.0.0.1:8000/api/v1"
results = []

ADMIN_USERNAME = os.environ.get("TEST_ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("TEST_ADMIN_PASSWORD", "admin123")
STUDENT_USERNAME = os.environ.get("TEST_STUDENT_USERNAME", "student")
STUDENT_PASSWORD = os.environ.get("TEST_STUDENT_PASSWORD", "password123")

def report(name, ok, detail=""):
    tag = "PASS" if ok else "FAIL"
    results.append((name, ok))
    print(f"  [{tag}] {name}" + (f"  -- {detail}" if detail else ""))

print("=" * 60)
print("FDB TALENT Backend Regression Tests")
print("=" * 60)

# --- 1. Admin Login ---
r = requests.post(f"{BASE}/auth/login", data={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD})
report("Admin login returns 200", r.status_code == 200, f"status={r.status_code}")
admin_token = r.json().get("access_token", "") if r.status_code == 200 else ""
admin_headers = {"Authorization": f"Bearer {admin_token}"}

# --- 2. Student Login ---
r = requests.post(f"{BASE}/auth/login", data={"username": STUDENT_USERNAME, "password": STUDENT_PASSWORD})
report("Student login returns 200", r.status_code == 200, f"status={r.status_code}")
student_token = r.json().get("access_token", "") if r.status_code == 200 else ""
student_headers = {"Authorization": f"Bearer {student_token}"}

# --- 3. Exams list ---
r = requests.get(f"{BASE}/exams/", headers=admin_headers)
report("GET /exams/ returns 200", r.status_code == 200, f"status={r.status_code}")
exams = r.json() if r.status_code == 200 else []
report("Exams list is non-empty", isinstance(exams, list) and len(exams) > 0, f"count={len(exams) if isinstance(exams, list) else 'N/A'}")

# --- 4. Admin metrics for first exam ---
if exams:
    exam_id = exams[0]["id"]
    r = requests.get(f"{BASE}/admin/exams/{exam_id}/metrics", headers=admin_headers)
    report(f"GET /admin/exams/{exam_id}/metrics returns 200", r.status_code == 200, f"status={r.status_code}")
    if r.status_code == 200:
        data = r.json()
        report("Metrics has total_submissions", "total_submissions" in data)
        report("Metrics has average_score", "average_score" in data)
        report("Metrics has accuracy_rate", "accuracy_rate" in data)

# --- 5. 404 for non-existent exam ---
r = requests.get(f"{BASE}/admin/exams/99999/metrics", headers=admin_headers)
report("Non-existent exam returns 404 (not 500)", r.status_code == 404, f"status={r.status_code}")

# --- 6. RBAC: Student cannot access admin metrics ---
if exams:
    exam_id = exams[0]["id"]
    r = requests.get(f"{BASE}/admin/exams/{exam_id}/metrics", headers=student_headers)
    report("Student blocked from admin metrics (403)", r.status_code == 403, f"status={r.status_code}")

# --- Summary ---
passed = sum(1 for _, ok in results if ok)
failed = sum(1 for _, ok in results if not ok)
print("\n" + "=" * 60)
print(f"Results: {passed} passed, {failed} failed, {len(results)} total")
print("=" * 60)
sys.exit(0 if failed == 0 else 1)
