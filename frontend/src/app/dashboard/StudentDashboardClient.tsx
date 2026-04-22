"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { fetcher } from "@/lib/api";
import FdbLogo from "@/components/FdbLogo";

/* ═══════ TYPES ═══════ */
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
    status?: ExamStatus;
    cover_image?: string;
};

/* ═══════ HELPERS ═══════ */
function deriveStatus(exam: Exam): ExamStatus {
    if (exam.status) return exam.status;
    const now = new Date();
    const start = new Date(exam.start_time);
    // Only mark "completed" if there is an explicit end_time that has passed.
    // Without end_time, once start is passed the exam is always accessible ("in_progress").
    if (now < start) return "not_started";
    if (exam.end_time && now > new Date(exam.end_time)) return "completed";
    return "in_progress";
}

const STATUS_LABEL: Record<ExamStatus, string> = {
    in_progress: "Đang thi",
    not_started: "Sắp tới",
    completed: "Đã xong",
    submitted: "Đã nộp",
};

/* Card color themes — Learnify style */
const CARD_THEMES = [
    { bg: "#EEF2FF", badge: "#2563EB", badgeText: "#fff" },   // Blue
    { bg: "#FEF9C3", badge: "#D97706", badgeText: "#fff" },   // Yellow
    { bg: "#F0FDF4", badge: "#16A34A", badgeText: "#fff" },   // Green
    { bg: "#111827", badge: "#FF5722", badgeText: "#fff" },   // Dark
    { bg: "#FFF7ED", badge: "#EA580C", badgeText: "#fff" },   // Orange-light
    { bg: "#EFF6FF", badge: "#1D4ED8", badgeText: "#fff" },   // Blue-2
];

/* ═══════ ICONS ═══════ */
function IconBook() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>;
}
function IconUser() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function IconHelp() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
}
function IconLogout() {
    return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
}
function IconMenu() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;
}
function IconSearch() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
}
function IconBell() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
}
function IconClock() {
    return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
function IconArrow() {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
}
function IconStar({ size = 20, color = "#FBBF24" }: { size?: number; color?: string }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2l2.939 6.472 6.783.592-5.01 4.673 1.524 6.694L12 17.27l-6.236 3.161 1.524-6.694L2.278 9.064l6.783-.592z" /></svg>;
}

/* ═══════ EXAM CARD — Learnify style ═══════ */
function ExamCard({ exam, themeIdx }: { exam: Exam; themeIdx: number }) {
    const status = deriveStatus(exam);
    const theme = CARD_THEMES[themeIdx % CARD_THEMES.length];
    const isDark = theme.bg === "#111827";
    const titleColor = isDark ? "#fff" : "#111827";
    const metaColor = isDark ? "rgba(255,255,255,0.55)" : "#6B7280";
    const totalQ = exam.total_questions || 0;
    const answered = exam.answered_questions || 0;
    const isLocked = status === "completed" || status === "submitted";

    const coverSrc = exam.cover_image || null;

    const inner = (
        <div
            className="rounded-[20px] overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-250 group h-full border border-black/5"
            style={{ background: theme.bg }}
        >
            {/* Image / Illustration area */}
            <div className="relative overflow-hidden" style={{ height: coverSrc ? 160 : 140 }}>
                {coverSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={coverSrc}
                        alt={exam.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    /* Decorative illustration fallback */
                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden"
                        style={{ background: theme.bg }}>
                        {/* Big decorative SVG shapes per theme */}
                        {themeIdx % 6 === 0 && (
                            <svg width="140" height="130" viewBox="0 0 140 130" fill="none" className="opacity-25">
                                <rect x="20" y="15" width="50" height="50" rx="10" fill="#2563EB" transform="rotate(10 45 40)" />
                                <circle cx="105" cy="80" r="35" fill="#2563EB" opacity="0.5" />
                                <rect x="5" y="80" width="30" height="30" rx="6" fill="#2563EB" opacity="0.3" transform="rotate(-15 20 95)" />
                            </svg>
                        )}
                        {themeIdx % 6 === 1 && (
                            <svg width="140" height="130" viewBox="0 0 140 130" fill="none" className="opacity-30">
                                <circle cx="70" cy="65" r="45" fill="#F59E0B" />
                                <circle cx="100" cy="35" r="22" fill="#D97706" />
                                <rect x="10" y="80" width="35" height="35" rx="8" fill="#FBBF24" transform="rotate(20 27 97)" />
                            </svg>
                        )}
                        {themeIdx % 6 === 2 && (
                            <svg width="140" height="130" viewBox="0 0 140 130" fill="none" className="opacity-25">
                                <polygon points="70,10 130,100 10,100" fill="#16A34A" />
                                <circle cx="110" cy="40" r="20" fill="#22C55E" />
                                <rect x="5" y="50" width="40" height="40" rx="8" fill="#4ADE80" opacity="0.6" />
                            </svg>
                        )}
                        {themeIdx % 6 === 3 && (
                            <svg width="140" height="130" viewBox="0 0 140 130" fill="none" className="opacity-20">
                                <circle cx="70" cy="65" r="50" stroke="white" strokeWidth="3" />
                                <rect x="35" y="30" width="50" height="50" rx="8" stroke="white" strokeWidth="2" transform="rotate(15 60 55)" />
                                <circle cx="100" cy="95" r="22" fill="white" opacity="0.1" />
                            </svg>
                        )}
                        {themeIdx % 6 === 4 && (
                            <svg width="140" height="130" viewBox="0 0 140 130" fill="none" className="opacity-25">
                                <ellipse cx="70" cy="65" rx="55" ry="40" fill="#EA580C" />
                                <ellipse cx="70" cy="65" rx="35" ry="22" fill="#FF5722" opacity="0.5" />
                            </svg>
                        )}
                        {themeIdx % 6 === 5 && (
                            <svg width="140" height="130" viewBox="0 0 140 130" fill="none" className="opacity-25">
                                <rect x="20" y="20" width="45" height="45" rx="22" fill="#1D4ED8" />
                                <rect x="75" y="65" width="50" height="50" rx="10" fill="#2563EB" />
                                <circle cx="105" cy="30" r="18" fill="#3B82F6" />
                            </svg>
                        )}

                        {/* Status icon */}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isDark ? "rgba(255,255,255,0.3)" : "#9CA3AF"} strokeWidth="1.5" className="absolute bottom-3 right-3">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                    </div>
                )}

                {/* Category badge — top-left overlay */}
                <div className="absolute top-3 left-3">
                    <span
                        className="inline-block text-[11px] font-black px-3 py-1 rounded-full shadow-sm"
                        style={{ background: theme.badge, color: theme.badgeText }}
                    >
                        {STATUS_LABEL[status]}
                    </span>
                </div>

                {/* High score star */}
                {status === "submitted" && exam.score != null && Number(exam.score) >= 8 && (
                    <div className="absolute top-3 right-3">
                        <IconStar size={20} color="#FBBF24" />
                    </div>
                )}
            </div>

            {/* Card body */}
            <div className="p-5 flex flex-col gap-3 flex-1">
                {/* Title */}
                <h3
                    className="text-[15px] font-black leading-snug line-clamp-2 transition-opacity group-hover:opacity-80"
                    style={{ color: titleColor }}
                >
                    {exam.title}
                </h3>

                {/* Meta info */}
                <div className="flex flex-col gap-1.5" style={{ color: metaColor }}>
                    <span className="text-[12px] flex items-center gap-1.5">
                        <IconClock />
                        {new Date(exam.start_time).toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <span className="text-[12px] flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        {exam.duration} phút {totalQ > 0 && `· ${totalQ} câu`}
                    </span>

                    {/* Progress */}
                    {status === "in_progress" && totalQ > 0 && (
                        <div className="mt-1">
                            <div className="flex justify-between text-[10px] mb-1" style={{ color: metaColor }}>
                                <span>Tiến độ</span>
                                <span>{Math.round((answered / totalQ) * 100)}%</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.15)" : "#E5E7EB" }}>
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{ width: `${Math.round((answered / totalQ) * 100)}%`, background: theme.badge }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Score */}
                    {status === "submitted" && exam.score != null && (
                        <div className="inline-flex items-center gap-1.5 mt-1">
                            <span className="text-[11px] font-semibold" style={{ color: metaColor }}>Điểm:</span>
                            <span className="text-[15px] font-black" style={{ color: isDark ? "#fff" : "#111827" }}>
                                {Number(exam.score).toFixed(1)}/10
                            </span>
                        </div>
                    )}
                </div>

                {/* CTA — Learnify orange button */}
                <div className="mt-auto pt-1">
                    {!isLocked ? (
                        <div
                            className="w-full py-2.5 rounded-xl text-[13px] font-black text-center text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:shadow-md active:scale-95"
                            style={{ background: "#FF5722" }}
                        >
                            Vào thi ngay <IconArrow />
                        </div>
                    ) : (
                        <div
                            className="w-full py-2.5 rounded-xl text-[13px] font-bold text-center border-2 cursor-not-allowed"
                            style={{ color: isDark ? "rgba(255,255,255,0.4)" : "#9CA3AF", borderColor: isDark ? "rgba(255,255,255,0.1)" : "#E5E7EB" }}
                        >
                            Đã kết thúc
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (isLocked) return <div className="opacity-70 h-full">{inner}</div>;
    return <Link href={`/exam/${exam.id}/landing`} className="h-full block">{inner}</Link>;
}

/* ═══════ ACCOUNT PAGE ═══════ */
function AccountPage({ userName, exams }: { userName: string; exams: Exam[] }) {
    const total = exams.length;
    const done = exams.filter(e => ["submitted", "completed"].includes(deriveStatus(e))).length;
    const inProg = exams.filter(e => deriveStatus(e) === "in_progress").length;
    const upcoming = exams.filter(e => deriveStatus(e) === "not_started").length;
    const scores = exams.filter(e => e.score != null).map(e => Number(e.score));
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
    const maxScore = scores.length > 0 ? Math.max(...scores).toFixed(1) : null;

    const statItems = [
        { label: "Tổng kỳ thi", value: total, bg: "#EEF2FF", color: "#2563EB" },
        { label: "Đang diễn ra", value: inProg, bg: "#FFF7ED", color: "#FF5722" },
        { label: "Đã hoàn thành", value: done, bg: "#F0FDF4", color: "#16A34A" },
        { label: "Sắp tới", value: upcoming, bg: "#FEF9C3", color: "#D97706" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-[28px] font-black text-gray-900 leading-tight">
                    Thông tin<br />
                    <span style={{ color: "#FF5722" }}>tài khoản</span>
                </h1>
                <p className="text-[13px] text-gray-500 mt-1 font-medium">Xem hồ sơ và thống kê học tập của bạn.</p>
            </div>

            {/* Profile card */}
            <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm flex items-center gap-7">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-[28px] font-black flex-shrink-0 shadow-md" style={{ background: "#2563EB" }}>
                    {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="text-[22px] font-black text-gray-900">{userName}</p>
                    <span className="inline-block mt-1 px-3 py-1 rounded-full text-[11px] font-black bg-[#EEF2FF] text-[#2563EB] border border-[#BFDBFE]">Sinh viên</span>
                    {avgScore && (
                        <p className="text-[13px] text-gray-400 mt-2 font-medium">
                            Điểm trung bình: <span className="font-black text-gray-900">{avgScore}/10</span>
                            {maxScore && <> &bull; Cao nhất: <span className="font-black text-gray-900">{maxScore}/10</span></>}
                        </p>
                    )}
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
                {statItems.map((s, i) => (
                    <div key={i} className="rounded-[20px] p-6 border border-black/5" style={{ background: s.bg }}>
                        <p className="text-[12px] font-bold mb-1" style={{ color: s.color }}>{s.label}</p>
                        <p className="text-[36px] font-black text-gray-900 leading-none">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Exam history table */}
            {done > 0 && (
                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50">
                        <h2 className="text-[15px] font-black text-gray-900">Lịch sử làm bài</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên kỳ thi</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Điểm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.filter(e => ["submitted", "completed"].includes(deriveStatus(e))).map((exam, i) => (
                                    <tr key={exam.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-[13px] font-bold text-gray-900 truncate max-w-[220px]">{exam.title}</p>
                                            <p className="text-[11px] text-gray-400 mt-0.5">{new Date(exam.start_time).toLocaleDateString("vi-VN", { day: "2-digit", month: "short" })}</p>
                                        </td>
                                        <td className="px-4 py-4 text-[12px] font-semibold text-gray-500">{exam.duration} phút</td>
                                        <td className="px-4 py-4">
                                            {exam.score != null ? (
                                                <span className="text-[14px] font-black" style={{ color: Number(exam.score) >= 8 ? "#16A34A" : Number(exam.score) >= 5 ? "#D97706" : "#DC2626" }}>
                                                    {Number(exam.score).toFixed(1)}/10
                                                </span>
                                            ) : (
                                                <span className="text-[12px] text-gray-400">Chưa chấm</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ═══════ HELP PAGE ═══════ */
function HelpPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: "Làm thế nào để bắt đầu một kỳ thi?",
            a: "Vào trang Kỳ thi, chọn kỳ thi có trạng thái \"Sắp tới\" hoặc \"Đang diễn ra\", nhấn nút \"Vào thi ngay\". Đảm bảo bạn có đủ thời gian trước khi bắt đầu."
        },
        {
            q: "Thời gian làm bài được tính như thế nào?",
            a: "Thời gian đếm ngược bắt đầu từ khi bạn vào trang làm bài. Khi hết giờ, hệ thống sẽ tự động nộp bài của bạn."
        },
        {
            q: "Tôi có thể nộp lại bài thi không?",
            a: "Không. Sau khi đã nộp bài (hoặc hết giờ), bạn không thể làm lại kỳ thi đó. Hãy chắc chắn trước khi nộp."
        },
        {
            q: "Điểm số được công bố khi nào?",
            a: "Điểm số được công bố ngay sau khi bài được chấm. Với các câu hỏi trắc nghiệm, kết quả thường hiển thị ngay. Bài tự luận có thể cần thêm thời gian để giáo viên chấm."
        },
        {
            q: "Tôi bị mất kết nối internet trong lúc thi thì sao?",
            a: "Hệ thống lưu tiến trình làm bài định kỳ. Khi kết nối lại, bạn có thể tiếp tục làm bài từ câu vừa làm, miễn là kỳ thi vẫn còn trong thời gian cho phép."
        },
        {
            q: "Tôi không thấy kỳ thi trong danh sách?",
            a: "Kỳ thi có thể chưa được công bố hoặc chưa đến thời gian bắt đầu. Hãy tải lại trang hoặc liên hệ giáo viên nếu bạn nghĩ có lỗi."
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-[28px] font-black text-gray-900 leading-tight">
                    Trung tâm<br />
                    <span style={{ color: "#FF5722" }}>trợ giúp</span>
                </h1>
                <p className="text-[13px] text-gray-500 mt-1 font-medium">Tìm câu trả lời nhanh cho các thắc mắc thường gặp.</p>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { icon: "📖", title: "Hướng dẫn thi", desc: "Quy trình làm bài từng bước", color: "#EEF2FF" },
                    { icon: "✉️", title: "Liên hệ hỗ trợ", desc: "Gửi email cho chúng tôi", color: "#FFF7ED" },
                    { icon: "🎥", title: "Video hướng dẫn", desc: "Xem clip nhanh", color: "#F0FDF4" },
                ].map((item, i) => (
                    <div key={i} className="rounded-[20px] p-5 border border-black/5 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all" style={{ background: item.color }}>
                        <div className="text-[28px] mb-2">{item.icon}</div>
                        <p className="text-[14px] font-black text-gray-900">{item.title}</p>
                        <p className="text-[12px] text-gray-500 font-medium mt-0.5">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50">
                    <h2 className="text-[15px] font-black text-gray-900">Câu hỏi thường gặp</h2>
                </div>
                <div className="divide-y divide-gray-50">
                    {faqs.map((faq, i) => (
                        <div key={i}>
                            <button
                                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            >
                                <span className="text-[14px] font-bold text-gray-900 pr-4">{faq.q}</span>
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[14px] font-black transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}
                                    style={{ background: openFaq === i ? "#FF5722" : "#2563EB" }}>
                                    +
                                </span>
                            </button>
                            {openFaq === i && (
                                <div className="px-6 pb-5">
                                    <p className="text-[13px] text-gray-500 font-medium leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact card */}
            <div className="rounded-[20px] p-6 text-white overflow-hidden relative" style={{ background: "#2563EB" }}>
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
                <div className="text-[32px] mb-2">💬</div>
                <h3 className="text-[16px] font-black mb-1">Vẫn cần hỗ trợ?</h3>
                <p className="text-white/70 text-[13px] mb-4 font-medium">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn.</p>
                <a href="mailto:support@fdbtalent.edu.vn"
                    className="inline-block bg-white px-5 py-2.5 rounded-xl text-[13px] font-black hover:shadow-md hover:-translate-y-0.5 transition-all"
                    style={{ color: "#2563EB" }}>
                    Gửi email ngay →
                </a>
            </div>
        </div>
    );
}


function StatCard({
    value, label, badge, bg, textColor = "#111827"
}: { value: string; label: string; badge: string; bg: string; textColor?: string }) {
    return (
        <div
            className="rounded-[20px] p-5 border border-black/5 flex flex-col gap-2"
            style={{ background: bg }}
        >
            <span
                className="inline-block text-[11px] font-black px-3 py-1 rounded-full w-fit"
                style={{ background: textColor === "#fff" ? "rgba(255,255,255,0.2)" : "#111827", color: "#fff" }}
            >
                {badge}
            </span>
            <p className="text-[13px] font-semibold mt-1" style={{ color: textColor === "#fff" ? "rgba(255,255,255,0.7)" : "#6B7280" }}>{label}</p>
            <p className="text-[32px] font-black leading-none" style={{ color: textColor }}>{value}</p>
        </div>
    );
}

/* ═══════ TIMELINE ITEM ═══════ */
function TimelineItem({ date, title, sub, color }: { date: string; title: string; sub: string; color: string }) {
    return (
        <div className="flex gap-3 group cursor-pointer">
            <div className="flex flex-col items-center pt-1">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <div className="w-px flex-1 mt-1" style={{ background: "#E5E7EB" }} />
            </div>
            <div className="pb-4 min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{date}</p>
                <p className="text-[13px] font-bold text-gray-900 leading-tight group-hover:text-[#2563EB] transition-colors truncate">{title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
            </div>
        </div>
    );
}

/* ═══════ MAIN ═══════ */
export default function StudentDashboardClient({
    exams: initialExams,
    userName,
}: {
    exams: Exam[];
    userName: string;
}) {
    const [exams, setExams] = useState<Exam[]>(initialExams);
    useEffect(() => {
        fetcher("/exams/me").then((d: Exam[]) => setExams(d)).catch(() => { });
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState("exams");
    const [activeTab, setActiveTab] = useState("Tất cả");
    const [searchQuery, setSearchQuery] = useState("");

    const tabs = ["Tất cả", "Hiện tại", "Sắp tới", "Đã xong"];
    const tabMap: Record<string, string> = {
        "Tất cả": "all", "Hiện tại": "in_progress", "Sắp tới": "not_started", "Đã xong": "completed",
    };

    const filteredExams = useMemo(() => {
        let r = exams.map((e) => ({ ...e, _s: deriveStatus(e) }));
        const ts = tabMap[activeTab];
        if (ts !== "all") r = r.filter((e) => e._s === ts || (ts === "completed" && e._s === "submitted"));
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            r = r.filter((e) => e.title.toLowerCase().includes(q));
        }
        return r;
    }, [exams, activeTab, searchQuery]);

    /* Stats */
    const submitted = exams.filter(e => ["submitted", "completed"].includes(deriveStatus(e))).length;
    const inProgress = exams.filter(e => deriveStatus(e) === "in_progress").length;
    const totalQ = exams.reduce((a, e) => a + (e.total_questions || 0), 0);

    /* Right sidebar */
    const upcomingExams = exams.filter(e => deriveStatus(e) === "not_started").slice(0, 5);
    const colors = ["#2563EB", "#FF5722", "#FBBF24", "#16A34A", "#0EA5E9"];
    const today = new Date().getDate();

    const navItems = [
        { key: "exams", label: "Kỳ thi", icon: <IconBook /> },
        { key: "account", label: "Tài khoản", icon: <IconUser /> },
        { key: "help", label: "Trợ giúp", icon: <IconHelp /> },
    ];

    return (
        <div className="flex h-screen font-sans overflow-hidden bg-[#F5F5F5]">

            {/* ═══ SIDEBAR ═══ */}
            <aside className={`${sidebarOpen ? "w-[240px]" : "w-[60px]"} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 z-40 shadow-sm`}>
                <div className="relative h-[68px] flex items-center px-4 border-b border-gray-50 overflow-hidden">
                    {sidebarOpen && (
                        <div className="absolute left-1/2 -translate-x-1/2">
                            <FdbLogo className="text-[1.25rem]" />
                        </div>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors flex-shrink-0 ml-auto">
                        <IconMenu />
                    </button>
                </div>

                {sidebarOpen && (
                    <div className="px-4 py-4 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0" style={{ background: "#2563EB" }}>
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[13px] font-bold text-gray-900 truncate">{userName}</p>
                                <p className="text-[11px] text-gray-400">Sinh viên</p>
                            </div>
                        </div>
                    </div>
                )}

                <nav className="flex-1 py-3 px-3 space-y-0.5">
                    {navItems.map((item) => (
                        <button key={item.key} onClick={() => setActiveMenu(item.key)}
                            className={`w-full flex items-center ${sidebarOpen ? 'justify-start px-3' : 'justify-center'} gap-3 rounded-xl py-2.5 text-[13px] font-bold transition-all duration-150 ${activeMenu === item.key ? "bg-[#2563EB] text-white shadow-md" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}>
                            <span className={activeMenu === item.key ? "text-white" : "text-gray-400"}>{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="px-3 pb-4">
                    <button onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
                        className={`w-full flex items-center ${sidebarOpen ? 'justify-start px-3' : 'justify-center'} gap-3 rounded-xl py-2.5 text-[13px] font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors`}>
                        <IconLogout />
                        {sidebarOpen && <span>Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* ═══ CENTER + RIGHT ═══ */}
            <div className="flex flex-1 min-h-0 overflow-hidden">

                {/* ═══ CENTER ═══ */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                    {/* Top Nav — Learnify style */}
                    <header className="h-[68px] bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0 shadow-sm">
                        {/* Filter pill tabs or Page Title */}
                        <div className="flex items-center gap-2">
                            {activeMenu === "exams" && tabs.map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-full text-[13px] font-black transition-all duration-200 border-2 ${activeTab === tab
                                        ? "bg-gray-900 text-white border-gray-900"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                                        }`}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Right controls */}
                        <div className="flex items-center gap-3">
                            {activeMenu === "exams" && (
                                <div className="relative hidden md:block">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IconSearch /></span>
                                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Tìm kiếm kỳ thi..."
                                        className="w-48 pl-9 pr-4 py-2 rounded-xl border-2 border-gray-200 bg-gray-50 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all font-medium" />
                                </div>
                            )}
                            <button className="w-10 h-10 rounded-xl border-2 border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-gray-400 relative transition-all">
                                <IconBell />
                                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#FF5722] rounded-full border-2 border-white" />
                            </button>

                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[13px] font-black shadow-sm" style={{ background: "#2563EB" }}>
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </header>

                    {/* Main Content — switch by activeMenu */}
                    <main className="flex-1 overflow-y-auto px-8 py-7">
                        {activeMenu === "account" ? (
                            <AccountPage userName={userName} exams={exams} />
                        ) : activeMenu === "help" ? (
                            <HelpPage />
                        ) : (
                            /* ── Exams view ── */
                            <div className="space-y-6">
                                {/* Page hero text */}
                                <div>
                                    <h1 className="text-[28px] font-black text-gray-900 leading-tight">
                                        Tìm đúng{" "}
                                        <span style={{ color: "#FF5722" }}>kỳ thi</span>{" "}
                                        của bạn
                                    </h1>
                                    <p className="text-[13px] text-gray-500 mt-1 font-medium">
                                        Xem các kỳ thi được giao và bắt đầu ôn luyện ngay hôm nay.
                                    </p>
                                </div>

                                {filteredExams.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-24 text-center">
                                        <div className="w-20 h-20 rounded-3xl bg-white border-2 border-gray-100 flex items-center justify-center mb-5 shadow-sm">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                        </div>
                                        <h3 className="text-[18px] font-black text-gray-700 mb-2">Không có kỳ thi nào</h3>
                                        <p className="text-[13px] text-gray-400 max-w-xs font-medium">
                                            {searchQuery ? "Không tìm thấy kết quả phù hợp." : "Hiện chưa có kỳ thi nào. Vui lòng kiểm tra lại sau."}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {filteredExams.map((exam, i) => (
                                            <ExamCard key={exam.id} exam={exam} themeIdx={i} />
                                        ))}
                                    </div>
                                )}

                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-5 pt-2">
                                    <StatCard value={`+${exams.length}`} label="kỳ thi" badge="Tổng cộng" bg="#EEF2FF" />
                                    <StatCard value={`+${totalQ}`} label="câu hỏi" badge="Online" bg="#2563EB" textColor="#fff" />
                                    <StatCard value={`+${submitted}`} label="đã hoàn thành" badge="Nộp bài" bg="#FBBF24" />
                                </div>
                            </div>
                        )}
                    </main>
                </div>

                {/* ═══ RIGHT SIDEBAR ═══ */}
                <div className="w-[280px] bg-white border-l border-gray-100 flex-shrink-0 overflow-y-auto p-5 space-y-5 hidden xl:block shadow-sm">

                    {/* Calendar */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[14px] font-black text-gray-900">Lịch thi</h3>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FEF9C3] text-[#D97706]">★ 5 ngày streak</span>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d, i) => (
                                    <span key={i} className="text-[9px] font-black text-gray-400 text-center uppercase">{d}</span>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: 31 }, (_, i) => {
                                    const day = i + 1;
                                    const isToday = day === today;
                                    const isStreak = day >= today - 4 && day <= today;
                                    return (
                                        <div key={i}
                                            className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-black cursor-pointer transition-all ${isToday ? "text-white shadow-md" : isStreak ? "text-[#2563EB]" : "text-gray-400 hover:bg-gray-100"}`}
                                            style={isToday ? { background: "#FF5722" } : isStreak ? { background: "#EEF2FF" } : {}}>
                                            {day}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Upcoming exams */}
                    <div>
                        <h3 className="text-[14px] font-black text-gray-900 mb-3">Kỳ thi sắp tới</h3>
                        <div>
                            {upcomingExams.length > 0 ? upcomingExams.map((exam, i) => {
                                const dl = (() => { try { return new Date(exam.start_time).toLocaleDateString("vi-VN", { day: "2-digit", month: "short" }); } catch { return "--"; } })();
                                return <TimelineItem key={exam.id} date={dl} title={exam.title} sub={`${exam.duration} phút`} color={colors[i % colors.length]} />;
                            }) : (
                                <p className="text-[12px] text-gray-400 text-center py-4 border-2 border-dashed border-gray-100 rounded-xl font-medium">Không có lịch thi</p>
                            )}
                        </div>
                    </div>

                    {/* Promo card */}
                    <div className="rounded-2xl p-5 text-white overflow-hidden relative" style={{ background: "#2563EB" }}>
                        <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
                        <div className="text-[36px] mb-2 relative z-10">✏️</div>
                        <h4 className="text-[14px] font-black mb-1 relative z-10">Hôm nay học gì?</h4>
                        <p className="text-white/70 text-[11px] mb-4 relative z-10 font-medium leading-relaxed">Ôn luyện đều đặn, bứt phá điểm số trong mỗi kỳ thi!</p>
                        <button
                            className="relative z-10 bg-white px-4 py-2 rounded-xl text-[12px] font-black shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                            style={{ color: "#2563EB" }}
                        >
                            Bắt đầu ngay →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
