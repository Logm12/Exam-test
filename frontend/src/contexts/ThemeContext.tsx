"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeMode = "light" | "dark" | "auto";

interface ThemeContextType {
    theme: "light" | "dark";
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "dark",
    themeMode: "auto",
    setThemeMode: () => { },
    cycleTheme: () => { },
});

function getAutoTheme(): "light" | "dark" {
    const hour = new Date().getHours();
    return (hour >= 18 || hour < 6) ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeMode, setThemeModeState] = useState<ThemeMode>("auto");
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    useEffect(() => {
        const saved = localStorage.getItem("examos-theme") as ThemeMode;
        if (saved && ["light", "dark", "auto"].includes(saved)) {
            setThemeModeState(saved);
        }
    }, []);

    useEffect(() => {
        if (themeMode === "auto") {
            setTheme(getAutoTheme());
            // Re-check every minute for auto mode
            const interval = setInterval(() => {
                setTheme(getAutoTheme());
            }, 60000);
            return () => clearInterval(interval);
        } else {
            setTheme(themeMode);
        }
    }, [themeMode]);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const setThemeMode = (mode: ThemeMode) => {
        setThemeModeState(mode);
        localStorage.setItem("examos-theme", mode);
    };

    const cycleTheme = () => {
        const order: ThemeMode[] = ["auto", "light", "dark"];
        const nextIndex = (order.indexOf(themeMode) + 1) % order.length;
        setThemeMode(order[nextIndex]);
    };

    return (
        <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, cycleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
