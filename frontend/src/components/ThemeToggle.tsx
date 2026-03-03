"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

const icons = {
    auto: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            <path d="M12 8a4 4 0 0 1 0 8" fill="currentColor" opacity="0.3" />
        </svg>
    ),
    light: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2 4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
    ),
    dark: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
    ),
};

const labels = {
    auto: "Auto",
    light: "Light",
    dark: "Dark",
};

export default function ThemeToggle() {
    const { themeMode, cycleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                disabled
            >
                {icons.auto}
                <span className="hidden sm:inline">Auto</span>
            </button>
        );
    }

    return (
        <button
            onClick={cycleTheme}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
            title={`Theme: ${labels[themeMode]}`}
            aria-label={`Switch theme, current: ${labels[themeMode]}`}
        >
            {icons[themeMode]}
            <span className="hidden sm:inline">{labels[themeMode]}</span>
        </button>
    );
}
