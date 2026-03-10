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
        <aside className="w-64 bg-white border-r border-[var(--border-default)] flex flex-col justify-between shadow-[var(--shadow-sm)] dark:bg-[#1f1f1f]">
            <div>
                <div className="h-16 flex items-center px-6 border-b border-[var(--border-default)] bg-white dark:bg-[#1f1f1f]">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--accent-primary)] text-white mr-3 shadow-sm">
                        <span className="font-black text-sm">FDB</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-[var(--accent-primary)]">
                        FDB<span className="text-[var(--text-primary)]">TALENT</span>
                    </h1>
                </div>
                <nav className="p-4 space-y-1.5">
                    {navItems.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${isActive
                                    ? "text-[var(--accent-primary)] bg-blue-50 border-l-4 border-[var(--accent-primary)] dark:bg-blue-900/20"
                                    : "text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-gray-50 border-l-4 border-transparent dark:hover:bg-gray-800"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-[var(--border-default)]">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-md text-[var(--status-danger)] bg-red-50 hover:bg-red-100 transition-colors border border-red-100 dark:bg-red-900/20 dark:border-red-900/30 dark:hover:bg-red-900/40"
                >
                    {t("admin.sidebar.logout")}
                </button>
            </div>
        </aside>
    );
}
