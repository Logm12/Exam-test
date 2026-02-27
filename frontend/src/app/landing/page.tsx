"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function LandingPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white font-sans overflow-hidden">
            {/* Navigation */}
            <header className="relative z-20">
                <nav className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <span className="text-white font-bold text-sm">EO</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">{t("app.name")}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <LanguageToggle />
                        <Link
                            href="/admin/login"
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            {t("landing.cta.admin")}
                        </Link>
                        <Link
                            href="/login"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
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
                        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

                        <div className="relative">
                            <span className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-medium text-indigo-300 mb-6 backdrop-blur-sm">
                                {t("landing.badge")}
                            </span>
                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
                                {t("landing.hero.title")}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed">
                                {t("landing.hero.subtitle")}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link
                                href="/login"
                                className="group bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center gap-2"
                            >
                                {t("landing.cta.student")}
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                            <Link
                                href="/admin/login"
                                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-all backdrop-blur-sm"
                            >
                                {t("landing.cta.admin")}
                            </Link>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all group">
                            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-sm font-bold text-red-400 mb-5 group-hover:scale-110 transition-transform">
                                AC
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{t("landing.features.antiCheat")}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {t("landing.features.antiCheatDesc")}
                            </p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all group">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-sm font-bold text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                                RT
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{t("landing.features.realtime")}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {t("landing.features.realtimeDesc")}
                            </p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all group">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-sm font-bold text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                                MF
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{t("landing.features.multiFormat")}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {t("landing.features.multiFormatDesc")}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-8">
                <div className="max-w-6xl mx-auto px-6 text-center text-sm text-slate-500">
                    © 2026 ExamOS — FDB Talent
                </div>
            </footer>
        </div>
    );
}
