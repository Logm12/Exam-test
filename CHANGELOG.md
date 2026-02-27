# Changelog

All notable changes to ExamOS are documented here.

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
