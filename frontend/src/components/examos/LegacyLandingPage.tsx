"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import FdbLogo from "@/components/FdbLogo";

export default function LegacyLandingPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans overflow-x-hidden">
            {/* Navigation (White Navbar, Shadow) */}
            <header className="sticky top-0 z-50 bg-[var(--surface-overlay)] border-b border-[var(--border-subtle)] shadow-sm backdrop-blur-md">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <FdbLogo className="text-[1.6rem]" />
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <LanguageToggle />
                        <Link
                            href="/login"
                            className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white px-6 py-2 rounded-md text-sm font-semibold transition-all shadow-md"
                        >
                            Bắt đầu
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero Section (2 Columns: Text Left, Visual Right) */}
            <main className="relative z-10 pt-16 pb-24 lg:pt-24 lg:pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                        {/* Left Col: Text */}
                        <div className="text-center lg:text-left space-y-8 mb-16 lg:mb-0">
                            <span className="inline-flex items-center rounded-md bg-yellow-50 px-3 py-1 text-sm font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/20 dark:bg-yellow-900/30 dark:text-yellow-300 dark:ring-yellow-500/30">
                                {t("landing.badge")}
                            </span>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1]">
                                <span className="block">{t("landing.hero.title").split(" ")[0]} {t("landing.hero.title").split(" ")[1]}</span>
                                <span className="block text-[var(--accent-primary)]">
                                    {t("landing.hero.title").split(" ").slice(2).join(" ")}
                                </span>
                            </h1>

                            <p className="mt-6 text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                {t("landing.hero.subtitle")}
                            </p>

                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    href="/login"
                                    className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white px-8 py-3.5 rounded-md text-base font-semibold shadow-md transition-colors flex items-center justify-center"
                                >
                                    Bắt đầu
                                </Link>
                            </div>
                        </div>

                        {/* Right Col: Visual Card Preview */}
                        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                            <div className="relative rounded-2xl bg-[var(--surface-card)] shadow-[var(--shadow-lg)] border border-[var(--border-default)] p-8 overflow-hidden transform lg:translate-y-4">
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-100 opacity-50 blur-2xl dark:bg-blue-900/40" />
                                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-40 h-40 rounded-full bg-yellow-100 opacity-40 blur-2xl dark:bg-yellow-900/30" />

                                <div className="relative">
                                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
                                        <h3 className="font-semibold text-lg">Đề thi mẫu (Preview)</h3>
                                        <span className="text-sm font-medium text-[var(--accent-primary)]">60 Phút</span>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center font-semibold text-sm">1</div>
                                            <div className="flex-1 space-y-4">
                                                <div className="h-4 bg-[var(--bg-tertiary)] rounded-sm w-3/4"></div>
                                                <div className="space-y-2">
                                                    <div className="h-10 bg-[var(--bg-primary)] rounded-md border border-[var(--border-default)] hover:border-[var(--accent-primary)] transition-colors"></div>
                                                    <div className="h-10 bg-[var(--bg-primary)] rounded-md border border-[var(--border-default)]"></div>
                                                    <div className="h-10 bg-[var(--bg-primary)] rounded-md border border-[var(--border-default)]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
                        {/* Card 1 */}
                        <div className="bg-[var(--surface-card)] p-8 rounded-xl shadow-[var(--shadow-md)] border border-[var(--border-default)] hover:shadow-[var(--shadow-lg)] transition-all">
                            <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-6 dark:bg-red-900/30">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">{t("landing.features.antiCheat")}</h3>
                            <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                                {t("landing.features.antiCheatDesc")}
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[var(--surface-card)] p-8 rounded-xl shadow-[var(--shadow-md)] border border-[var(--border-default)] hover:shadow-[var(--shadow-lg)] transition-all">
                            <div className="w-12 h-12 rounded-lg flex bg-green-100 text-green-600 items-center justify-center mb-6 dark:bg-green-900/30">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">{t("landing.features.realtime")}</h3>
                            <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                                {t("landing.features.realtimeDesc")}
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[var(--surface-card)] p-8 rounded-xl shadow-[var(--shadow-md)] border border-[var(--border-default)] hover:shadow-[var(--shadow-lg)] transition-all">
                            <div className="w-12 h-12 rounded-lg flex bg-blue-100 text-blue-600 items-center justify-center mb-6 dark:bg-blue-900/30">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">{t("landing.features.multiFormat")}</h3>
                            <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                                {t("landing.features.multiFormatDesc")}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-[var(--border-default)] py-10 mt-12 dark:bg-[#1f1f1f]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-[var(--text-muted)]">
                    <div>
                        &copy; 2026 FDB TALENT LMS Platform. All rights reserved.
                    </div>
                    <div className="mt-4 md:mt-0 space-x-6">
                        <a href="#" className="hover:text-[var(--accent-primary)]">Privacy Policy</a>
                        <a href="#" className="hover:text-[var(--accent-primary)]">Terms of Service</a>
                        <a href="#" className="hover:text-[var(--accent-primary)]">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
