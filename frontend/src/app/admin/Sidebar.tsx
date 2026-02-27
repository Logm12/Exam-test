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
        <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col justify-between">
            <div>
                <div className="h-16 flex items-center px-6 border-b border-neutral-100">
                    <h1 className="text-xl font-bold tracking-tight text-indigo-600">
                        Exam<span className="text-neutral-900">OS</span>
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
                                className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                    ? "text-indigo-700 bg-indigo-50/50"
                                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-neutral-100">
                <button
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors"
                >
                    {t("admin.sidebar.logout")}
                </button>
            </div>
        </aside>
    );
}
