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

function GatewayContent({ exam }: { exam: Exam | null; examId: string }) {
    const { t } = useLanguage();

    if (!exam) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center font-sans p-6">
                <div className="surface-card p-8 max-w-md w-full text-center space-y-4">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold dark:bg-red-900/30 dark:text-red-400">!</div>
                    <h1 className="text-xl font-semibold text-[var(--text-primary)]">{t("exam.gateway.unavailable")}</h1>
                    <p className="text-[var(--text-secondary)] text-sm">{t("exam.gateway.unavailableDesc")}</p>
                    <Link href="/landing" className="inline-block mt-4 text-[var(--accent-primary)] font-medium hover:underline text-sm">
                        {t("exam.gateway.returnDashboard")}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col font-sans">
            <header className="bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                            {t("exam.gateway.backDashboard")}
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <LanguageToggle />
                        <span className="font-semibold text-[var(--text-primary)] tracking-tight text-sm">
                            {t("exam.gateway.header")}
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-16 animate-fade-in">
                <div className="surface-card p-10 space-y-10">
                    <div className="space-y-3 text-center border-b border-[var(--border-subtle)] pb-10">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                            {exam.title}
                        </h1>
                        <div className="flex items-center justify-center space-x-6 text-sm text-[var(--text-secondary)]">
                            <span className="flex items-center space-x-2">
                                <span className="w-2 h-2 rounded-full bg-[var(--status-success)]"></span>
                                <span>{t("exam.gateway.status")}</span>
                            </span>
                            <span className="flex items-center space-x-2 text-[var(--accent-primary)] font-medium bg-[var(--bg-secondary)] border border-[var(--border-accent)] px-3 py-1 rounded-full">
                                {exam.duration} {t("exam.gateway.minutes")}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">{t("exam.gateway.briefing")}</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-4">
                                <div className="mt-0.5 text-[var(--accent-primary)] font-bold">1</div>
                                <div>
                                    <h3 className="text-sm font-medium text-[var(--text-primary)]">{t("exam.gateway.continuous")}</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">{t("exam.gateway.continuousDesc")}</p>
                                </div>
                            </li>
                            <li className="flex items-start space-x-4">
                                <div className="mt-0.5 text-[var(--accent-primary)] font-bold">2</div>
                                <div>
                                    <h3 className="text-sm font-medium text-[var(--text-primary)]">{t("exam.gateway.antiCheat")}</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">{t("exam.gateway.antiCheatDesc")}</p>
                                </div>
                            </li>
                            <li className="flex items-start space-x-4">
                                <div className="mt-0.5 text-[var(--accent-primary)] font-bold">3</div>
                                <div>
                                    <h3 className="text-sm font-medium text-[var(--text-primary)]">{t("exam.gateway.autoSubmit")}</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">{t("exam.gateway.autoSubmitDesc")}</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col items-center space-y-4">
                        <Link
                            href={`/exam/${exam.id}/take`}
                            className="accent-btn w-full text-center px-10 py-4 text-base font-semibold"
                        >
                            {t("exam.gateway.startBtn")}
                        </Link>
                        <p className="text-xs text-[var(--text-muted)]">{t("exam.gateway.agreement")}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ExamGatewayClient({ exam, examId }: { exam: Exam | null; examId: string }) {
    return (
        <LanguageProvider>
            <GatewayContent exam={exam} examId={examId} />
        </LanguageProvider>
    );
}
