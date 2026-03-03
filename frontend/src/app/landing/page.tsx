"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

export default function LandingPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans overflow-hidden">
            {/* Navigation */}
            <header className="relative z-20">
                <nav className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg" style={{ background: 'var(--accent-gradient)' }}>
                            <span className="text-white font-bold text-sm">EO</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">{t("app.name")}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <ThemeToggle />
                        <LanguageToggle />
                        <Link
                            href="/admin/login"
                            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                        >
                            {t("landing.cta.admin")}
                        </Link>
                        <Link
                            href="/login"
                            className="accent-btn px-5 py-2.5 text-sm font-medium flex items-center"
                        >
                            {t("landing.cta.student")}
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero */}
            <main className="relative z-10">
                <div className="max-w-6xl mx-auto px-6 pt-20 pb-32">
                    <div className="text-center max-w-3xl mx-auto space-y-8">
                        {/* Floating orbs */}
                        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse" style={{ background: 'var(--accent-glow)' }} />
                        <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-50" style={{ background: 'var(--accent-glow)', animationDelay: '1s' }} />

                        <div className="relative">
                            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-6 border border-[var(--border-accent)] text-[var(--accent-primary)]" style={{ background: 'var(--accent-glow)' }}>
                                {t("landing.badge")}
                            </span>
                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-gradient">
                                {t("landing.hero.title")}
                            </h1>
                            <p className="text-lg md:text-xl text-[var(--text-secondary)] mt-6 max-w-2xl mx-auto leading-relaxed">
                                {t("landing.hero.subtitle")}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link
                                href="/login"
                                className="group accent-btn px-8 py-3.5 text-sm font-semibold flex items-center gap-2"
                            >
                                {t("landing.cta.student")}
                                <span className="group-hover:translate-x-1 transition-transform">&#8594;</span>
                            </Link>
                            <Link
                                href="/admin/login"
                                className="px-8 py-3.5 rounded-xl text-sm font-semibold transition-all border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] cursor-pointer glass-card"
                            >
                                {t("landing.cta.admin")}
                            </Link>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
                        <div className="surface-card p-8 hover:bg-[var(--surface-hover)] transition-all group cursor-pointer">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold mb-5 group-hover:scale-110 transition-transform" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--status-danger)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{t("landing.features.antiCheat")}</h3>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                {t("landing.features.antiCheatDesc")}
                            </p>
                        </div>
                        <div className="surface-card p-8 hover:bg-[var(--surface-hover)] transition-all group cursor-pointer">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold mb-5 group-hover:scale-110 transition-transform" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--status-success)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{t("landing.features.realtime")}</h3>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                {t("landing.features.realtimeDesc")}
                            </p>
                        </div>
                        <div className="surface-card p-8 hover:bg-[var(--surface-hover)] transition-all group cursor-pointer">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold mb-5 group-hover:scale-110 transition-transform" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--status-info)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{t("landing.features.multiFormat")}</h3>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                {t("landing.features.multiFormatDesc")}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-[var(--border-subtle)] py-8">
                <div className="max-w-6xl mx-auto px-6 text-center text-sm text-[var(--text-muted)]">
                    &copy; 2026 ExamOS &mdash; FDB Talent
                </div>
            </footer>
        </div>
    );
}
