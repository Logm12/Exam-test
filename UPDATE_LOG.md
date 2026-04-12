# Update Log

## [v1.9.0] - Environment and Routing Stability (2026-03-28)

### English:
- **Next.js 16 Compatibility**: Resolved asynchronous `params` errors in `exam/[id]/landing/page.tsx` by converting parameter extraction to the `Promise` API.
- **Frontend Routing**: Corrected the student dashboard "Enter Exam" link to direct users to the dynamic landing page instead of the examination engine.
- **Gateway Navigation**: Updated the "Go Back" link in `ExamGatewayClient.tsx` to point to the `/dashboard` route.
- **Backend Import Stability**: Resolved over 47 Python import errors, including circular dependencies and module-level import ordering, using Ruff and target refactoring.
- **Dependency Versioning**: Fixed the conflict between `redis` and `fastapi-limiter` by pinning `redis` to `<5.0.0`.
- **Development Environment**: Standardized Python 3.12 environment management within the `FDBTa` Conda environment.

---

## [v1.8.0] - Dynamic Landing and Profile Completion (2026-03-27)

### English:
- **Dynamic Landing Pages**: Unique landing pages for each exam include custom posters, organizer information, rules, and guides.
- **Mandatory Profile Completion**: Newly registered students are automatically redirected to a profile completion page. Access to the main dashboard is restricted until mandatory fields (CCCD, Address, Phone, etc.) are provided.
- **Auto-Login on Registration**: The registration flow includes automatic login and immediate redirection to the profile completion form.
- **Technical Improvements**: Fixed `fastapi-limiter` dependency issues and provided a `seed_exam.py` script for rapid testing of landing page features.

---

## [v1.7.0] - Development Orchestration and DB Sync (2026-03-18)

### English:
- **Unified Development Launcher (`npm run dev`)**: Integrated both Frontend and Backend into a single execution command at the root directory. This command concurrently launches Docker services, Backend (port 8000), and Frontend (port 3000).
- **Database Schema Synchronization**: Resolved critical errors regarding missing `correct_count` columns by resyncing the PostgreSQL schema with the latest production SQL dump (March 18, 2026).
- **Environment Stability (FastAPI Limiter)**: Fixed library import failures by pinning to a stable version (0.1.5), ensuring robust API rate limiting functionality.
- **Directory Reorganization**: Moved standalone scripts and tests into dedicated `tests/` and `scripts/` directories for enhanced maintainability and code clarity.

---

## [v1.6.0] - Critical System Stabilization (2026-03-16)

### English:
- **SQL Fix (Cover Image)**: Activated the latest database migrations to resolve persistence issues related to the `cover_image` column.
- **Creation/Edit Workflow Fix**: Resolved "Validation Error (422)" caused by strict schema enforcement. Optional fields (like cover images or specific start times) no longer block system updates.
- **System Launcher**: Introduced `start.bat` in the root directory, enabling one-click startup for Docker, Frontend, and Backend services.
- **UI Optimization**: Fixed hardcoded preview URLs for exam cover images, ensuring they follow environment-specific API configurations.

---

## 1. Backend and Database (Security and Logic Fixes)

### Authentication Vulnerability Patch (Critical)
- **Issue**: Admin APIs were previously exposed, allowing any authenticated user (including students) to view or modify data.
- **Solution**: Implemented `get_current_active_admin` protection. Every create, update, or delete action is now strictly verified. Unauthorized access by students results in a 403 Forbidden error.

### Scoring Logic Fix (Strict Validation)
- **Issue**: Loose validation allowed empty or null answers to occasionally receive scores incorrectly.
- **Solution**: Applied a Strict Validation algorithm. Both student and master answers are now sanitized (trimmed) and compared exactly. Empty/None values are ignored, ensuring absolute fairness.

### Anti-Spam and Duplicate Answer Prevention
- **Issue**: Poor network conditions occasionally caused duplicate submissions, leading to redundant records in the database.
- **Solution**: 
    - Re-enabled Redis-based Rate Limiting to prevent spam requests.
    - Implemented a process that removes draft answers before final submission.
    - Added database-level constraints (`UniqueConstraint('submission_id', 'question_id')`) to prevent multiple answers for the same question per submission.

---

## 2. Frontend and UI Redesign (FDB TALENT Branding)

### Rebranding (FDB TALENT)
- **Renamed**: Standardized the system name from "ExamOS" to the professional **FDB TALENT**.
- **Slogan**: Integrated the slogan *"A product from the Youth Union of the Faculty of Applied Sciences"* across the Hero Banner and Login interfaces.

### UI System Upgrade (VNU-IS Standards)
The interface has been fully updated to match the official **VNU-IS** brand identity:
- **Primary Color**: **Navy Blue (`#1e3a8a`)** applies to main buttons, Topbar, Sidebar, and typography.
- **Accent Color**: **Gold/Yellow (`#f59e0b`)** used for highlights, card borders, and status badges.
- **Visual Consistency**: Removed heavy dark modes and black backgrounds in favor of a clean, light, and professional aesthetic across Admin, Student, and Landing views.

### Bilingual Support Optimization
- **Features**: Fully fixed the Language Toggle functionality. Both Backend and Frontend now switch seamlessly between English and Vietnamese without layout shifts or color inconsistencies.
- **Standardization**: Synchronized all translation files with the new brand identity.
