"use client";

import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

type Metrics = {
    total_submissions: number;
    average_score: number;
    high_violations: any[];
    accuracy_rate: number;
};

type Exam = {
    id: number;
    title: string;
    duration: number;
    is_published: boolean;
};

function DashboardContent({ metrics, exams }: { metrics: Metrics; exams: Exam[] }) {
    const { t } = useLanguage();

    return (
        <div className="space-y-6 animate-fade-in font-sans pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                        {t("admin.dashboard.title")}
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">{t("admin.dashboard.subtitle")}</p>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <LanguageToggle />
                    <button className="accent-btn flex items-center gap-2 px-5 py-2.5">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        {t("admin.dashboard.createExam")}
                    </button>
                </div>
            </div>

            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="surface-card p-6 border-b-4 border-b-[var(--status-info)] hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-[var(--text-secondary)]">{t("admin.dashboard.totalExams")}</h3>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--status-info)] font-bold shadow-sm" style={{ background: 'rgba(2, 132, 199, 0.1)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{metrics.total_submissions}</p>
                </div>

                <div className="surface-card p-6 border-b-4 border-b-[var(--status-success)] hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-[var(--text-secondary)]">{t("admin.dashboard.avgScore")}</h3>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--status-success)] font-bold shadow-sm" style={{ background: 'rgba(5, 150, 105, 0.1)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{metrics.average_score}/10</p>
                </div>

                <div className="surface-card p-6 border-b-4 border-b-[var(--accent-primary)] hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-[var(--text-secondary)]">{t("admin.dashboard.accuracy")}</h3>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--accent-primary)] font-bold shadow-sm" style={{ background: 'var(--accent-glow)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{metrics.accuracy_rate}%</p>
                </div>

                <div className="surface-card p-6 border-b-4 border-b-[var(--status-danger)] hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-[var(--status-danger)]">{t("admin.dashboard.cheatingAlerts")}</h3>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--status-danger)] font-bold shadow-sm" style={{ background: 'rgba(220, 38, 38, 0.1)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--status-danger)]">{metrics.high_violations.length}</p>
                </div>
            </div>

            {/* Split View: Reports + Recent Exams */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cheating Report Board */}
                <div className="surface-card overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-[var(--border-subtle)] flex justify-between items-center" style={{ background: 'var(--surface-hover)' }}>
                        <h2 className="text-lg font-bold text-[var(--text-primary)]">{t("admin.dashboard.violations")}</h2>
                        <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'rgba(220, 38, 38, 0.1)', color: 'var(--status-danger)' }}>{t("admin.dashboard.live")}</span>
                    </div>
                    <div className="p-0 flex-1 flex flex-col">
                        {metrics.high_violations.length > 0 ? (
                            <ul className="divide-y divide-[var(--border-subtle)]">
                                {metrics.high_violations.map((v: any, idx: number) => (
                                    <li key={idx} className="p-6 flex items-center justify-between transition-colors hover:bg-[var(--surface-hover)]">
                                        <div>
                                            <p className="text-sm font-bold text-[var(--text-primary)]">{v.username}</p>
                                            <p className="text-xs text-[var(--text-secondary)] mt-1.5 flex items-center gap-1.5">
                                                {v.forced_submit ? (
                                                    <span className="font-medium px-2 py-0.5 rounded-md" style={{ color: 'var(--status-danger)', background: 'rgba(220, 38, 38, 0.1)' }}>
                                                        {t("admin.dashboard.autoSubmit")} ({v.violation_count} {t("admin.dashboard.violations.count")})
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-md" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)' }}>
                                                        {t("admin.dashboard.tabSwitch")} <span className="font-bold text-[var(--text-primary)]">{v.violation_count}</span> {t("admin.dashboard.times")}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-[var(--text-primary)] bg-[var(--surface-hover)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)]">{v.score !== null ? `${v.score}/10` : "N/A"}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-12 text-center my-auto flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center" style={{ background: 'rgba(5, 150, 105, 0.1)' }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--status-success)" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">System Secure</h3>
                                <p className="text-sm text-[var(--text-secondary)]">{t("admin.dashboard.noViolations")}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Exams Table */}
                <div className="surface-card overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-[var(--border-subtle)] flex justify-between items-center" style={{ background: 'var(--surface-hover)' }}>
                        <h2 className="text-lg font-bold text-[var(--text-primary)]">{t("admin.dashboard.recentExams")}</h2>
                        <span className="text-xs font-medium text-[var(--accent-primary)] hover:underline cursor-pointer">View All</span>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        {exams.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)]">
                                        <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t("admin.dashboard.examTitle")}</th>
                                        <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t("admin.dashboard.duration")}</th>
                                        <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t("admin.dashboard.status")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-subtle)]">
                                    {exams.slice(0, 5).map((exam) => (
                                        <tr key={exam.id} className="transition-colors hover:bg-[var(--surface-hover)]">
                                            <td className="px-6 py-4 text-sm font-bold text-[var(--text-primary)]">{exam.title}</td>
                                            <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-mono">{exam.duration} {t("admin.dashboard.minutes")}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${exam.is_published
                                                    ? "border"
                                                    : "border"
                                                    }`}
                                                    style={{
                                                        background: exam.is_published ? 'rgba(5, 150, 105, 0.1)' : 'var(--surface-hover)',
                                                        color: exam.is_published ? 'var(--status-success)' : 'var(--text-secondary)',
                                                        borderColor: exam.is_published ? 'rgba(5, 150, 105, 0.2)' : 'var(--border-default)'
                                                    }}>
                                                    {exam.is_published ? t("admin.dashboard.published") : t("admin.dashboard.draft")}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center text-[var(--text-secondary)] flex flex-col items-center justify-center">
                                <svg className="mb-3 opacity-50" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                <p className="text-sm">No exams found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboardClient({ metrics, exams }: { metrics: Metrics; exams: Exam[] }) {
    return (
        <LanguageProvider>
            <DashboardContent metrics={metrics} exams={exams} />
        </LanguageProvider>
    );
}
