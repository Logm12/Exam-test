# Changelog

All notable changes to ExamOS are documented here.

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
