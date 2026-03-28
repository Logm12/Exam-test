# Contributing to FDB TALENT

## Development Setup

### Prerequisites
- Node.js v18 or higher.
- Python 3.12.
- Docker and Docker Compose.
- Conda (for the `FDBTa` environment).

### Setup Instructions

1. Start infrastructure services:
   ```bash
   docker-compose up -d
   ```

2. Backend initialization:
   ```bash
   cd backend
   conda activate FDBTa
   pip install -r requirements.txt
   alembic upgrade head
   python seed_users.py
   uvicorn app.main:app --reload
   ```

3. Frontend initialization:
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

## Code Guidelines

### TypeScript and React
- Utilize functional components and hooks.
- Wrap client-side components requiring internationalization in `LanguageProvider`.
- Use the `t("key")` function for all user-facing strings.
- Standard visual elements only - no emojis in the UI or codebase.

### Python and FastAPI
- Implement asynchronous handlers for all endpoints.
- Use Pydantic models for thorough request and response validation.
- Separate business logic from database models.

### Documentation
- All markdown documentation must be in English.
- No emojis are permitted in documentation files.
- Use tables for structured data presentation.

## Branching Logic

- `main`: Production-ready stability.
- `dev`: Integration and active development.
- Feature branches: `feature/description`.
- Bug fixes: `fix/description`.

## Testing Procedures

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm run build
```

## Commit Message Protocol

Use the following conventional format:
```
feat: add exam timer warning
fix: resolve fetch failure
docs: update technical reference
refactor: simplify routing logic
```
