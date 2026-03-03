"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Sidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();

    if (pathname === "/admin/login") {
        return null;
    }

    const navItems = [
        { name: t("admin.sidebar.dashboard"), href: "/admin", exact: true },
        { name: t("admin.sidebar.exams"), href: "/admin/exams", exact: false },
        { name: t("admin.sidebar.students"), href: "/admin/students", exact: false },
        { name: t("admin.sidebar.settings"), href: "/admin/settings", exact: false },
    ];

    return (
        <aside className="w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] flex flex-col justify-between transition-colors shadow-sm">
            <div>
                <div className="h-16 flex items-center px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md bg-[var(--accent-gradient)] text-white mr-3">
                        <span className="font-bold text-sm">EO</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-[var(--accent-primary)]">
                        Exam<span className="text-[var(--text-primary)]">OS</span>
                    </h1>
                </div>
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${isActive
                                    ? "text-[var(--accent-primary)] bg-[var(--accent-glow)] border border-[var(--border-accent)]"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-transparent"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-[var(--border-subtle)]">
                <button
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg text-[var(--status-danger)] hover:bg-[var(--surface-hover)] transition-colors border border-transparent hover:border-[var(--status-danger)]"
                    style={{ background: 'rgba(220, 38, 38, 0.05)' }}
                >
                    {t("admin.sidebar.logout")}
                </button>
            </div>
        </aside>
    );
}
