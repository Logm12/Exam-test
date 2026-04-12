export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--bg-secondary)] py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-[var(--text-muted)] sm:flex-row sm:px-6 lg:px-8">
        <div>&copy; {new Date().getFullYear()} ExamHub. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <a className="hover:text-[var(--accent-primary)]" href="#featured">
            Exams
          </a>
          <a className="hover:text-[var(--accent-primary)]" href="#leaderboard">
            Leaderboard
          </a>
          <a className="hover:text-[var(--accent-primary)]" href="#live">
            Live
          </a>
        </div>
      </div>
    </footer>
  );
}
