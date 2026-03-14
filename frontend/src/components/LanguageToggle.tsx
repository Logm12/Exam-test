"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

export default function LanguageToggle({ className = "" }: { className?: string }) {
    const { locale, toggleLocale, t } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-indigo-200 bg-white text-indigo-700 transition-all duration-200 ${className}`}
                disabled
            >
                EN
            </button>
        );
    }

    return (
        <button
            onClick={toggleLocale}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 hover:scale-105 ${locale === "vi"
                ? "bg-white text-blue-900 border-blue-200 hover:bg-blue-50"
                : "bg-blue-900 text-white border-blue-900 hover:bg-blue-800"
                } ${className}`}
            title={locale === "vi" ? "Chuyển sang Tiếng Anh" : "Chuyển sang Tiếng Việt"}
        >
            {t("app.language")}
        </button>
    );
}
