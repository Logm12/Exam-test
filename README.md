# FDB TALENT - Online Exam Platform

FDB TALENT is a full-stack online examination platform built for educational institutions and organizations. It manages exam creation, student assessment, and real-time monitoring with integrated anti-cheating protocols.

The platform utilizes a decoupled architecture: a FastAPI backend for core business logic and a Next.js frontend for the user interface.

## Features

### Administrative Interface
- Create and manage exams with dynamic landing page configurations.
- Schedule exams with configurable durations and start times.
- Upload custom posters, organizer logos, and descriptions per exam.
- Rule and guide management for students via a flexible landing page editor.
- Performance metrics, score visualization, and violation monitoring.
- Real-time dashboard with cheating alert triggers.
- Automated question extraction from `.docx` and `.pdf` files.
- Full bilingual support (Vietnamese and English).

### Student Portal
- Dynamic exam landing pages with custom branding and protocols.
- Mandatory student profile completion flow (CCCD, Address, Phone, School).
- Personalized dashboard showing assigned and active exams.
- Robust anti-cheating enforcement (fullscreen monitoring, tab tracking, clipboard blocking).
- Automatic draft saving every 10 seconds via Redis.
- Automated submission upon duration expiry or violation threshold.

### Security and Infrastructure
- JWT-based authentication via NextAuth.js.
- Social login integration.
- Strictly enforced role-based access control.
- Rate limiting powered by Redis.

## Technical Stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI (Python 3.12, asynchronous) |
| Database | PostgreSQL |
| Cache | Redis |
| Frontend | Next.js 16, React, TailwindCSS |
| Authentication | NextAuth.js and FastAPI JWT |
| Infrastructure | Docker and Docker Compose |

## Getting Started

### Prerequisites
- Docker and Docker Compose.
- Node.js v18 or higher.
- Python 3.12 (standardized environment).

### Unified Quick Start
Use the root npm script to launch Docker, Backend, and Frontend concurrently:

1. Ensure Docker Desktop is active.
2. Execute the following command in the project root:
   ```bash
   npm run dev
   ```
3. The orchestrator will automatically:
   - Synchronize Docker containers (PostgreSQL, Redis).
   - Initialize the Backend on Port 8000 using the standardized Python path.
   - Start the Next.js Frontend on Port 3000.

### Manual Setup

1. Initialize database and caching services:
   ```bash
   docker-compose up -d
   ```

2. Standardize and start the backend:
   ```bash
   cd backend
   conda activate FDBTa
   pip install -r requirements.txt
   alembic upgrade head
   python seed_users.py
   uvicorn app.main:app --reload
   ```

3. Configure the frontend environment in `frontend/.env.local`:
   ```
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
   ```

4. Initialize the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Access the platform at `http://localhost:3000`.

### Default Credentials

| Role | Username | Password | Access Route |
|------|----------|----------|--------------|
| Administrator | admin | admin123 | `/login` |
| Student | student | password123 | `/login` |

## Project Structure

```
online-exam/
  backend/
    app/
      api/endpoints/    # Route handlers
      db/               # Database connectors
      models/           # SQLAlchemy ORM models
      schemas/          # Pydantic validation schemas
    alembic/            # Database migrations
    scripts/            # Utility and maintenance scripts
    tests/              # Integrated backend tests
  frontend/
    src/
      app/              # Next.js App Router logic
        admin/          # Administrator portal
        dashboard/      # Student dashboard and profile completion
        exam/           # Examination engine and landing pages
      lib/              # Shared utilities and auth configuration
```

## Authentication Protocol

1. User authentication via the login page.
2. NextAuth initiates a request to the FastAPI `/auth/login` endpoint.
3. Backend authenticates credentials and issues a JWT.
4. NextAuth persists the JWT within an encrypted session cookie.
5. Server middleware validates the session and role context for each request.

## Anti-Cheating Measures

Active protocols during examination:
- Mandatory fullscreen mode.
- Tab visibility and window blur detection.
# FDB TALENT - Online Exam Platform

FDB TALENT is a full-stack online examination platform built for educational institutions and organizations. It manages exam creation, student assessment, and real-time monitoring with integrated anti-cheating protocols.

The platform utilizes a decoupled architecture: a FastAPI backend for core business logic and a Next.js frontend for the user interface.

## Features

### Administrative Interface
- Create and manage exams with dynamic landing page configurations.
- Schedule exams with configurable durations and start times.
- Upload custom posters, organizer logos, and descriptions per exam.
- Rule and guide management for students via a flexible landing page editor.
- Performance metrics, score visualization, and violation monitoring.
- Real-time dashboard with cheating alert triggers.
- Automated question extraction from `.docx` and `.pdf` files.
- Full bilingual support (Vietnamese and English).

### Student Portal
- Dynamic exam landing pages with custom branding and protocols.
- Mandatory student profile completion flow (CCCD, Address, Phone, School).
- Personalized dashboard showing assigned and active exams.
- Robust anti-cheating enforcement (fullscreen monitoring, tab tracking, clipboard blocking).
- Automatic draft saving every 10 seconds via Redis.
- Automated submission upon duration expiry or violation threshold.

### Security and Infrastructure
- JWT-based authentication via NextAuth.js.
- Social login integration.
- Strictly enforced role-based access control.
- Rate limiting powered by Redis.

## Technical Stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI (Python 3.12, asynchronous) |
| Database | PostgreSQL |
| Cache | Redis |
| Frontend | Next.js 16, React, TailwindCSS |
| Authentication | NextAuth.js and FastAPI JWT |
| Infrastructure | Docker and Docker Compose |

## Getting Started

### Prerequisites
- Docker and Docker Compose.
- Node.js v18 or higher.
- Python 3.12 (standardized environment).

### Unified Quick Start
Use the root npm script to launch Docker, Backend, and Frontend concurrently:

1. Ensure Docker Desktop is active.
2. Execute the following command in the project root:
   ```bash
   npm run dev
   ```
3. The orchestrator will automatically:
   - Synchronize Docker containers (PostgreSQL, Redis).
   - Initialize the Backend on Port 8000 using the standardized Python path.
   - Start the Next.js Frontend on Port 3000.

### Manual Setup

1. Initialize database and caching services:
   ```bash
   docker-compose up -d
   ```

2. Standardize and start the backend:
   ```bash
   cd backend
   conda activate FDBTa
   pip install -r requirements.txt
   alembic upgrade head
   python seed_users.py
   uvicorn app.main:app --reload
   ```

3. Configure the frontend environment in `frontend/.env.local`:
   ```
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
   ```

4. Initialize the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Access the platform at `http://localhost:3000`.

### Default Credentials

| Role | Username | Password | Access Route |
|------|----------|----------|--------------|
| Administrator | admin | admin123 | `/login` |
| Student | student | password123 | `/login` |

## Project Structure

```
online-exam/
  backend/
    app/
      api/endpoints/    # Route handlers
      db/               # Database connectors
      models/           # SQLAlchemy ORM models
      schemas/          # Pydantic validation schemas
    alembic/            # Database migrations
    scripts/            # Utility and maintenance scripts
    tests/              # Integrated backend tests
  frontend/
    src/
      app/              # Next.js App Router logic
        admin/          # Administrator portal
        dashboard/      # Student dashboard and profile completion
        exam/           # Examination engine and landing pages
      lib/              # Shared utilities and auth configuration
```

## Authentication Protocol

1. User authentication via the login page.
2. NextAuth initiates a request to the FastAPI `/auth/login` endpoint.
3. Backend authenticates credentials and issues a JWT.
4. NextAuth persists the JWT within an encrypted session cookie.
5. Server middleware validates the session and role context for each request.

## Anti-Cheating Measures

Active protocols during examination:
- Mandatory fullscreen mode.
- Tab visibility and window blur detection.
- Disabled right-click, copy, and paste functions.
- Automatic exam submission after three recorded violations.
- Automatic submission upon timer expiry.

## Documentation Reference

- [API Reference](docs/API_REFERENCE.md) - Detailed endpoint specifications.
- [Enhancement Proposal](ENHANCEMENT_PROPOSAL.md) - Future development roadmap.
- [Project Report](PROJECT_REPORT.md) - Technical architecture overview.
- [Changelog](CHANGELOG.md) - Recent technical updates and version history.
- [Contributing](CONTRIBUTING.md) - Development guidelines.

## License

Proprietary. All rights reserved.
