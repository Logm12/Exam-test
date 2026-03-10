"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

interface Exam {
    id: number;
    title: string;
    duration: number;
    is_published: boolean;
    start_time: string;
    theme_config?: any;
}

export default function ExamsCollectionPage() {
    const { t } = useLanguage();
    const [exams, setExams] = useState<Exam[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadExams = async () => {
        try {
            setIsLoading(true);
            const data = await fetcher("/exams/");
            setExams(data);
        } catch (err: any) {
            setError(err.message || t("admin.exams.failedLoad"));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadExams();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm(t("admin.exams.confirmDelete"))) return;
        setDeletingId(id);
        try {
            await fetcher(`/exams/${id}`, { method: "DELETE" });
            setExams(exams.filter((e: Exam) => e.id !== id));
        } catch (err: any) {
            alert(err.message || t("admin.exams.failedDelete"));
        } finally {
            setDeletingId(null);
        }
    };

    const togglePublish = async (exam: Exam) => {
        try {
            await fetcher(`/exams/${exam.id}`, {
                method: "PUT",
                body: JSON.stringify({ ...exam, is_published: !exam.is_published }),
            });
            setExams(exams.map((e: Exam) => (e.id === exam.id ? { ...e, is_published: !e.is_published } : e)));
        } catch (err: any) {
            alert(err.message || t("admin.exams.failedUpdate"));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20 font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                        {t("admin.exams.title")}
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        {t("admin.exams.subtitle")}
                    </p>
                </div>
                <Link
                    href="/admin/exams/new"
                    className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white px-5 py-2.5 rounded-md flex items-center gap-2 text-sm font-semibold shadow-sm transition-colors"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    {t("admin.exams.createNew")}
                </Link>
            </div>

            {error && (
                <div className="p-4 rounded-md text-sm mb-6 bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-[var(--accent-primary)] rounded-full animate-spin dark:border-gray-700" />
                </div>
            ) : exams.length === 0 ? (
                <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-lg shadow-[var(--shadow-sm)] dark:bg-[#1f1f1f] dark:border-gray-700">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-50 dark:bg-gray-800">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm mb-3 font-medium">{t("admin.exams.noExams")}</p>
                    <Link href="/admin/exams/new" className="text-[var(--accent-primary)] text-sm font-semibold hover:underline">
                        {t("admin.exams.createFirst")}
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-[var(--shadow-sm)] border border-[var(--border-default)] overflow-hidden dark:bg-[#1f1f1f]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border-default)] bg-gray-50/50 dark:bg-gray-800/50">
                                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t("admin.exams.table.title")}</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t("admin.exams.table.duration")}</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t("admin.exams.table.status")}</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t("admin.exams.table.startTime")}</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">{t("admin.exams.table.actions")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-default)]">
                                {exams.map((exam) => (
                                    <tr key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-[var(--text-primary)] text-sm">{exam.title}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                            <div className="flex items-center gap-1.5">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                {exam.duration} {t("student.duration").toLowerCase()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => togglePublish(exam)}
                                                className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer border ${exam.is_published
                                                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400 dark:hover:bg-green-900/40'
                                                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {exam.is_published ? t("admin.exams.published") : t("admin.exams.draft")}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                            <div className="flex items-center gap-1.5">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                                {exam.start_time ? new Date(exam.start_time).toLocaleDateString("en-US", {
                                                    year: "numeric", month: "short", day: "numeric"
                                                }) + " " + new Date(exam.start_time).toLocaleTimeString("en-US", {
                                                    hour: "2-digit", minute: "2-digit"
                                                }) : "—"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/exams/${exam.id}/submissions`}
                                                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-md hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-100 dark:hover:bg-emerald-900/30 dark:hover:border-emerald-800/50"
                                                >
                                                    Xem bài nộp
                                                </Link>
                                                <Link
                                                    href={`/admin/exams/${exam.id}/edit`}
                                                    className="text-xs font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 dark:hover:bg-blue-900/30 dark:hover:border-blue-800/50"
                                                >
                                                    {t("admin.exams.edit")}
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(exam.id)}
                                                    disabled={deletingId === exam.id}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:border-red-800/50"
                                                >
                                                    {deletingId === exam.id ? "..." : t("admin.exams.delete")}
                                                </button>
                                            </div>
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
