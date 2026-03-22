"use client";

import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

type Metrics = {
    total_submissions: number;
    average_score: number;
    high_violations: any[];
    accuracy_rate: number;
};

type Exam = {
    id: number;
    title: string;
    duration: number;
    is_published: boolean;
    start_time?: string;
};

/* ── Top Nav Bar ── */
function TopNav({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (t: string) => void }) {
    const tabs = ["Tất cả", "Hiện tại", "Sắp tới", "Đã xong"];
    return (
        <header className="flex items-center justify-between px-8 py-5">
            <div className="flex items-center gap-6">
                <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-slate-100">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 ${activeTab === tab
                                ? "bg-slate-900 text-white shadow-md"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-4">
                {/* Search */}
                <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:shadow-sm transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </button>
                {/* Bell */}
                <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:shadow-sm transition-all relative">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F5F6F8]" />
                </button>
                {/* Language */}

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    A
                </div>
            </div>
        </header>
    );
}

/* ── Metric Mini Card ── */
function MetricCard({ label, value, icon, color, bgColor }: { label: string; value: string | number; icon: React.ReactNode; color: string; bgColor: string }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100/80 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bgColor}`} style={{ color }}>
                    {icon}
                </div>
            </div>
            <p className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">{value}</p>
        </div>
    );
}

/* ── Schedule Event Item ── */
function ScheduleItem({ time, title, color }: { time: string; title: string; color: string }) {
    return (
        <div className="flex items-center gap-3 py-2.5 group cursor-pointer">
            <span className="text-[12px] font-medium text-slate-400 w-12 flex-shrink-0">{time}</span>
            <div className={`w-1 h-8 rounded-full flex-shrink-0`} style={{ backgroundColor: color }} />
            <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors truncate">{title}</span>
        </div>
    );
}

function DashboardContent({ metrics, exams, users }: { metrics: Metrics; exams: Exam[]; users: any[] }) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = React.useState("Tất cả");

    const colors = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#3b82f6"];
    const scheduleEvents = exams.slice(0, 5).map((exam, i) => {
        let timeLabel = `${10 + (i * 2)}:00`; // Fallback time format
        if (exam.start_time) {
            try {
                const date = new Date(exam.start_time);
                timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } catch (e) { }
        }
        return {
            time: timeLabel,
            title: exam.title,
            color: colors[i % colors.length]
        };
    });

    return (
        <div className="flex flex-1 min-h-0">
            {/* ─── Main Content ─── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-auto">
                <TopNav activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="px-8 pb-8 space-y-6">
                    {/* ── Metric Cards Row ── */}
                    <div className="grid grid-cols-4 gap-4">
                        <MetricCard
                            label={t("admin.dashboard.totalExams")}
                            value={metrics.total_submissions}
                            color="#3b82f6"
                            bgColor="bg-blue-50"
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>}
                        />
                        <MetricCard
                            label={t("admin.dashboard.avgScore")}
                            value={`${metrics.average_score}/10`}
                            color="#22c55e"
                            bgColor="bg-green-50"
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
                        />
                        <MetricCard
                            label={t("admin.dashboard.accuracy")}
                            value={`${metrics.accuracy_rate}%`}
                            color="#8b5cf6"
                            bgColor="bg-purple-50"
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                        />
                        <MetricCard
                            label={t("admin.dashboard.cheatingAlerts")}
                            value={metrics.high_violations.length}
                            color="#ef4444"
                            bgColor="bg-red-50"
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>}
                        />
                    </div>

                    {/* ── Hero Course Cards ── */}
                    <div className="grid grid-cols-3 gap-5">
                        {/* Primary Hero Card */}
                        <div className="col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] p-8 text-white min-h-[260px] flex flex-col justify-between shadow-lg shadow-green-200/40 group cursor-pointer hover:shadow-xl hover:shadow-green-200/50 transition-all duration-300">
                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-[11px] font-semibold mb-3 backdrop-blur-sm">Nổi bật</span>
                                <h3 className="text-2xl font-bold leading-tight mb-2 max-w-[60%]">
                                    {exams.length > 0 ? exams[0].title : "Nền tảng thi trực tuyến"}
                                </h3>
                                <p className="text-white/70 text-sm mb-5 max-w-[55%]">{t("admin.dashboard.subtitle")}</p>
                                <Link href={exams.length > 0 ? `/admin/exams/${exams[0].id}/edit` : "/admin/exams"} className="inline-flex items-center gap-2 bg-white text-green-700 px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                                    Tới bài thi
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                                </Link>
                            </div>
                            {/* 3D Illustration */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/3d-shapes.png" alt="" className="absolute right-0 bottom-0 w-[45%] h-auto object-contain opacity-90 group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none" />
                        </div>

                        {/* Secondary Cards Stack */}
                        <div className="flex flex-col gap-5">
                            {/* Card A */}
                            <div className="flex-1 rounded-3xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] p-6 text-white overflow-hidden relative group cursor-pointer shadow-lg shadow-purple-200/30 hover:shadow-xl hover:shadow-purple-200/40 transition-all duration-300">
                                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-[10px] font-semibold mb-2 backdrop-blur-sm">Mới</span>
                                <h4 className="text-[15px] font-bold leading-snug">
                                    {exams.length > 1 ? exams[1].title : "Giới thiệu chung"}
                                </h4>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                                <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-white/10 blur-lg" />
                            </div>

                            {/* Card B - with mini chart */}
                            <div className="flex-1 rounded-3xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] p-6 text-white overflow-hidden relative group cursor-pointer shadow-lg shadow-amber-200/30 hover:shadow-xl hover:shadow-amber-200/40 transition-all duration-300">
                                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-[10px] font-semibold mb-2 backdrop-blur-sm">Phổ biến</span>
                                <h4 className="text-[15px] font-bold leading-snug">
                                    {exams.length > 2 ? exams[2].title : "Kiểm tra thực hành"}
                                </h4>
                                {/* Mini Chart */}
                                <svg className="absolute bottom-3 right-4 opacity-30" width="80" height="40" viewBox="0 0 80 40">
                                    <polyline fill="none" stroke="white" strokeWidth="2" points="0,35 15,28 25,30 35,15 50,20 60,8 75,12" />
                                    <circle cx="60" cy="8" r="3" fill="white" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* ── Homework / Exams Table ── */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100/80 overflow-hidden">
                        <div className="px-7 py-5 flex justify-between items-center">
                            <h2 className="text-[15px] font-bold text-slate-800">{t("admin.dashboard.recentExams")}</h2>
                            <Link href="/admin/exams" className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                Xem tất cả →
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            {exams.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-t border-slate-50">
                                            <th className="px-7 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quản trị viên</th>
                                            <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("admin.dashboard.examTitle")}</th>
                                            <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("admin.dashboard.status")}</th>
                                            <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("admin.dashboard.duration")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exams.slice(0, 5).map((exam, idx) => (
                                            <tr key={exam.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="px-7 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-amber-500", "bg-pink-500"][idx % 5]}`}>
                                                            {String.fromCharCode(65 + idx)}
                                                        </div>
                                                        <span className="text-[13px] font-medium text-slate-600">Admin</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Link href={`/admin/exams/${exam.id}/edit`} className="text-[13px] font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                                                        {exam.title}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${exam.is_published
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-blue-50 text-blue-600"
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${exam.is_published ? "bg-green-500" : "bg-blue-500"}`} />
                                                        {exam.is_published ? t("admin.dashboard.published") : t("admin.dashboard.draft")}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-[13px] text-slate-500">
                                                    {exam.duration} {t("admin.dashboard.minutes")}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-16 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">Chưa có bài thi nào</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Violations Board ── */}
                    {metrics.high_violations.length > 0 && (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100/80 overflow-hidden">
                            <div className="px-7 py-5 flex justify-between items-center">
                                <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                                    {t("admin.dashboard.violations")}
                                </h2>
                                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-red-50 text-red-500">LIVE</span>
                            </div>
                            <ul>
                                {metrics.high_violations.map((v: any, idx: number) => (
                                    <li key={idx} className="px-7 py-4 flex items-center justify-between border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xs font-bold">
                                                {v.username?.charAt(0)?.toUpperCase() || "?"}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-semibold text-slate-800">{v.username}</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">
                                                    {v.forced_submit ? `${t("admin.dashboard.autoSubmit")} (${v.violation_count} ${t("admin.dashboard.violations.count")})` : `${t("admin.dashboard.tabSwitch")} ${v.violation_count} ${t("admin.dashboard.times")}`}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${v.forced_submit ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${v.forced_submit ? "bg-red-500" : "bg-amber-500"}`} />
                                            {v.score !== null ? `${v.score}/10` : "N/A"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Right Sidebar ─── */}
            <div className="w-[320px] bg-white border-l border-slate-100 flex-shrink-0 overflow-y-auto p-6 space-y-6 hidden xl:block">
                {/* User List Widget */}
                <div className="bg-slate-50 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-slate-800">Thành viên mới</p>
                                <p className="text-[11px] text-slate-400">Tham gia nền tảng</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {Array.isArray(users) && users.length > 0 ? users.slice(0, 5).map((user, i) => (
                            <div key={user?.id || i} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                                    {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-slate-800">{user?.username || "Unknown"}</p>
                                    <p className="text-[11px] text-slate-500">{user?.role === "admin" ? "Quản trị viên" : "Thí sinh"}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-[12px] text-slate-400 py-3">Chưa có người dùng</p>
                        )}
                        <Link href="/admin/students" className="block text-center text-[12px] font-semibold text-blue-600 hover:text-blue-700 transition-colors mt-2">
                            Xem tất cả →
                        </Link>
                    </div>
                </div>

                {/* Today's Schedule */}
                <div>
                    <h3 className="text-[13px] font-bold text-slate-800 mb-4">Lịch trình hôm nay</h3>
                    <div className="space-y-0.5">
                        {scheduleEvents.length > 0 ? scheduleEvents.map((evt, i) => (
                            <ScheduleItem key={i} time={evt.time} title={evt.title} color={evt.color} />
                        )) : (
                            <div className="text-[12px] text-slate-400 py-3 text-center border border-dashed rounded-xl border-slate-200">
                                Không có bài thi nào hôm nay
                            </div>
                        )}
                    </div>
                </div>

                {/* Promo Card */}
                <div className="rounded-3xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] p-6 text-white overflow-hidden relative">
                    <h4 className="text-[15px] font-bold mb-1 relative z-10">Quản trị tối ưu</h4>
                    <p className="text-white/70 text-[12px] mb-4 relative z-10">Kiểm soát toàn diện nền tảng</p>
                    <Link href="/admin/settings" className="inline-block bg-white text-green-700 px-5 py-2 rounded-xl text-[12px] font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative z-10 hover:bg-green-50">
                        Hệ thống
                    </Link>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/3d-rocket.png" alt="" className="absolute -bottom-2 -right-2 w-28 h-28 object-contain opacity-80 pointer-events-none select-none" />
                </div>
            </div>
        </div>
    );
}

import React from "react";

export default function AdminDashboardClient({ metrics, exams, users = [] }: { metrics: Metrics; exams: Exam[]; users?: any[] }) {
    return (
        <LanguageProvider>
            <DashboardContent metrics={metrics} exams={exams} users={users} />
        </LanguageProvider>
    );
}
