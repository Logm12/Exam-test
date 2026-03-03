"use client";
import { useState, useEffect } from "react";
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
            setExams(exams.filter((e) => e.id !== id));
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
            setExams(exams.map((e) => (e.id === exam.id ? { ...e, is_published: !e.is_published } : e)));
        } catch (err: any) {
            alert(err.message || t("admin.exams.failedUpdate"));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                        {t("admin.exams.title")}
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        {t("admin.exams.subtitle")}
                    </p>
                </div>
                <Link
                    href="/admin/exams/new"
                    className="accent-btn px-5 py-2.5 flex items-center gap-2"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    {t("admin.exams.createNew")}
                </Link>
            </div>

            {error && (
                <div className="p-4 rounded-xl text-sm mb-6" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-[var(--border-default)] border-t-[var(--accent-primary)] rounded-full animate-spin" />
                </div>
            ) : exams.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-[var(--border-default)] rounded-2xl">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--surface-hover)' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm mb-3">{t("admin.exams.noExams")}</p>
                    <Link href="/admin/exams/new" className="text-[var(--accent-primary)] text-sm font-medium hover:underline">
                        {t("admin.exams.createFirst")}
                    </Link>
                </div>
            ) : (
                <div className="surface-card overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-hover)]">
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t("admin.exams.table.title")}</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t("admin.exams.table.duration")}</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t("admin.exams.table.status")}</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t("admin.exams.table.startTime")}</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">{t("admin.exams.table.actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)]">
                            {exams.map((exam) => (
                                <tr key={exam.id} className="hover:bg-[var(--surface-hover)] transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-[var(--text-primary)] text-sm">{exam.title}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-mono">{exam.duration} {t("student.duration").toLowerCase()}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => togglePublish(exam)}
                                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer border`}
                                            style={{
                                                background: exam.is_published ? 'rgba(5, 150, 105, 0.1)' : 'var(--surface-hover)',
                                                color: exam.is_published ? 'var(--status-success)' : 'var(--text-secondary)',
                                                borderColor: exam.is_published ? 'rgba(5, 150, 105, 0.2)' : 'var(--border-default)'
                                            }}
                                        >
                                            {exam.is_published ? t("admin.exams.published") : t("admin.exams.draft")}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-mono">
                                        {exam.start_time ? new Date(exam.start_time).toLocaleDateString("en-US", {
                                            year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                                        }) : "—"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/exams/${exam.id}/edit`}
                                                className="text-xs font-medium text-[var(--accent-primary)] hover:text-white px-3 py-1.5 rounded-lg hover:bg-[var(--accent-primary)] transition-colors border border-[var(--border-accent)]"
                                            >
                                                {t("admin.exams.edit")}
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(exam.id)}
                                                disabled={deletingId === exam.id}
                                                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 border"
                                                style={{ color: 'var(--status-danger)', borderColor: 'rgba(220, 38, 38, 0.3)' }}
                                                onMouseOver={(e) => { e.currentTarget.style.background = 'var(--status-danger)'; e.currentTarget.style.color = 'white'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--status-danger)'; }}
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
            )}
        </div>
    );
}
