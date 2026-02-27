"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Locale, t as translate } from "@/lib/translations";

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
    toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
    locale: "vi",
    setLocale: () => { },
    t: (key: string) => key,
    toggleLocale: () => { },
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("vi");

    useEffect(() => {
        const saved = localStorage.getItem("examos-locale") as Locale;
        if (saved && (saved === "vi" || saved === "en")) {
            setLocaleState(saved);
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem("examos-locale", newLocale);
    };

    const toggleLocale = () => {
        setLocale(locale === "vi" ? "en" : "vi");
    };

    const tFn = (key: string) => translate(key, locale);

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t: tFn, toggleLocale }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
