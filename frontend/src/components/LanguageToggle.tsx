"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle({ className = "" }: { className?: string }) {
    const { locale, toggleLocale, t } = useLanguage();

    return (
        <button
            onClick={toggleLocale}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 hover:scale-105 ${locale === "vi"
                ? "bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                } ${className}`}
            title={locale === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
        >
            {t("app.language")}
        </button>
    );
}
