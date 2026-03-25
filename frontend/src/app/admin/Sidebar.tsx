"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";
import FdbLogo from "@/components/FdbLogo";

/* ── Inline SVG Icons ── */
function IconDashboard({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
    );
}
function IconExams({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    );
}
function IconStudents({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
function IconSettings({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}
function IconLogout({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

const iconMap: Record<string, React.ReactNode> = {
    dashboard: <IconDashboard />,
    exams: <IconExams />,
    students: <IconStudents />,
    settings: <IconSettings />,
};

export default function Sidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();

    if (pathname === "/admin/login") return null;

    const navItems = [
        { key: "dashboard", name: t("admin.sidebar.dashboard"), href: "/admin", exact: true },
        { key: "exams", name: t("admin.sidebar.exams"), href: "/admin/exams", exact: false },
        { key: "students", name: t("admin.sidebar.students"), href: "/admin/students", exact: false },
        { key: "settings", name: t("admin.sidebar.settings"), href: "/admin/settings", exact: false },
    ];

    return (
        <aside className="w-[260px] bg-white flex flex-col justify-between border-r border-slate-100 flex-shrink-0">
            {/* Logo */}
            <div>
                <div className="h-[72px] flex items-center justify-center px-6 border-b border-slate-50">
                    <FdbLogo className="text-[1.5rem]" />
                </div>

                {/* Nav */}
                <nav className="px-4 pt-6 space-y-1">
                    {navItems.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-[14px] font-semibold rounded-xl transition-all duration-200 ${isActive
                                    ? "bg-[#1e3a8a] text-white shadow-md shadow-blue-200/50"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                            >
                                <span className={`flex flex-shrink-0 items-center justify-center ${isActive ? "text-white/90" : "text-slate-400"}`}>
                                    {iconMap[item.key]}
                                </span>
                                <span className="mt-0.5 whitespace-nowrap leading-none font-medium">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom */}
            <div className="p-4 mb-2">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-semibold rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                >
                    <span className="flex flex-shrink-0 items-center justify-center text-slate-400 group-hover:text-red-500">
                        <IconLogout />
                    </span>
                    <span className="mt-0.5 whitespace-nowrap leading-none font-medium">
                        {t("admin.sidebar.logout")}
                    </span>
                </button>
            </div>
        </aside>
    );
}
