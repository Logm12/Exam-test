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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                        {t("admin.dashboard.title")}
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">{t("admin.dashboard.subtitle")}</p>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <LanguageToggle />
                    <button className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold shadow-sm transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        {t("admin.dashboard.createExam")}
                    </button>
                </div>
            </div>

            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-[var(--shadow-sm)] border border-[var(--border-default)] dark:bg-[#1f1f1f]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-[var(--text-secondary)]">{t("admin.dashboard.totalExams")}</h3>
                        <div className="w-10 h-10 rounded-md flex items-center justify-center text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{metrics.total_submissions}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-[var(--shadow-sm)] border border-[var(--border-default)] dark:bg-[#1f1f1f]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-[var(--text-secondary)]">{t("admin.dashboard.avgScore")}</h3>
                        <div className="w-10 h-10 rounded-md flex items-center justify-center text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{metrics.average_score}/10</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-[var(--shadow-sm)] border border-[var(--border-default)] dark:bg-[#1f1f1f]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-[var(--text-secondary)]">{t("admin.dashboard.accuracy")}</h3>
                        <div className="w-10 h-10 rounded-md flex items-center justify-center text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{metrics.accuracy_rate}%</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-[var(--shadow-sm)] border border-[var(--border-default)] dark:bg-[#1f1f1f]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-red-600 dark:text-red-400">{t("admin.dashboard.cheatingAlerts")}</h3>
                        <div className="w-10 h-10 rounded-md flex items-center justify-center text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{metrics.high_violations.length}</p>
                </div>
            </div>

            {/* Split View: Reports + Recent Exams */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cheating Report Board */}
                <div className="bg-white rounded-lg shadow-[var(--shadow-sm)] border border-[var(--border-default)] overflow-hidden flex flex-col dark:bg-[#1f1f1f]">
                    <div className="px-6 py-4 border-b border-[var(--border-default)] flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                        <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            {t("admin.dashboard.violations")}
                        </h2>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800/50">TRỰC TIẾP</span>
                    </div>
                    <div className="flex-1 flex flex-col">
                        {metrics.high_violations.length > 0 ? (
                            <ul className="divide-y divide-[var(--border-default)]">
                                {metrics.high_violations.map((v: any, idx: number) => (
                                    <li key={idx} className="p-5 flex items-center justify-between transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--text-primary)]">{v.username}</p>
                                            <p className="text-xs text-[var(--text-secondary)] mt-1.5 flex items-center gap-1.5">
                                                {v.forced_submit ? (
                                                    <span className="font-medium px-2 py-0.5 rounded text-red-600 bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400">
                                                        {t("admin.dashboard.autoSubmit")} ({v.violation_count} {t("admin.dashboard.violations.count")})
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded text-[var(--text-secondary)] bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                                        {t("admin.dashboard.tabSwitch")} <span className="font-bold text-[var(--text-primary)]">{v.violation_count}</span> {t("admin.dashboard.times")}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-[var(--text-primary)] bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">{v.score !== null ? `${v.score}/10` : "N/A"}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-12 text-center my-auto flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center bg-green-50 dark:bg-green-900/20">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--status-success)" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">Hệ thống an toàn</h3>
                                <p className="text-sm text-[var(--text-secondary)]">{t("admin.dashboard.noViolations")}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Exams Table */}
                <div className="bg-white rounded-lg shadow-[var(--shadow-sm)] border border-[var(--border-default)] overflow-hidden flex flex-col dark:bg-[#1f1f1f]">
                    <div className="px-6 py-4 border-b border-[var(--border-default)] flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                        <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                            {t("admin.dashboard.recentExams")}
                        </h2>
                        <span className="text-xs font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer">Xem tất cả</span>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        {exams.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)] bg-gray-50/50 dark:bg-gray-800/50">
                                        <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t("admin.dashboard.examTitle")}</th>
                                        <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t("admin.dashboard.duration")}</th>
                                        <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t("admin.dashboard.status")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-default)]">
                                    {exams.slice(0, 5).map((exam) => (
                                        <tr key={exam.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">
                                                <span className="hover:text-[var(--accent-primary)] cursor-pointer">{exam.title}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                                <div className="flex items-center gap-1.5">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                    {exam.duration} {t("admin.dashboard.minutes")}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold border ${exam.is_published
                                                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30"
                                                    : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                                                    }`}
                                                >
                                                    {exam.is_published ? t("admin.dashboard.published") : t("admin.dashboard.draft")}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center text-[var(--text-secondary)] flex flex-col items-center justify-center">
                                <svg className="mb-3 text-gray-300 dark:text-gray-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                <p className="text-sm">Không tìm thấy bài thi nào</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboardClient({ metrics, exams }: { metrics: Metrics; exams: Exam[] }) {
    return <DashboardContent metrics={metrics} exams={exams} />;
}
