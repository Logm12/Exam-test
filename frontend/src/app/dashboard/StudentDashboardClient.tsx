"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { signOut } from "next-auth/react";

/* ────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────── */
type ExamStatus = "in_progress" | "not_started" | "completed" | "submitted";

type Exam = {
    id: number;
    title: string;
    description?: string;
    duration: number;
    start_time: string;
    end_time?: string;
    is_published: boolean;
    total_questions?: number;
    answered_questions?: number;
    score?: number;
    total_score?: number;
    status?: ExamStatus;
    cover_image?: string;
};

/* ────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────── */
function deriveStatus(exam: Exam): ExamStatus {
    if (exam.status) return exam.status;
    const now = new Date();
    const start = new Date(exam.start_time);
    const end = exam.end_time
        ? new Date(exam.end_time)
        : new Date(start.getTime() + exam.duration * 60000);
    if (now < start) return "not_started";
    if (now > end) return "completed";
    return "in_progress";
}

function formatDateRange(start: string, end?: string): string {
    const s = new Date(start);
    const fmt = (d: Date) =>
        d.toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" });
    if (!end) return fmt(s);
    return `${fmt(s)} - ${fmt(new Date(end))}`;
}

const STATUS_LABEL: Record<ExamStatus, string> = {
    in_progress: "Đang diễn ra",
    not_started: "Chưa bắt đầu",
    completed: "Hoàn thành",
    submitted: "Đã nộp bài",
};

const STATUS_COLORS: Record<ExamStatus, { bg: string; text: string; dot: string }> = {
    in_progress: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    not_started: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
    completed: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-500" },
    submitted: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
};

/* ────────────────────────────────────────────────
   Sidebar Icon Components (inline SVG)
   ──────────────────────────────────────────────── */
function IconExam({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    );
}

function IconUser({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function IconHelp({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}

function IconLogout({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

function IconMenu({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    );
}

function IconSearch({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function IconGrid({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
        </svg>
    );
}

function IconList({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
    );
}

function IconFilter({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    );
}

function IconClock({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

function IconLock({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

function IconCheck({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function IconChevronLeft({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );
}

function IconChevronRight({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

/* ────────────────────────────────────────────────
   Circular Progress Component
   ──────────────────────────────────────────────── */
function CircularProgress({ current, total, size = 44 }: { current: number; total: number; size?: number }) {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const pct = total > 0 ? current / total : 0;
    const strokeDashoffset = circumference * (1 - pct);

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#1e3a8a"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-700 ease-out"
                />
            </svg>
            <span className="absolute text-xs font-bold text-slate-700">
                {current}/{total}
            </span>
        </div>
    );
}

/* ────────────────────────────────────────────────
   Status Indicator Badge on Card Image
   ──────────────────────────────────────────────── */
function StatusIndicator({ status }: { status: ExamStatus }) {
    if (status === "in_progress") {
        return (
            <span className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-md text-white">
                <IconClock size={14} />
            </span>
        );
    }
    if (status === "submitted" || status === "completed") {
        return (
            <span className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-md text-white">
                <IconCheck size={14} />
            </span>
        );
    }
    return (
        <span className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center shadow-md text-white">
            <IconLock size={14} />
        </span>
    );
}

/* ────────────────────────────────────────────────
   Exam Card Component
   ──────────────────────────────────────────────── */
function ExamCard({ exam }: { exam: Exam }) {
    const status = deriveStatus(exam);
    const totalQ = exam.total_questions || 0;
    const answeredQ = exam.answered_questions || 0;
    const sc = STATUS_COLORS[status];

    const endTime = exam.end_time
        ? exam.end_time
        : new Date(new Date(exam.start_time).getTime() + exam.duration * 60000).toISOString();

    return (
        <Link
            href={`/exam/${exam.id}/take`}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
        >
            {/* Cover image area */}
            <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                {exam.cover_image ? (
                    <Image
                        src={exam.cover_image}
                        alt={exam.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#3b5fc0] flex items-center justify-center shadow-lg">
                            <IconExam size={28} />
                        </div>
                    </div>
                )}
                <StatusIndicator status={status} />
            </div>

            {/* Card body */}
            <div className="p-4 flex flex-col flex-1">
                {/* Title row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-[#1e3a8a] transition-colors">
                        {exam.title}
                    </h3>
                </div>

                {/* Status badge */}
                <div className="mb-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {STATUS_LABEL[status]}
                    </span>
                </div>

                {/* Progress bar for in_progress */}
                {status === "in_progress" && totalQ > 0 && (
                    <div className="mb-3">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-700"
                                style={{ width: `${(answeredQ / totalQ) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Meta info */}
                <div className="mt-auto space-y-1.5">
                    <p className="text-xs text-slate-500">
                        <span className="font-medium text-slate-600">Ngày thi: </span>
                        {formatDateRange(exam.start_time, endTime)}
                    </p>
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                            {exam.duration} phút
                            {totalQ > 0 && <> &bull; {totalQ} câu</>}
                        </p>
                        {status === "in_progress" && (
                            <CircularProgress
                                current={answeredQ}
                                total={totalQ}
                            />
                        )}
                    </div>
                    {status === "submitted" && (
                        <div className="mt-2 flex items-center justify-between bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg">
                            <span className="text-xs font-semibold text-emerald-700">Điểm số của bạn:</span>
                            <span className="text-sm font-bold text-emerald-600">{exam.score != null ? `${Number(exam.score).toFixed(1)}/10` : 'Chưa chấm'}</span>
                        </div>
                    )}
                    {status === "completed" && (
                        <p className="text-xs text-slate-600 font-medium mt-1">Đã kết thúc</p>
                    )}
                </div>
            </div>
        </Link>
    );
}

/* ────────────────────────────────────────────────
   Main Dashboard Component
   ──────────────────────────────────────────────── */
export default function StudentDashboardClient({
    exams,
    userName,
}: {
    exams: Exam[];
    userName: string;
}) {
    const { t } = useLanguage();

    // Sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState<"exams" | "account" | "help">("exams");

    // Filter state
    const [statusFilter, setStatusFilter] = useState<ExamStatus | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Derived exam list
    const filteredExams = useMemo(() => {
        let result = exams.map((e) => ({ ...e, status: deriveStatus(e) as ExamStatus }));

        if (statusFilter !== "all") {
            result = result.filter((e) => e.status === statusFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((e) => e.title.toLowerCase().includes(q));
        }

        return result;
    }, [exams, statusFilter, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredExams.length / itemsPerPage));
    const paginatedExams = filteredExams.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const filterTabs: { key: ExamStatus | "all"; label: string }[] = [
        { key: "all", label: "Tất cả" },
        { key: "in_progress", label: "Đang diễn ra" },
        { key: "not_started", label: "Chưa bắt đầu" },
        { key: "completed", label: "Hoàn thành" },
    ];

    const sidebarItems = [
        { key: "exams" as const, icon: <IconExam />, label: "Kỳ thi", href: "/dashboard" },
        { key: "account" as const, icon: <IconUser />, label: "Tài khoản", href: "/dashboard" },
        { key: "help" as const, icon: <IconHelp />, label: "Trợ giúp", href: "/dashboard/help" },
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {/* ──────── Sidebar ──────── */}
            <aside
                className={`${sidebarOpen ? "w-56" : "w-16"} flex-shrink-0 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out z-40`}
            >
                {/* Logo area */}
                <div className="h-16 flex items-center justify-between px-3 border-b border-slate-100">
                    {sidebarOpen && (
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#1e3a8a] flex items-center justify-center text-white flex-shrink-0">
                                <span className="font-bold text-xs">FDB</span>
                            </div>
                            <span className="font-bold text-slate-800 text-sm truncate">FDB TALENT</span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors flex-shrink-0"
                        aria-label="Thu gọn sidebar"
                    >
                        <IconMenu size={18} />
                    </button>
                </div>

                {/* User info (expanded) */}
                {sidebarOpen && (
                    <div className="px-4 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold flex-shrink-0">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
                                <p className="text-xs text-slate-500">Sinh viên</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 py-3 px-2 space-y-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.key}
                            href={item.href}
                            onClick={() => setActiveMenu(item.key)}
                            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${activeMenu === item.key
                                ? "bg-blue-50 text-[#1e3a8a]"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                                }`}
                            title={item.label}
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            {sidebarOpen && <span className="truncate">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <div className="px-2 pb-4 mt-auto">
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Đăng xuất"
                    >
                        <span className="flex-shrink-0"><IconLogout /></span>
                        {sidebarOpen && <span className="truncate">Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* ──────── Main content ──────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
                    {/* Search */}
                    <div className="relative w-full max-w-md">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <IconSearch />
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            placeholder="Tìm kiếm bài thi..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] bg-slate-50 text-slate-700 placeholder:text-slate-400 transition-all"
                        />
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        {/* View mode toggles */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-slate-100 text-[#1e3a8a]" : "text-slate-400 hover:text-slate-600"}`}
                                aria-label="Hiển thị dạng lưới"
                            >
                                <IconGrid />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 transition-colors ${viewMode === "list" ? "bg-slate-100 text-[#1e3a8a]" : "text-slate-400 hover:text-slate-600"}`}
                                aria-label="Hiển thị dạng danh sách"
                            >
                                <IconList />
                            </button>
                        </div>

                        {/* Filter button (decorative for now) */}
                        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                            <IconFilter />
                            <span className="hidden sm:inline">Lọc</span>
                        </button>
                    </div>
                </header>

                {/* Content area */}
                <main className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Filter tabs */}
                    <div className="flex items-center gap-2 mb-6 flex-wrap">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => { setStatusFilter(tab.key); setCurrentPage(1); }}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${statusFilter === tab.key
                                    ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Exam grid / list */}
                    {paginatedExams.length > 0 ? (
                        <div
                            className={
                                viewMode === "grid"
                                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                                    : "flex flex-col gap-3"
                            }
                        >
                            {paginatedExams.map((exam) => (
                                <ExamCard key={exam.id} exam={exam} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <IconExam size={28} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-1">Không có bài thi nào</h3>
                            <p className="text-sm text-slate-500 max-w-xs">
                                {searchQuery
                                    ? "Không tìm thấy bài thi phù hợp với từ khóa tìm kiếm."
                                    : "Hiện tại không có bài thi nào khả dụng. Vui lòng quay lại sau."}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredExams.length > 0 && (
                        <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>Số lượng mỗi trang</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                    className="border border-slate-200 rounded-md px-2 py-1 text-sm bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]/20"
                                >
                                    {[6, 10, 20, 50].map((n) => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-1 text-sm">
                                <span className="text-slate-500 mr-3">
                                    {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredExams.length)} / {filteredExams.length}
                                </span>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage <= 1}
                                    className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <IconChevronLeft />
                                </button>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage >= totalPages}
                                    className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <IconChevronRight />
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
