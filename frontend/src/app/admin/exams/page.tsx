"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetcher } from "@/lib/api";

interface Exam {
    id: number;
    title: string;
    duration: number;
    is_published: boolean;
    start_time: string;
    theme_config?: any;
}

export default function ExamsCollectionPage() {
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
            setError(err.message || "Failed to load exams");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadExams();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this exam?")) return;
        setDeletingId(id);
        try {
            await fetcher(`/exams/${id}`, { method: "DELETE" });
            setExams(exams.filter((e) => e.id !== id));
        } catch (err: any) {
            alert(err.message || "Failed to delete exam");
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
            alert(err.message || "Failed to update exam");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                        Exams Collection
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        Manage all examinations in the system.
                    </p>
                </div>
                <Link
                    href="/admin/exams/new"
                    className="bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                    + Create New Exam
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-neutral-300 border-t-indigo-600 rounded-full animate-spin" />
                </div>
            ) : exams.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-neutral-200 rounded-2xl">
                    <p className="text-neutral-500 text-sm mb-3">No exams yet</p>
                    <Link href="/admin/exams/new" className="text-indigo-600 text-sm font-medium hover:underline">
                        Create the first exam
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                <th className="px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Start Time</th>
                                <th className="px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {exams.map((exam) => (
                                <tr key={exam.id} className="hover:bg-neutral-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-neutral-900 text-sm">{exam.title}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-600">{exam.duration} min</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => togglePublish(exam)}
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${exam.is_published
                                                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                                                }`}
                                        >
                                            {exam.is_published ? "Published" : "Draft"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-500">
                                        {exam.start_time ? new Date(exam.start_time).toLocaleDateString("en-US", {
                                            year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                                        }) : "—"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/exams/${exam.id}/edit`}
                                                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(exam.id)}
                                                disabled={deletingId === exam.id}
                                                className="text-xs font-medium text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === exam.id ? "..." : "Delete"}
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
