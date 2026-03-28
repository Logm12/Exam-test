# FDB TALENT Frontend

Next.js application serving the student and administrator interfaces for the FDB TALENT examination platform.

## Quick Start

```bash
npm install
npm run dev
```

The application is available at `http://localhost:3000`.

## Technical Stack

- Next.js 16 (App Router)
- React 19
- TailwindCSS
- NextAuth.js (Authentication)

## Project Structure

```
src/
  app/
    admin/           Administrator dashboard and exam management
    dashboard/       Student dashboard and profile completion
    exam/
      [id]/
        landing/      Dynamic exam-specific landing page
        take/         Examination engine (questions, timer, anti-cheat)
        receipt/      Submission confirmation
    login/            Unified login interface
    register/         Registration and profile redirection logic
  components/         Shared UI components
  contexts/           React contexts (language management)
  lib/
    api.ts           Isomorphic fetch wrapper with JWT injection
    auth.ts          NextAuth configuration
    translations.ts  Translation dictionary
  proxy.ts           Next.js middleware (route protection and security headers)
```

## Environment Configuration

Configure the `.env.local` file with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| NEXTAUTH_SECRET | Session encryption key | Yes |
| NEXTAUTH_URL | Application URL (http://localhost:3000) | Yes |
| NEXT_PUBLIC_API_URL | Backend API base URL | Yes |

## Internationalization

The application supports Vietnamese and English. Language preferences are persisted in `localStorage`.

Key resources:
- `src/lib/translations.ts`: Translation key mapping.
- `src/contexts/LanguageContext.tsx`: React context provider for language state.
- `src/components/LanguageToggle.tsx`: User interface for language switching.

## Authentication Protocol

1. User provides credentials via the login interface.
2. NextAuth verification via the FastAPI `/auth/login` endpoint.
3. Backend issues a JWT upon successful authentication.
4. NextAuth persists the token in an encrypted session cookie.
5. `proxy.ts` middleware validates the session for protected routes.

## Build and Production

```bash
npm run build
npm start
```
