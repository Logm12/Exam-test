# Project Report: ExamOS Online Exam Platform

## 1. Summary

This report covers the design, development, and delivery of ExamOS, an online exam platform for educational organizations. The system supports over 150 concurrent users, provides real-time exam monitoring, and includes anti-cheating protections.

The architecture separates the frontend (Next.js) from the backend (FastAPI), connected through a REST API and JWT-based authentication.

## 2. Architecture

### Design Approach

The main requirements were handling concurrent exam sessions without data loss. A hybrid storage approach uses PostgreSQL for permanent records and Redis for high-frequency writes like exam auto-saves.

### Technology Stack

| Component       | Technology                     | Purpose                              |
|----------------|-------------------------------|--------------------------------------|
| Backend         | FastAPI (Python 3.12)          | API endpoints, authentication, grading |
| Database        | PostgreSQL                     | Users, exams, questions, submissions  |
| Cache           | Redis                          | Auto-save drafts, rate limiting       |
| Frontend        | Next.js 16, TailwindCSS        | UI, routing, server-side rendering    |
| Auth            | NextAuth.js                    | Session management, social login      |
| Infrastructure  | Docker, Docker Compose         | Database and cache containers         |

## 3. Features Delivered

### Exam Management
- Admins create exams with multiple-choice and short-answer questions
- Configurable start times and durations
- Instant grading for objective question types
- **Automated Question Extraction**: Integrated a regex-based document parser supporting `.docx` and `.pdf` uploads, allowing admins to import entire exams in seconds via standardized formatting (similar to MyAloha).

### Student Portal
- Public landing page with separate login paths for students and admins
- Dashboard showing available exams
- Real-time countdown timer synchronized with the server
- Auto-save every 10 seconds via Redis

### Authentication
- Credential-based login with bcrypt password hashing
- Social login via Google, Facebook, and Zalo
- Role-based access control (admin and student roles)
- JWT tokens stored in encrypted session cookies

### Anti-Cheating
- Fullscreen enforcement during exams
- Tab switch and window blur detection
- Right-click, copy, and paste blocking
- Auto-submission after 3 violations
- Redis-backed API rate limiting

### Bilingual Interface
- Vietnamese and English language support
- Language toggle on all pages
- Selection persisted in localStorage

## 4. Technical Challenges

1. **Auth Architecture Mismatch**: Early versions had conflicting session handling between NextAuth and FastAPI JWTs. Fixed by using a custom `CredentialsProvider` that bridges FastAPI login responses directly into the NextAuth session.

2. **CORS and Proxy Issues**: Browser security policies blocked cross-origin API calls. Resolved by routing all frontend API calls through a Next.js `/api/proxy` route handler.

3. **Server vs Client Token Injection**: Server Components and Client Components needed different methods to attach auth tokens. Built an isomorphic fetcher that checks the execution context and uses the appropriate session method.

4. **Node.js IPv6 Resolution**: Node 18+ resolves `localhost` to IPv6 by default, but FastAPI listens on IPv4. This caused SSR fetches to fail. Fixed by explicitly mapping to `127.0.0.1` in server-side requests.

5. **Middleware Naming in Next.js 16**: Next.js 16 uses `proxy.ts` instead of `middleware.ts`. Having both files caused a crash. Resolved by keeping only `proxy.ts`.

6. **Hydration Mismatch in UI Components**: Locale-dependent components (like `LanguageToggle`) caused hydration errors because the server-rendered locale did not always match the client's `localStorage` value. Resolved by implementing a `mounted` state hook to defer state-dependent rendering until the component is mounted on the client.

7. **Backend Service Instability**: Missing core dependencies (`google-auth`, `fastapi-limiter`) prevented the backend from initializing correctly in certain environments. Fixed by standardizing the virtual environment setup and ensuring all requirements are strictly locked.

## 5. Conclusion

ExamOS is a working exam platform with real-time monitoring, anti-cheating measures, bilingual support, and social login. The decoupled architecture keeps the frontend lightweight and the backend independently scalable. The platform is ready for deployment and further feature development.
