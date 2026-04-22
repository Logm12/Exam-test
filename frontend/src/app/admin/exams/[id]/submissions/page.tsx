"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetcher } from "@/lib/api";
import { downloadFromApi } from "@/lib/download";

interface Submission {
    id: number;
    user_id: number;
    username: string;
    score: number | null;
    status: string;
    submitted_at: string | null;
    violation_count: number;
    forced_submit: string;
}

export default function ExamSubmissionsPage() {
    const params = useParams();
    const examId = params.id as string;
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSubmissions = async () => {
            try {
                const data = await fetcher(`/exams/${examId}/submissions`);
                setSubmissions(data);
            } catch (err: any) {
                setError(err.message || "Failed to load submissions");
            } finally {
                setIsLoading(false);
            }
        };
        loadSubmissions();
    }, [examId]);

    const handleDelete = async (subId: number) => {
        if (!confirm("Bạn có chắc chắn muốn xoá bài làm của thí sinh này để họ làm lại không?")) {
            return;
        }
        try {
            await fetcher(`/exams/${examId}/submissions/${subId}`, { method: "DELETE" });
            setSubmissions(submissions.filter(s => s.id !== subId));
        } catch (err: any) {
            alert(err.message || "Xoá thất bại");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in pb-20 font-sans w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                        <Link href="/admin/exams" className="hover:text-[var(--accent-primary)] transition-colors">Kỳ thi</Link>
                        <span>/</span>
                        <span>#{examId}</span>
                        <span>/</span>
                        <span className="font-medium text-[var(--text-primary)]">Bài nộp</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                        Danh sách bài nộp
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={async () => {
                            try {
                                const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
                                await downloadFromApi(
                                    `${base}/admin/reports/exams/${examId}/scores?format=csv`,
                                    `exam_${examId}_scores.csv`
                                );
                            } catch (e: any) {
                                alert(e?.message || "Xuất CSV thất bại");
                            }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold shadow-sm transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        Xuất điểm CSV
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
                                await downloadFromApi(
                                    `${base}/admin/reports/exams/${examId}/scores?format=xlsx`,
                                    `exam_${examId}_scores.xlsx`
                                );
                            } catch (e: any) {
                                alert(e?.message || "Xuất Excel thất bại");
                            }
                        }}
                        className="bg-white hover:bg-gray-50 text-emerald-700 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold shadow-sm border border-emerald-200 transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        Xuất điểm Excel
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
                                await downloadFromApi(
                                    `${base}/admin/reports/submissions?format=csv&exam_id=${encodeURIComponent(examId)}`,
                                    `submission_history_exam_${examId}.csv`
                                );
                            } catch (e: any) {
                                alert(e?.message || "Xuất CSV thất bại");
                            }
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold shadow-sm transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        Xuất lịch sử CSV
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
                                await downloadFromApi(
                                    `${base}/admin/reports/submissions?format=xlsx&exam_id=${encodeURIComponent(examId)}`,
                                    `submission_history_exam_${examId}.xlsx`
                                );
                            } catch (e: any) {
                                alert(e?.message || "Xuất Excel thất bại");
                            }
                        }}
                        className="bg-white hover:bg-gray-50 text-slate-900 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold shadow-sm border border-gray-200 transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        Xuất lịch sử Excel
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-md text-sm bg-red-50 text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-[var(--accent-primary)] rounded-full animate-spin" />
                </div>
            ) : submissions.length === 0 ? (
                <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-lg shadow-[var(--shadow-sm)] dark:bg-[#1f1f1f] dark:border-gray-700">
                    <p className="text-[var(--text-secondary)] text-sm font-medium">Chưa có thí sinh nào nộp bài.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-[var(--shadow-sm)] border border-[var(--border-default)] overflow-hidden dark:bg-[#1f1f1f]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border-default)] bg-gray-50/50 dark:bg-gray-800/50">
                                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Thí sinh</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Điểm số</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Vi phạm</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Thời gian nộp</th>
                                    <th className="px-6 py-4 text-right text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-default)]">
                                {submissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-[var(--text-primary)] text-sm">{sub.username}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-[var(--accent-primary)] text-sm bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-400">
                                                {sub.score !== null ? `${sub.score.toFixed(1)}/10` : "Chưa chấm"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold border ${sub.status === 'submitted'
                                                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800/30'
                                                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30'
                                                }`}>
                                                {sub.status === 'submitted' ? 'Đã nộp' : 'Đang làm thi'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {sub.forced_submit === 'true' ? (
                                                <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded">Bắt buộc nộp (Vi phạm {sub.violation_count} lần)</span>
                                            ) : sub.violation_count > 0 ? (
                                                <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded">Vi phạm {sub.violation_count} lần</span>
                                            ) : (
                                                <span className="text-xs text-[var(--text-secondary)]">Không</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                            {sub.submitted_at ? new Date(sub.submitted_at).toLocaleString('vi-VN') : "—"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(sub.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-transparent hover:border-red-200"
                                            >
                                                Xoá bài
                                            </button>
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
