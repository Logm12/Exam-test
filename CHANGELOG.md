# Changelog

All notable changes to the FDB TALENT platform are documented here.

## [1.9.0] - 2026-03-28

### Fixed
- **Next.js 16 Compatibility**: Resolved asynchronous `params` errors in `exam/[id]/landing/page.tsx` by converting parameter extraction to the `Promise` API.
- **Frontend Routing**: Corrected the student dashboard "Enter Exam" link to direct users to the dynamic landing page instead of the examination engine.
- **Gateway Navigation**: Updated the "Go Back" link in `ExamGatewayClient.tsx` to point to the `/dashboard` route.
- **Backend Import Stability**: Resolved over 47 Python import errors, including circular dependencies and module-level import ordering, using Ruff and target refactoring.
- **Dependency Versioning**: Fixed the conflict between `redis` and `fastapi-limiter` by pinning `redis` to `<5.0.0`.

### Changed
- **Development Environment**: Standardized Python 3.12 environment management within the `FDBTa` Conda environment.

## [1.8.0] - 2026-03-27

### Added
- **Dynamic Exam Landing Pages**: Implemented a system where each exam can have its own customized landing page.
    - New backend `landing_config` JSON field on Exam model to store poster, organizer details, rules, and guides.
    - New public API endpoint `GET /api/v1/exams/{id}/landing` for dynamic data retrieval.
    - Dynamic route `/exam/[id]/landing` on the frontend that renders the page based on exam-specific configuration.
- **Mandatory Student Profile Flow**: Implemented a registration-to-dashboard requirement for student profiles.
    - New student profile fields: CCCD, address, phone, email, and lien_chi_doan.
    - Automatic redirection to `/dashboard/profile` after secure registration.
    - Forced profile completion check before accessing the main student dashboard.
- **Developer Tools**: Added `seed_exam.py` to quickly generate test exams with landing page configurations.

### Changed
- **Registration Logic**: Updated the registration flow to include automatic login and immediate redirection to profile completion.
- **Landing UI**: Refactored `Hero`, `Countdown`, `Rules`, and `CTA` components to be props-driven for dynamic rendering.
- **Standardized API Fetching**: Switched to the internal `fetcher` utility for all dynamic landing page requests to ensure robust `localhost`/`127.0.0.1` handling.

### Fixed
- **Dependency Versioning**: Pinned `fastapi-limiter==0.1.5` to resolve import errors and ensure API stability.
- **Schema Validation**: Updated `StudentUpdate` and `ExamUpdate` schemas to handle new metadata fields without failing validation.
- **Environment Sync**: Fixed issues with session tokens and authorization headers during server-side rendering on the landing page.

## [1.7.1] - 2026-03-25

### Changed
- Landing routes: `/landing` now serves the Legal Contest landing page; `/landing-law` redirects to `/landing`.
- Branding: Standardized navbar/logo usage to use `frontend/public/logofdb.jpeg` across key nav components and `FdbLogo`.
- Legal contest landing: Updated organizer section layout (wider logos above titles, removed boxed styling for the I/S philosophy block).
- Admin + student dashboards: Enlarged and centered the logo in left sidebar headers for better visual balance.

### Removed
- Removed the extra logo divider/auxiliary mark from the shared `FdbLogo` rendering to keep nav branding clean.

## [1.7.0] - 2026-03-18

### Added
- Unified development environment: Added a root `package.json` with a `npm run dev` script that starts Docker, Backend, and Frontend concurrently.
- Integrated `concurrently` to manage multiple server processes with automatic cleanup.
- Dedicated `tests/` and `scripts/` directories in both Backend and Frontend for better project organization.

### Changed
- Standardized Backend runtime: Configured uvicorn to use a consistent Python environment path, resolving "Conda command not found" issues in terminal launchers.
- Restored `correct_count` property to the `Submission` model to align with the latest database schema (2026-03-18 update).

### Fixed
- Database Synchronization: Resolved `UndefinedColumnError` regarding `submissions.correct_count` by resyncing the PostgreSQL schema with the latest SQL dump.
- Dependency Resolution: Fixed `fastapi-limiter` import errors by pinning to a stable version (`0.1.5`) and updating the internal initialization logic.
- Answer Schema Alignment: Removed deprecated `UniqueConstraint` on questions per submission in the database model to match the production schema definition.
- Cache Management: Performed deep cache purges for both `pip` and `npm` to prevent resource-heavy core dumps and stale build artifacts.

## [1.6.0] - 2026-03-16

### Added
- Integrated `start.bat` launcher for simultaneous Frontend (port 3000), Backend (port 8000), and Docker service startup.
- Added comprehensive coverage for optional `start_time` and `cover_image` handling in exam creation/editing flows.

### Changed
- Refactored `ExamUpdate` Pydantic schema to make all fields truly optional, resolving 422 Validation Errors during partial updates.
- Decoupled `ExamUpdate` from `ExamBase` to ensure mandatory base fields do not block surgical updates (e.g., toggling publish status).
- Updated admin exam editing UI to use environment-aware API URLs for cover image previews.

### Fixed
- Applied missing `a1b2c3d4e5f6` migration adding the `cover_image` column to the `exams` table, resolving SQL persistence errors.
- Fixed `togglePublish` logic in the admin portal to only transmit modified fields, drastically reducing payload size and validation overhead.
- Resolved "Admin cannot create exam" bug caused by strict schema validation on non-critical metadata.
- Fixed broken image upload flow where validation errors prevented retrieval of newly created exam IDs.

## [1.5.0] - 2026-03-09

### Added
- Student exam dashboard with collapsible sidebar navigation (Exams, Account, Help, Logout)
- Exam card grid layout with cover image placeholder, status badges, circular progress indicator, and date/duration metadata
- Filter tabs (All, In Progress, Not Started, Completed) and full-text search on the student dashboard
- Grid/List view toggle and configurable pagination (6/10/20/50 items per page)
- Help page (`/dashboard/help`) with support request form (subject dropdown, message textarea) and ticket tracking view
- Support ticket tracking with status indicators (Pending / Responded)

### Changed
- Rewrote `StudentDashboardClient.tsx` from a simple list layout to a sidebar-based dashboard matching VNU-IS design system
- Sidebar items now use Next.js `Link` for proper client-side navigation instead of buttons
- Added `pool_pre_ping=True` and `pool_recycle=3600` to SQLAlchemy async engine to prevent stale database connections
- Exam cards in the student dashboard are now wrapped in `Link` to directly navigate to `/exam/[id]/take`
- Added `/admin/exams/[id]/submissions` endpoint and UI page to allow admins to view submission details for each exam
- Added `GET /exams/me` endpoint to return personal exam status and scores for students
- Exam cards on Student Dashboard now display the final score for submitted tests and prevent re-entry
- Replaced intermediate receipt page with direct dashboard redirection and success alerts upon exam submission

### Fixed
- Database `InterfaceError: connection is closed` caused by stale PostgreSQL connection pool after idle periods
- Re-seeded default user accounts (`admin/admin123`, `student/password123`) with updated password hashes
- Student `submitExam` function silent failure caused by improper API error handling
- Initial application load auto-redirect bug occurring due to stale cached frontend NextAuth sessions

## [1.4.0] - 2026-03-09

### Changed
- Unified Login System: Replaced separate Admin and Student login pages with a single role-selectable layout at `/login`.
- Redesigned `/login` and `/register` interfaces to visually align with VNU-IS branding (Navy Blue & Gold) in a dual-column layout.
- Simplified Landing Page (`/`) to contain a single "Get Started" button linking to the unified login page.
- Updated NextAuth `CredentialsProvider` to validate backend user roles against requested UI roles.
- Removed deprecated UI components and unused placeholder files from the project.

## [1.3.0] - 2026-03-03

### Added
- Automated question extraction from .docx and .pdf files (regex-based document parser)
- Slug-based public exam landing pages for direct access and sharing
- Secure self-registration portal for both Student and Admin roles
- Persistent theme system with automatic day/night switching and manual override
- Full localization (Vietnamese/English) for all student and admin touchpoints
- Enhanced session management with automatic redirects for authenticated users

### Changed
- Refactored admin exam builder to support file imports
- Improved exam timer synchronization logic to ensure backend-frontend consistency
- Optimized toggle components (Language/Theme) for stable hydration

### Fixed
- Hydration mismatches in LanguageToggle and ThemeToggle components
- Backend dependency conflicts preventing server startup (google-auth, fastapi-limiter)
- NaN duration bug in admin exam configuration forms
- Student dashboard fetch failures during server-side rendering
- Exam submission button responsiveness and z-index interference

## [1.2.0] - 2026-02-27

### Added
- Public landing page at `/` with dark theme, feature overview, and dual login paths
- Language switching (Vietnamese / English) with localStorage persistence
- Student dashboard at `/dashboard` with exam listing and anti-cheat notice
- Admin dashboard now shows Recent Exams table replacing the old customization panel
- `LanguageContext`, `translations.ts`, and `LanguageToggle` component for i18n
- Path-based middleware routing (replaces subdomain-based routing)

### Changed
- Root page (`/`) is now the public landing page; student dashboard moved to `/dashboard`
- Admin dashboard uses client component for language support
- Sidebar navigation labels are now translated
- All login pages include language toggle
- Middleware simplified to use `proxy.ts` (Next.js 16 convention)
- Re-enabled `NEXTAUTH_URL` in `.env.local`

### Removed
- Aesthetic Customization Engine and LivePreview component from admin dashboard
- All decorative emoji from UI components and documentation
- Subdomain-based routing logic (replaced with path-based)
- Duplicate `middleware.ts` file (Next.js 16 uses `proxy.ts`)

### Fixed
- Admin login failing due to backend not running on port 8000
- NextAuth session issues caused by commented-out `NEXTAUTH_URL`
- Middleware not executing due to wrong filename (`proxy.ts` vs `middleware.ts`)
- Duplicate `</span>` tag in exam gateway page causing JSX parse errors

## [1.1.0] - 2026-02-26

### Fixed
- SSR fetch errors caused by Node 18+ defaulting to IPv6 for localhost resolution. The fetcher and NextAuth callbacks now explicitly use `127.0.0.1`.
- Build-time fetch failures resolved by adding `cache: "no-store"` to fetcher.
- 401 errors on submission fixed by adding isomorphic token injection (server: `getServerSession`, client: `getSession`).

### Added
- Social login configuration for Google, Facebook, and Zalo via NextAuth.js
- Admin sidebar as a client component with active navigation highlighting
- Student dashboard wired to database-driven exam assignments

### Changed
- Rewrote project documentation (README, PROJECT_REPORT, ENHANCEMENT_PROPOSAL) for clarity
