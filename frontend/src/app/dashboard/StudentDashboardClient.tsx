"use client";

import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

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
        <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
            {/* Top Navigation */}
            <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-neutral-900 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">EO</span>
                        </div>
                        <span className="font-semibold text-neutral-900 tracking-tight">{t("app.name")}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <LanguageToggle />
                        <div className="text-sm font-medium text-neutral-600">{userName}</div>
                        <Link
                            href="/api/auth/signout"
                            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                        >
                            {t("app.signOut")}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 animate-fade-in space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                        {t("student.dashboard.title")}
                    </h1>
                    <p className="text-neutral-500 text-sm">{t("student.dashboard.subtitle")}</p>
                </div>

                <section className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                        {t("student.dashboard.available")}
                    </h2>

                    {exams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {exams.map((exam) => (
                                <div
                                    key={exam.id}
                                    className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                                >
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-neutral-900 leading-tight">{exam.title}</h3>
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-50 text-indigo-700">
                                                {exam.duration} {t("student.duration")}
                                            </span>
                                        </div>
                                        <div className="text-sm text-neutral-500 font-mono">
                                            {t("student.starts")} {new Date(exam.start_time).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-neutral-100">
                                        <Link
                                            href={`/exam/${exam.id}`}
                                            className="block w-full text-center bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            {t("student.dashboard.begin")}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-dashed border-neutral-300 rounded-2xl p-12 text-center">
                            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-neutral-400 text-xl">✓</span>
                            </div>
                            <h3 className="text-neutral-900 font-medium mb-1">{t("student.dashboard.noExams")}</h3>
                            <p className="text-neutral-500 text-sm">{t("student.dashboard.noExamsDesc")}</p>
                        </div>
                    )}
                </section>

                <section className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 mt-12 flex space-x-4 items-start">
                    <div className="text-indigo-600 text-sm font-bold">i</div>
                    <div>
                        <h4 className="text-indigo-900 font-medium text-sm mb-1">{t("student.antiCheat.title")}</h4>
                        <p className="text-indigo-700/80 text-sm">{t("student.antiCheat.desc")}</p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default function StudentDashboardClient({ exams, userName }: { exams: Exam[]; userName: string }) {
    return (
        <LanguageProvider>
            <DashboardContent exams={exams} userName={userName} />
        </LanguageProvider>
    );
}
