"use client";

import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

type Exam = {
    id: number;
    title: string;
    duration: number;
    start_time: string;
    is_published: boolean;
};

function DashboardContent({ exams, userName }: { exams: Exam[]; userName: string }) {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col font-sans transition-colors duration-300">
            {/* Top Navigation */}
            <header className="bg-[var(--surface-overlay)] border-b border-[var(--border-subtle)] sticky top-0 z-30 backdrop-blur-md">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-md bg-[var(--accent-gradient)] text-white">
                            <span className="font-bold text-sm">EO</span>
                        </div>
                        <span className="font-semibold text-[var(--text-primary)] tracking-tight text-lg">{t("app.name")}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <LanguageToggle />
                        <div className="w-px h-5 bg-[var(--border-default)] mx-1 hidden sm:block"></div>
                        <div className="text-sm font-medium text-[var(--text-primary)] px-2 py-1 rounded-md bg-[var(--surface-hover)] shadow-sm border border-[var(--border-subtle)]">
                            {userName}
                        </div>
                        <Link
                            href="/api/auth/signout"
                            className="text-sm text-[var(--text-secondary)] hover:text-[var(--status-danger)] transition-colors py-1 px-2 rounded-md hover:bg-[var(--surface-hover)]"
                        >
                            {t("app.signOut")}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 animate-fade-in space-y-8 pb-20">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                        {t("student.dashboard.title")}
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm">{t("student.dashboard.subtitle")}</p>
                </div>

                <section className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mt-8">
                        {t("student.dashboard.available")}
                    </h2>

                    {exams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {exams.map((exam) => (
                                <div
                                    key={exam.id}
                                    className="surface-card p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300 group"
                                    style={{ borderRadius: 'var(--radius-xl)' }}
                                >
                                    <div className="flex-1 space-y-4 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-[var(--text-primary)] leading-tight text-lg group-hover:text-[var(--accent-primary)] transition-colors">{exam.title}</h3>
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-[var(--accent-glow)] text-[var(--accent-primary)] border border-[var(--border-accent)] shadow-sm">
                                                {exam.duration} {t("student.duration")}
                                            </span>
                                        </div>
                                        <div className="text-sm text-[var(--text-muted)] font-mono flex items-center gap-1.5">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                            {t("student.starts")} {new Date(exam.start_time).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] relative z-10">
                                        <Link
                                            href={`/exam/${exam.id}`}
                                            className="accent-btn block w-full text-center px-4 py-2.5"
                                        >
                                            {t("student.dashboard.begin")}
                                        </Link>
                                    </div>

                                    {/* Decorative gradient blob inside card */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-glow)] rounded-full blur-[40px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="surface-card rounded-2xl p-12 text-center shadow-lg border-2 border-dashed border-[var(--border-default)]">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--surface-hover)' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            </div>
                            <h3 className="text-[var(--text-primary)] font-bold text-lg mb-2">{t("student.dashboard.noExams")}</h3>
                            <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto">{t("student.dashboard.noExamsDesc")}</p>
                        </div>
                    )}
                </section>

                <section className="surface-card rounded-2xl p-6 mt-12 flex space-x-4 items-start border-l-4" style={{ borderLeftColor: 'var(--accent-primary)', background: 'var(--bg-secondary)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-glow)' }}>
                        <svg className="text-[var(--accent-primary)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /><circle cx="12" cy="12" r="10" /></svg>
                    </div>
                    <div>
                        <h4 className="text-[var(--text-primary)] font-bold text-sm mb-1">{t("student.antiCheat.title")}</h4>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{t("student.antiCheat.desc")}</p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default function StudentDashboardClient({ exams, userName }: { exams: Exam[]; userName: string }) {
    return (
        <DashboardContent exams={exams} userName={userName} />
    );
}
