"use client";

import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

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
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                        {t("admin.dashboard.title")}
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">{t("admin.dashboard.subtitle")}</p>
                </div>
                <div className="flex items-center gap-3">
                    <LanguageToggle />
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm">
                        {t("admin.dashboard.createExam")}
                    </button>
                </div>
            </div>

            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-neutral-500">{t("admin.dashboard.totalExams")}</h3>
                        <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">T</span>
                    </div>
                    <p className="text-3xl font-bold text-neutral-900 mt-4">{metrics.total_submissions}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-neutral-500">{t("admin.dashboard.avgScore")}</h3>
                        <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">S</span>
                    </div>
                    <p className="text-3xl font-bold text-neutral-900 mt-4">{metrics.average_score}/10</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-neutral-500">{t("admin.dashboard.accuracy")}</h3>
                        <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">A</span>
                    </div>
                    <p className="text-3xl font-bold text-neutral-900 mt-4">{metrics.accuracy_rate}%</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-red-500">{t("admin.dashboard.cheatingAlerts")}</h3>
                        <span className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-bold">!</span>
                    </div>
                    <p className="text-3xl font-bold text-red-600 mt-4">{metrics.high_violations.length}</p>
                </div>
            </div>

            {/* Split View: Reports + Recent Exams */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cheating Report Board */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-neutral-900">{t("admin.dashboard.violations")}</h2>
                        <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded">{t("admin.dashboard.live")}</span>
                    </div>
                    <div className="p-0">
                        {metrics.high_violations.length > 0 ? (
                            <ul className="divide-y divide-neutral-100">
                                {metrics.high_violations.map((v: any, idx: number) => (
                                    <li key={idx} className="p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">{v.username}</p>
                                            <p className="text-xs text-neutral-500 mt-1">
                                                {v.forced_submit ? (
                                                    <span className="text-red-600 font-medium">
                                                        {t("admin.dashboard.autoSubmit")} ({v.violation_count} {t("admin.dashboard.violations.count")})
                                                    </span>
                                                ) : (
                                                    <span>{t("admin.dashboard.tabSwitch")} {v.violation_count} {t("admin.dashboard.times")}</span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-neutral-900">{v.score !== null ? `${v.score}/10` : "N/A"}</div>
                                            <div className="text-xs text-neutral-400">Score</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-10 text-center text-neutral-500">
                                <div className="text-3xl mb-3 text-indigo-500 font-bold">OK</div>
                                <p className="text-sm">{t("admin.dashboard.noViolations")}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Exams Table */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50">
                        <h2 className="text-lg font-semibold text-neutral-900">{t("admin.dashboard.recentExams")}</h2>
                    </div>
                    <div className="p-0">
                        {exams.length > 0 ? (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-neutral-100">
                                        <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">{t("admin.dashboard.examTitle")}</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">{t("admin.dashboard.duration")}</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">{t("admin.dashboard.status")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50">
                                    {exams.slice(0, 5).map((exam) => (
                                        <tr key={exam.id} className="hover:bg-neutral-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-neutral-900">{exam.title}</td>
                                            <td className="px-6 py-4 text-sm text-neutral-500">{exam.duration} {t("admin.dashboard.minutes")}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${exam.is_published
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-neutral-100 text-neutral-600"
                                                    }`}>
                                                    {exam.is_published ? t("admin.dashboard.published") : t("admin.dashboard.draft")}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-10 text-center text-neutral-500">
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
