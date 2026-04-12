"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExamInfo {
    id: number;
    title: string;
    description: string | null;
    slug: string;
    start_time: string;
    duration: number;
    is_published: boolean;
}

export default function ExamLandingPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { t } = useLanguage();
    const [exam, setExam] = useState<ExamInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!slug) return;
        fetch(`/api/proxy/exams/by-slug/${slug}`)
            .then((res) => {
                if (!res.ok) throw new Error("Not found");
                return res.json();
            })
            .then((data) => {
                setExam(data);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="text-[var(--text-secondary)]">{t("app.processing")}</div>
            </div>
        );
    }

    if (error || !exam) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        {t("exam.gateway.unavailable")}
                    </h1>
                    <p className="text-[var(--text-secondary)]">{t("exam.gateway.unavailableDesc")}</p>
                    <Link href="/landing" className="accent-btn inline-block px-6 py-3 mt-4 text-sm">
                        {t("exam.gateway.returnDashboard")}
                    </Link>
                </div>
            </div>
        );
    }

    const startDate = new Date(exam.start_time);
    const formattedDate = startDate.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            {/* Navbar */}
            <header className="relative z-20 border-b border-[var(--border-subtle)]">
                <nav className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/landing" className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
                            <span className="text-white font-bold text-xs">EO</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight">{t("app.name")}</span>
                    </Link>

                </nav>
            </header>

            {/* Exam Info */}
            <main className="max-w-4xl mx-auto px-6 py-16">
                <div className="surface-card p-8 md:p-12 text-center space-y-6">
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-medium border border-[var(--border-accent)] text-[var(--accent-primary)]" style={{ background: 'var(--accent-glow)' }}>
                        {exam.is_published ? t("student.dashboard.available") : t("admin.dashboard.draft")}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient">
                        {exam.title}
                    </h1>

                    {exam.description && (
                        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
                            {exam.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-[var(--text-secondary)]">
                        <div className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            <span>{exam.duration} {t("admin.dashboard.minutes")}</span>
                        </div>
                    </div>

                    <div className="pt-6">
                        <Link
                            href="/login"
                            className="accent-btn inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold"
                        >
                            {t("landing.cta.student")}
                            <span>&#8594;</span>
                        </Link>
                    </div>
                </div>

                {/* Exam Rules */}
                <div className="mt-8 surface-card p-8 space-y-4">
                    <h2 className="text-lg font-semibold">{t("exam.landing.rules")}</h2>
                    <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                        <li className="flex gap-3">
                            <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--status-warning)" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            <span>{t("exam.landing.rule1")}</span>
                        </li>
                        <li className="flex gap-3">
                            <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--status-danger)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            <span>{t("exam.landing.rule2")}</span>
                        </li>
                        <li className="flex gap-3">
                            <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--status-info)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            <span>{t("exam.landing.rule3")}</span>
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
