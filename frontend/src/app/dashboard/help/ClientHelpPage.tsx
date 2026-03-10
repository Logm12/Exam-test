"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

/* ────────────────────────────────────────────────
   Help Page - Form lien he Ban To Chuc
   va trang dem theo doi phan hoi
   ──────────────────────────────────────────────── */

type TicketStatus = "pending" | "responded";

type SupportTicket = {
    id: string;
    subject: string;
    message: string;
    created_at: string;
    status: TicketStatus;
    response?: string;
};

/* Inline icons */
function IconBack({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
        </svg>
    );
}

function IconSend({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
    );
}

function IconInbox({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
        </svg>
    );
}

const SUBJECT_OPTIONS = [
    "Vấn đề về tài khoản",
    "Lỗi kỳ thi / bài thi",
    "Khiếu nại kết quả",
    "Yêu cầu hỗ trợ kỹ thuật",
    "Ý kiến đóng góp",
    "Khác",
];

export default function ClientHelpPage({ userName }: { userName: string }) {
    const [view, setView] = useState<"form" | "tracking">("form");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Local ticket list (demo - in production this would come from API)
    const [tickets, setTickets] = useState<SupportTicket[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !message.trim()) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const newTicket: SupportTicket = {
            id: `TK-${Date.now().toString(36).toUpperCase()}`,
            subject,
            message: message.trim(),
            created_at: new Date().toISOString(),
            status: "pending",
        };

        setTickets((prev) => [newTicket, ...prev]);
        setSubject("");
        setMessage("");
        setIsSubmitting(false);
        setSubmitSuccess(true);

        // Auto switch to tracking after success
        setTimeout(() => {
            setSubmitSuccess(false);
            setView("tracking");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Top bar */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#1e3a8a] transition-colors"
                    >
                        <IconBack />
                        <span className="font-medium">Quay lại</span>
                    </Link>
                    <span className="text-slate-300">|</span>
                    <h1 className="text-sm font-semibold text-slate-800">Trợ giúp & Liên hệ</h1>
                </div>
                <div className="text-sm text-slate-500">{userName}</div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Tab navigation */}
                <div className="flex items-center gap-2 mb-8">
                    <button
                        onClick={() => setView("form")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === "form"
                            ? "bg-[#1e3a8a] text-white"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                            }`}
                    >
                        Gửi yêu cầu hỗ trợ
                    </button>
                    <button
                        onClick={() => setView("tracking")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${view === "tracking"
                            ? "bg-[#1e3a8a] text-white"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                            }`}
                    >
                        <IconInbox size={16} />
                        Theo dõi phản hồi
                        {tickets.length > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${view === "tracking" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"
                                }`}>
                                {tickets.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Form view */}
                {view === "form" && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-800 mb-1">Liên hệ Ban Tổ Chức</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Điền thông tin bên dưới để gửi yêu cầu đến ban tổ chức. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                        </p>

                        {submitSuccess && (
                            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200 font-medium">
                                Yêu cầu đã được gửi thành công. Đang chuyển sang trang theo dõi...
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Chủ đề
                                </label>
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all"
                                >
                                    <option value="">-- Chọn chủ đề --</option>
                                    {SUBJECT_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Nội dung chi tiết
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    rows={5}
                                    placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#1e3a8a] text-white text-sm font-semibold rounded-lg hover:bg-[#152960] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <IconSend size={16} />
                                {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Tracking view */}
                {view === "tracking" && (
                    <div className="space-y-4">
                        {tickets.length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                    <IconInbox size={24} />
                                </div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-1">Chưa có yêu cầu nào</h3>
                                <p className="text-xs text-slate-500">
                                    Khi bạn gửi yêu cầu hỗ trợ, các phiếu sẽ hiển thị tại đây.
                                </p>
                            </div>
                        ) : (
                            tickets.map((ticket) => (
                                <div key={ticket.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <span className="text-xs font-mono text-slate-400">{ticket.id}</span>
                                            <h3 className="text-sm font-semibold text-slate-800">{ticket.subject}</h3>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${ticket.status === "pending"
                                            ? "bg-amber-50 text-amber-700"
                                            : "bg-emerald-50 text-emerald-700"
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${ticket.status === "pending" ? "bg-amber-500" : "bg-emerald-500"
                                                }`} />
                                            {ticket.status === "pending" ? "Đang chờ phản hồi" : "Đã phản hồi"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-2">{ticket.message}</p>
                                    <p className="text-xs text-slate-400">
                                        Gửi lúc: {new Date(ticket.created_at).toLocaleString("vi-VN")}
                                    </p>
                                    {ticket.response && (
                                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <p className="text-xs font-medium text-blue-800 mb-1">Phản hồi từ Ban Tổ Chức:</p>
                                            <p className="text-sm text-blue-700">{ticket.response}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
