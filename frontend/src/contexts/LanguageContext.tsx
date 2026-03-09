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

    const setLocale = (newLocale: Locale) => {
        // Enforce Vietnamese per user request
        setLocaleState("vi");
    };

    const toggleLocale = () => {
        // Disabled per user request
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
