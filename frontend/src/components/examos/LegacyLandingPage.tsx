"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import FdbLogo from "@/components/FdbLogo";

export default function LegacyLandingPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
            {/* Background Poster (Direct Layer 0) */}
            <div className="fixed inset-0 z-0">
                <img 
                    src="/poster.png" 
                    alt="Poster Background" 
                    className="w-full h-full object-cover brightness-[0.7] scale-100"
                />
                {/* Dark Vignette Overlay for Depth */}
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Navigation (Layer 1 - Transparent) */}
            <header className="fixed top-0 left-0 right-0 z-[100] bg-transparent">
                <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center">
                        <FdbLogo className="text-[2.2rem] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] invert brightness-200" />
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/login"
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-2.5 rounded-full text-sm font-bold transition-all"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Minimal Hero (Layer 2) */}
            <main className="relative z-10 min-h-screen flex items-center pt-20">
                <div className="max-w-7xl mx-auto px-6 w-full">
                    <div className="max-w-3xl space-y-12">
                        <div className="space-y-6 animate-fade-in">
                            <h1 className="text-6xl md:text-8xl font-black leading-[1.05] tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
                                <span className="block">{t("landing.hero.title").split(" ")[0]} {t("landing.hero.title").split(" ")[1]}</span>
                                <span className="block text-blue-400">
                                    {t("landing.hero.title").split(" ").slice(2).join(" ")}
                                </span>
                            </h1>
                            <p className="text-2xl text-white/90 max-w-2xl leading-relaxed font-semibold drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]">
                                {t("landing.hero.subtitle")}
                            </p>
                        </div>

                        <div className="flex items-center gap-8 animate-slide-up">
                            <Link
                                href="/login"
                                className="px-14 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-black text-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 border-2 border-blue-400/20"
                            >
                                Vào thi
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer (Minimal Overlay) */}
            <footer className="relative z-10 py-12 bg-black/40 backdrop-blur-sm border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs font-bold tracking-widest text-white/50 uppercase">
                    <div>&copy; 2026 FDB TALENT LMS Platform. All rights reserved.</div>
                    <div className="flex space-x-8 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">VNUIS</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
