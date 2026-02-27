# ExamOS Frontend

Next.js application serving the student and admin interfaces for the ExamOS examination platform.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Stack

- Next.js 16 (App Router)
- React 19
- TailwindCSS
- NextAuth.js (authentication)

## Project Structure

```
src/
  app/
    admin/           Admin dashboard, login, exam management
      login/         Admin login page
      AdminDashboardClient.tsx
      Sidebar.tsx
    dashboard/       Student dashboard
      StudentDashboardClient.tsx
    exam/
      [id]/          Exam gateway (pre-exam briefing)
        take/        Exam engine (questions, timer, anti-cheat)
        receipt/     Submission confirmation
    landing/         Public landing page
    login/           Student login page
  components/
    LanguageToggle.tsx    Language switch button (VI/EN)
  contexts/
    LanguageContext.tsx   i18n context with localStorage persistence
  lib/
    api.ts           Isomorphic fetch wrapper with JWT injection
    auth.ts          NextAuth configuration (credentials, Google, Zalo)
    translations.ts  Translation dictionary (120+ keys)
  proxy.ts           Next.js middleware (route protection, CSP headers)
```

## Environment Variables

Create `.env.local`:

| Variable              | Description                | Required |
|-----------------------|---------------------------|----------|
| NEXTAUTH_SECRET       | Session encryption key     | Yes      |
| NEXTAUTH_URL          | App URL (http://localhost:3000) | Yes |
| NEXT_PUBLIC_API_URL   | Backend API base URL       | Yes      |
| GOOGLE_CLIENT_ID      | Google OAuth client ID     | No       |
| GOOGLE_CLIENT_SECRET  | Google OAuth client secret | No       |

## Internationalization

The app supports Vietnamese (default) and English. Language preference is stored in `localStorage` and persists across sessions.

Key files:
- `src/lib/translations.ts` — all translation keys
- `src/contexts/LanguageContext.tsx` — React context provider
- `src/components/LanguageToggle.tsx` — toggle button component

To add a new translation key, add an entry to `translations.ts` with both `vi` and `en` values.

## Authentication Flow

1. User submits credentials on the login page
2. NextAuth calls the FastAPI `/auth/login` endpoint via `CredentialsProvider`
3. Backend returns a JWT
4. NextAuth stores the token in an encrypted session cookie
5. `proxy.ts` middleware checks the session on each request

## Build

```bash
npm run build
npm start
```
