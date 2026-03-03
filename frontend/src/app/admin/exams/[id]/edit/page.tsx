"use client";
import { useState, useEffect, startTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetcher } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import ImportQuestionsModal from "@/components/exam/ImportQuestionsModal";

type OptionMap = { [key: string]: string };

interface QuestionForm {
    id?: number;
    content: string;
    type: "multiple_choice" | "short_answer";
    options: OptionMap;
    correct_answer: string;
}

export default function EditExam() {
    const { t } = useLanguage();
    const router = useRouter();
    const params = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [examTitle, setExamTitle] = useState("");
    const [examDuration, setExamDuration] = useState(60);
    const [questions, setQuestions] = useState<QuestionForm[]>([]);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    useEffect(() => {
        const loadExamData = async () => {
            try {
                const exam = await fetcher(`/exams/${params.id}`);
                setExamTitle(exam.title);
                setExamDuration(exam.duration);

                const qData = await fetcher(`/questions/exam/${params.id}`);
                setQuestions(qData || []);
            } catch (err) {
                console.error(err);
                alert("Failed to load exam data");
            } finally {
                setIsLoading(false);
            }
        };
        if (params.id) loadExamData();
    }, [params.id]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                content: "",
                type: "multiple_choice",
                options: { A: "", B: "", C: "", D: "" },
                correct_answer: "A",
            },
        ]);
    };

    const handleImport = (imported: any[]) => {
        const newQs: QuestionForm[] = imported.map(q => ({
            content: q.content,
            type: q.type as "multiple_choice" | "short_answer",
            options: q.options,
            correct_answer: q.correct_answer || "A"
        }));
        setQuestions([...questions, ...newQs]);
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index: number, key: keyof QuestionForm, value: any) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [key]: value };
        setQuestions(updated);
    };

    const updateOption = (qIndex: number, optKey: string, value: string) => {
        const updated = [...questions];
        const newOptions = { ...updated[qIndex].options, [optKey]: value };
        updated[qIndex] = { ...updated[qIndex], options: newOptions };
        setQuestions(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Update Exam
            await fetcher(`/exams/${params.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    title: examTitle,
                    duration: examDuration,
                    is_published: true
                })
            });

            // For simplicity, we delete all old questions and re-insert 
            // Better: diff and update/create/delete
            // But per current backend, questions belong to exam_id

            // Delete existing
            try {
                const oldQs = await fetcher(`/questions/exam/${params.id}`);
                await Promise.all(oldQs.map((q: any) => fetcher(`/questions/${q.id}`, { method: "DELETE" })));
            } catch (e) { }

            // Add new
            const qPromises = questions.map((q) =>
                fetcher("/questions/", {
                    method: "POST",
                    body: JSON.stringify({
                        ...q,
                        exam_id: parseInt(params.id as string)
                    })
                })
            );

            await Promise.all(qPromises);

            startTransition(() => {
                router.push("/admin/exams");
            });

        } catch (error) {
            console.error(error);
            alert("Failed to update exam");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-[var(--text-muted)] animate-pulse">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in space-y-8 text-[var(--text-primary)]">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                        {t("admin.exams.edit")}
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-2">
                        {t("admin.exams.new.subtitle")}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsImportModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-accent)] text-[var(--accent-primary)] hover:bg-[var(--accent-glow)] transition-all text-sm font-medium"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    {t("import.title")}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <section className="surface-card p-8 rounded-2xl border border-[var(--border-subtle)] shadow-sm space-y-6">
                    <h2 className="text-lg font-medium text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4">
                        {t("admin.exams.new.details")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">{t("admin.exams.new.examTitle")}</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-shadow bg-[var(--bg-primary)] text-[var(--text-primary)]"
                                value={examTitle}
                                onChange={(e) => setExamTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">{t("admin.exams.new.duration")}</label>
                            <input
                                type="number"
                                required
                                min={1}
                                className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-shadow bg-[var(--bg-primary)] text-[var(--text-primary)]"
                                value={examDuration === 0 ? "" : examDuration}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setExamDuration(val === "" ? 0 : parseInt(val));
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* Questions Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-[var(--text-primary)]">{t("admin.exams.new.questionsBank")} ({questions.length})</h2>
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="accent-btn px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            {t("admin.exams.new.addQuestion")}
                        </button>
                    </div>

                    <div className="space-y-6">
                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="surface-card p-6 rounded-2xl border border-[var(--border-subtle)] shadow-sm relative group">
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(qIndex)}
                                    className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--status-danger)] p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ✕
                                </button>

                                <div className="space-y-4 pr-8">
                                    <div className="flex items-center space-x-4">
                                        <span className="w-8 h-8 rounded-full bg-[var(--accent-glow)] text-[var(--accent-primary)] flex items-center justify-center font-bold text-sm">
                                            {qIndex + 1}
                                        </span>
                                        <select
                                            value={q.type}
                                            onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
                                            className="text-sm border-[var(--border-default)] rounded-lg focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
                                        >
                                            <option value="multiple_choice">{t("admin.exams.new.multipleChoice")}</option>
                                            <option value="short_answer">{t("admin.exams.new.shortAnswer")}</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <textarea
                                            required
                                            placeholder={t("admin.exams.new.questionContent")}
                                            rows={2}
                                            className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-shadow resize-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
                                            value={q.content}
                                            onChange={(e) => updateQuestion(qIndex, "content", e.target.value)}
                                        />
                                    </div>

                                    {q.type === "multiple_choice" ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                            {["A", "B", "C", "D"].map((optKey) => (
                                                <div key={optKey} className="flex items-center space-x-3 bg-[var(--bg-tertiary)] px-3 py-2 rounded-lg border border-[var(--border-default)]">
                                                    <input
                                                        type="radio"
                                                        name={`correct_ans_${qIndex}`}
                                                        value={optKey}
                                                        checked={q.correct_answer === optKey}
                                                        onChange={(e) => updateQuestion(qIndex, "correct_answer", e.target.value)}
                                                        className="text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                                                    />
                                                    <span className="text-sm font-medium text-[var(--text-muted)]">{optKey}</span>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder={`${t("admin.exams.new.option")} ${optKey}`}
                                                        value={q.options[optKey]}
                                                        onChange={(e) => updateOption(qIndex, optKey, e.target.value)}
                                                        className="bg-transparent text-sm w-full outline-none placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="pt-2">
                                            <input
                                                type="text"
                                                required
                                                placeholder={t("admin.exams.new.expectedAnswer")}
                                                className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] flex-1 text-sm outline-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
                                                value={q.correct_answer}
                                                onChange={(e) => updateQuestion(qIndex, "correct_answer", e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="fixed bottom-0 left-64 right-0 p-4 bg-[var(--surface-overlay)] backdrop-blur-md border-t border-[var(--border-subtle)] flex justify-end px-8 z-20">
                    <button
                        type="submit"
                        disabled={isSubmitting || questions.length === 0}
                        className="accent-btn px-8 py-2.5 rounded-lg text-sm font-medium shadow-lg transition-all"
                    >
                        {isSubmitting ? t("app.processing") : t("admin.exams.edit")}
                    </button>
                </div>
            </form>

            <ImportQuestionsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
                examId={parseInt(params.id as string)}
            />
        </div>
    );
}
