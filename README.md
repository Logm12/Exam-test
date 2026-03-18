# ExamOS - Online Exam Platform

ExamOS is a full-stack online examination platform built for educational institutions and organizations. It handles exam creation, student assessment, and real-time monitoring with built-in anti-cheating measures.

The platform uses a decoupled architecture: a FastAPI backend for business logic and a Next.js frontend for the user interface.

## Features

### Admin Side
- Create and manage exams with multiple-choice and short-answer questions
- Schedule exams with configurable start times and durations
- View submission metrics, scores, and violation logs
- Real-time dashboard with cheating alert monitoring
- Automated question extraction from `.docx` and `.pdf` files (MyAloha-style formatting)
- Bilingual interface (Vietnamese / English)

### Student Side
- Public landing page with unified login access (supporting Student and Admin roles)
- Dashboard showing assigned and available exams
- Anti-cheating enforcement during exams (fullscreen, tab monitoring, clipboard blocking)
- Auto-save every 10 seconds via Redis
- Auto-submit on timer expiry or violation threshold
- Slug-based public exam landing pages for standardized access

### Security
- JWT-based authentication via NextAuth.js
- Social login support (Google, Zalo)
- Role-based access control (admin vs student)
- Content Security Policy headers
- Rate limiting through Redis

## Tech Stack

| Layer           | Technology                     |
|----------------|-------------------------------|
| Backend API     | FastAPI (Python 3.12, async)   |
| Database        | PostgreSQL                     |
| Cache           | Redis                          |
| Frontend        | Next.js 16, React, TailwindCSS |
| Authentication  | NextAuth.js + FastAPI JWT      |
| Infrastructure  | Docker, Docker Compose         |

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js v18 or higher
- Python 3.12 (for local backend development)
- Conda (optional, for the `FDBTa` environment)

### One-Click Quick Start (Recommended)
For the fastest setup, use the integrated npm script which starts Docker, Backend, and Frontend concurrently:

1. Ensure Docker Desktop is running.
2. Run the following command in the project root:
   ```bash
   npm run dev
   ```
3. The launcher will automatically:
   - Start Docker containers (PostgreSQL, Redis) via `docker-compose`.
   - Start the Backend (Port 8000) using the configured Python path.
   - Start the Next.js Frontend (Port 3000).

*Note: You can also use `start.bat` on Windows if preferred.*

### Manual Setup

1. Start database and cache services:
   ```bash
   docker-compose up -d
   ```

2. Start the backend:
   ```bash
   cd backend
   conda activate FDBTa
   pip install -r requirements.txt
   alembic upgrade head
   python seed_users.py
   uvicorn app.main:app --reload
   ```

3. Configure the frontend environment. Create `frontend/.env.local`:
   ```
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
   ```

4. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser.

### Default Accounts

| Role    | Username  | Password     | Login Path |
|---------|-----------|-------------|------------|
| Admin   | admin     | admin123     | `/login`   |
| Student | student   | password123  | `/login`   |

## Project Structure

```
online-exam/
  backend/
    app/
      api/endpoints/    # Route handlers (auth, exams, submissions)
      core/             # Security, config
      db/               # Database session and connection
      models/           # SQLAlchemy ORM models
      schemas/          # Pydantic request/response schemas
    alembic/            # Database migrations
    scripts/            # Maintenance and seeding scripts
    tests/              # Backend API and logic tests
  frontend/
    src/
      app/              # Next.js App Router pages
        admin/          # Admin portal (dashboard, exams)
        dashboard/      # Student dashboard
        exam/           # Exam gateway and exam engine
        landing/        # Public landing page
        login/          # Unified login page with role selection
      components/       # Shared UI components
      contexts/         # React contexts (language switching)
      lib/              # Utilities (auth config, API client, translations)
    scripts/            # Frontend utility scripts
```

## Authentication Flow

1. User submits credentials on the login page
2. NextAuth calls the FastAPI `/auth/login` endpoint
3. Backend verifies credentials and returns a JWT
4. NextAuth stores the JWT in an encrypted session cookie
5. Middleware checks the session on each request and enforces role-based access

## Anti-Cheating

During an exam, the following measures are active:
- Fullscreen mode required
- Tab visibility tracking (switching tabs increments a violation counter)
- Window blur detection
- Right-click, copy, and paste are disabled
- After 3 violations, the exam is auto-submitted with a forced flag
- Timer auto-submits when duration expires

## Documentation

- [API Reference](docs/API_REFERENCE.md) — all backend endpoints with request/response schemas
- [Enhancement Proposal](ENHANCEMENT_PROPOSAL.md) — planned features
- [Project Report](PROJECT_REPORT.md) — architecture and technical decisions
- [Changelog](CHANGELOG.md) — version history
- [Contributing](CONTRIBUTING.md) — development setup and code style

## Testing

Load test with Locust:
```bash
pip install locust
locust -f backend/load_test.py
```

Visit `http://localhost:8089` to configure the test.

## License

Proprietary. All rights reserved.
