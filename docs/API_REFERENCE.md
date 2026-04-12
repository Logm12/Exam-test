# API Reference

Base URL: `http://localhost:8000/api/v1`

All endpoints return JSON. Protected endpoints require a Bearer token in the `Authorization` header.

## Authentication

### POST /auth/login

Authenticate a user and receive a JWT.

**Request Body:**
| Field    | Type   | Required | Description       |
|----------|--------|----------|-------------------|
| username | string | Yes      | User login name   |
| password | string | Yes      | Account password  |

**Response:**
- `200`: `{ "access_token": "...", "token_type": "bearer" }`
- `401`: Invalid credentials

### POST /auth/register

Register a new student account.

**Request Body:**
| Field    | Type   | Required | Description          |
|----------|--------|----------|----------------------|
| username | string | Yes      | Desired username     |
| email    | string | Yes      | Email address        |
| password | string | Yes      | Password (min 6 chars) |

**Response:**
- `201`: Created user object
- `400`: Username or email already exists

---

## Exams

### GET /exams

List all exams. No authentication required.

**Query Parameters:**
| Name  | Type | Default | Description            |
|-------|------|---------|------------------------|
| skip  | int  | 0       | Pagination offset      |
| limit | int  | 100     | Max results to return  |

**Response:** Array of exam objects.

### POST /exams

Create an exam. Admin only.

**Request Body:**
| Field       | Type    | Required | Description               |
|-------------|---------|----------|---------------------------|
| title       | string  | Yes      | Exam title                |
| duration    | int     | Yes      | Duration in minutes       |
| start_time  | string  | Yes      | ISO 8601 datetime         |
| is_published| boolean | No       | Whether exam is visible   |

**Response:** Created exam object.

### GET /exams/{exam_id}

Get a single exam by ID.

**Response:**
- `200`: Exam object
- `404`: Exam not found

### GET /exams/{exam_id}/landing

Get landing page data for an exam (title, description, poster, rules, guides). Public endpoint.

**Response:**
- `200`: `{ "id": 1, "title": "...", "landing_config": { ... }, "start_time": "...", "end_time": "..." }`
- `404`: Exam not found

### GET /exams/{exam_id}/student

Get exam details with questions for a student. Correct answers are excluded from the response.

**Response:**
- `200`: Exam with questions (answers hidden)
- `404`: Exam not found or not published

### PUT /exams/{exam_id}

Update an exam. Admin only.

### DELETE /exams/{exam_id}

Delete an exam. Admin only.

### POST /exams/{exam_id}/draft

Save a draft of student answers to Redis. Requires authentication.

**Request Body:**
| Field   | Type              | Required | Description                    |
|---------|-------------------|----------|--------------------------------|
| answers | Dict[string, string] | Yes   | Map of question_id to answer  |

**Response:** `{ "status": "saved" }`

### POST /exams/{exam_id}/submit

Submit an exam for grading. Requires authentication.

**Request Body:**
| Field           | Type              | Required | Description                        |
|-----------------|-------------------|----------|------------------------------------|
| answers         | Dict[string, string] | Yes   | Map of question_id to answer      |
| forced_submit   | boolean           | No       | Whether this was an auto-submit   |
| violation_count | int               | No       | Number of anti-cheat violations   |

**Response:**
- `200`: `{ "status": "submitted", "score": 8.0 }`
- `400`: Exam already submitted
- `404`: Exam not found

### GET /exams/{exam_id}/report

Export a CSV report of all submissions for an exam. Admin only.

**Response:** CSV file download.

---

## Questions

### GET /questions/exam/{exam_id}

Get all questions for an exam.

### POST /questions

Create a question. Admin only.

**Request Body:**
| Field          | Type   | Required | Description                    |
|----------------|--------|----------|--------------------------------|
| exam_id        | int    | Yes      | Parent exam ID                 |
| content        | string | Yes      | Question text                  |
| type           | string | Yes      | `multiple_choice` or `short_answer` |
| options        | object | No       | Map of option keys to text     |
| correct_answer | string | No       | Correct option key             |

---

## Users

### GET /users

List all users. Admin only.

### GET /users/{user_id}

Get a user by ID. Admin only.

---

## Student Profile

### GET /students/me/profile

Get the student profile for the currently authenticated user.

**Response:**
- `200`: Student profile object (cccd, address, phone, email, etc.)
- `404`: Profile not found

### PUT /students/me/profile

Create or update the student profile for the currently authenticated user.

**Request Body:**
| Field          | Type   | Required | Description                |
|----------------|--------|----------|----------------------------|
| full_name      | string | Yes      | Legal name                 |
| birth_date     | string | Yes      | ISO 8601 date             |
| cccd           | string | Yes      | Citizenship ID number      |
| address        | string | Yes      | Current address            |
| phone          | string | Yes      | Contact phone number       |
| email          | string | Yes      | Contact email              |
| school         | string | Yes      | Educational institution    |
| student_code   | string | No       | Student ID number          |
| class_name     | string | No       | Class or group             |
| lien_chi_doan  | string | No       | Youth Union branch         |

**Response:**
- `200`: Updated student profile object
- `400`: Invalid data or duplicate record

---

## Organizations

### GET /organizations

List organizations.

### POST /organizations

Create an organization.

---

## Question Pools

### GET /pools

List question pools.

### POST /pools

Create a question pool.

---

## Analytics

### GET /admin/exams/{exam_id}/dashboard

Get dashboard metrics for an exam: total submissions, average score, accuracy rate, and high-violation submissions.

**Response:**
```json
{
  "total_submissions": 42,
  "average_score": 7.5,
  "accuracy_rate": 75.0,
  "high_violations": [
    {
      "user_id": 3,
      "violation_count": 5,
      "forced_submit": "true"
    }
  ]
}
```

---

## Error Format

All errors follow this structure:

```json
{
  "detail": "Human-readable error message"
}
```

Common status codes:
| Code | Meaning                |
|------|------------------------|
| 400  | Bad request            |
| 401  | Not authenticated      |
| 403  | Insufficient permissions |
| 404  | Resource not found     |
| 422  | Validation error       |

---

## Interactive Docs

When the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
