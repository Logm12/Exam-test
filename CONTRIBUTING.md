# Contributing to ExamOS

## Development Setup

### Prerequisites
- Node.js v18+
- Python 3.12
- Docker and Docker Compose
- Conda (for the `FDBTa` environment)

### First-Time Setup

1. Start services:
   ```bash
   docker-compose up -d
   ```

2. Backend:
   ```bash
   cd backend
   conda activate FDBTa
   pip install -r requirements.txt
   alembic upgrade head
   python seed_users.py
   uvicorn app.main:app --reload
   ```

3. Frontend:
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local  # Edit with your values
   npm run dev
   ```

## Code Style

### TypeScript / React
- Use functional components with hooks
- Wrap client components that need i18n in `LanguageProvider`
- Use `t("key")` from `useLanguage()` for all user-facing text
- No emoji in UI code — use styled text or SVG icons
- No AI-generated marketing language in code comments

### Python / FastAPI
- Use async functions for all endpoint handlers
- Use Pydantic models for request/response validation
- Keep business logic in endpoint files, not in models

### Documentation
- All markdown files in English
- No emoji in documentation
- Use tables for structured data
- Follow the Keep a Changelog format for CHANGELOG.md

## Adding Translations

1. Open `frontend/src/lib/translations.ts`
2. Add a new key with `vi` and `en` values:
   ```typescript
   "section.myKey": { vi: "Tiếng Việt", en: "English text" },
   ```
3. Use in components: `{t("section.myKey")}`

## Branching

- `main` — production-ready code
- `dev` — integration branch
- Feature branches: `feature/description`
- Bug fixes: `fix/description`

## Testing

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm run build   # Type-check and build
```

### Load Testing
```bash
pip install locust
locust -f backend/load_test.py
```

## Commit Messages

Use conventional format:
```
feat: add exam timer warning
fix: resolve IPv6 fetch failure
docs: update API reference
refactor: simplify middleware routing
```
