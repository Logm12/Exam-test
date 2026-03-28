# Project Report: FDB TALENT Online Exam Platform

## 1. Summary

This report covers the design, development, and delivery of FDB TALENT, an online exam platform for educational organizations. The system supports over 150 concurrent users, provides real-time exam monitoring, and includes anti-cheating protections.

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
- Public landing page with a central get-started action
- Unified login interface supporting multi-role authentication
- Dashboard showing available exams
- **Mandatory Profile Completion**: Implemented a registration-to-dashboard requirement. New students must provide validated details (CCCD, Address, Phone, School) before accessing the exam list.
- **Dynamic Exam Landing Pages**: Refactored the rigid landing structure into a per-exam template. Each exam can now host its own customized landing page with specific branding, rules, and guides.
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

8. **Database Schema Synchronization**: Critical SQL columns (e.g., `cover_image`) were present in the codebase but missing from the database due to unapplied Alembic migrations. Resolved by strictly enforcing the migration HEAD (`a1b2c3d4e5f6`) across environments.

9. **Schema Inheritance Pitfalls (422 Errors)**: Tight coupling between `ExamUpdate` and `ExamBase` schemas meant that surgical API updates erroneously required mandatory base fields (like `start_time`). Decoupled the update schema to allow partial payloads, resolving repeated [422 Unprocessable Entity] errors.

10. **Environment Orchestration Complexity**: Manually starting multiple interdependent services (PostgreSQL, Redis, FastAPI, Next.js) led to frequent setup errors and "Conda command not found" issues. Developed an automated unified `npm run dev` orchestrator using `concurrently` that verifies Docker services and launches both frontend/backend instances with absolute environment paths, ensuring seamless cross-platform execution.

11. **Database-Code Realignment (Submission Metrics)**: A discrepancy in the production SQL schema (March 2026 update) resulted in missing columns like `correct_count` in the database while they were expected by the API. Strictly realigned the backend models and reports with the latest production SQL dump, while simultaneously cleaning up the directory structure (moving tests and seeding scripts to dedicated subfolders) to improve project health and auditability.

12. **Dynamic Content and SSR Hydration**: Implementing dynamic landing pages required fetching exam-specific metadata during server-side rendering. Resolved 404 and connectivity issues by standardizing on a robust internal fetcher and ensuring consistent IPv4 loopback handling for Node 18+ environments.

13. **Forced Profile Completion Flow**: Integrating a mandatory profile step post-registration required careful session management to prevent dashboard access bypass. Implemented a `profile_completed` flag in both the JWT session and backend database to enforce secure redirection and data integrity.

14. **Next.js 16 Asynchronous Params**: The transition to Next.js 16 changed dynamic route parameters from synchronous to asynchronous Promises. This caused runtime errors on the exam landing page. Resolved the issue by refactoring `params` access to use contemporary asynchronous patterns.

15. **Python Backend Stabilization**: The backend codebase accumulated over 47 import errors, including circular dependencies and incorrect module-level positioning. Standardized the environment on Python 3.12 and used Ruff to systematically identify and resolve these issues, while pinning dependency versions to prevent further conflicts between `redis` and `fastapi-limiter`.

## 5. Conclusion

FDB TALENT is a functional online examination platform providing real-time monitoring, anti-cheating measures, bilingual support, and social login. The decoupled architecture maintains a lightweight frontend and an independently scalable backend. The platform is prepared for production deployment and subsequent feature development.
