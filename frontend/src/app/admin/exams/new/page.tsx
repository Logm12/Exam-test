"use client";
import { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import ImportQuestionsModal from "@/components/exam/ImportQuestionsModal";

type OptionMap = { [key: string]: string };

interface QuestionForm {
    content: string;
    type: "multiple_choice" | "short_answer";
    options: OptionMap;
    correct_answer: string;
}

function sanitizeOptions(options: OptionMap): OptionMap {
    return Object.fromEntries(
        Object.entries(options)
            .map(([k, v]) => [k, (v ?? "").trim()])
            .filter(([, v]) => v.length > 0)
    );
}

function sanitizeAndValidateQuestions(questions: QuestionForm[]): QuestionForm[] {
    return questions.map((q, index) => {
        if (q.type === "multiple_choice") {
            const cleanedOptions = sanitizeOptions(q.options || {});
            const optionKeys = Object.keys(cleanedOptions);
            if (optionKeys.length < 2) {
                throw new Error(`Câu ${index + 1}: Trắc nghiệm phải có ít nhất 2 đáp án (A/B).`);
            }

            const nextCorrect = cleanedOptions[q.correct_answer]
                ? q.correct_answer
                : (optionKeys[0] ?? "A");

            return {
                ...q,
                options: cleanedOptions,
                correct_answer: nextCorrect,
            };
        }

        const expected = (q.correct_answer ?? "").trim();
        if (!expected) {
            throw new Error(`Câu ${index + 1}: Vui lòng nhập đáp án tự luận.`);
        }

        return {
            ...q,
            options: {},
            correct_answer: expected,
        };
    });
}

export default function CreateExam() {
    const { t } = useLanguage();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [examTitle, setExamTitle] = useState("");
    const [examDuration, setExamDuration] = useState(60);
    const [questions, setQuestions] = useState<QuestionForm[]>([]);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

    // Landing Config State
    const [endTime, setEndTime] = useState("");
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);
    const [organizerName, setOrganizerName] = useState("");
    const [organizerLogoFile, setOrganizerLogoFile] = useState<File | null>(null);
    const [organizerLogoPreview, setOrganizerLogoPreview] = useState<string | null>(null);
    const [organizerDesc, setOrganizerDesc] = useState("");
    const [rulesContent, setRulesContent] = useState("");
    const [guideContent, setGuideContent] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setCoverImageFile(file);
        if (file) {
            setCoverImagePreview(URL.createObjectURL(file));
        } else {
            setCoverImagePreview(null);
        }
    };

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

        let sanitizedQuestions: QuestionForm[];
        try {
            sanitizedQuestions = sanitizeAndValidateQuestions(questions);
        } catch (error: any) {
            alert(error?.message || "Dữ liệu câu hỏi không hợp lệ");
            setIsSubmitting(false);
            return;
        }

        try {
            // Upload landing images first
            let posterUrl = "";
            let logoUrl = "";

            if (posterFile) {
                const formData = new FormData();
                formData.append("file", posterFile);
                const res = await (fetcher as any)("/exams/upload-image-generic", { method: "POST", body: formData });
                posterUrl = res.url;
            }
            if (organizerLogoFile) {
                const formData = new FormData();
                formData.append("file", organizerLogoFile);
                const res = await (fetcher as any)("/exams/upload-image-generic", { method: "POST", body: formData });
                logoUrl = res.url;
            }

            const landing_config = {
                poster_image: posterUrl,
                organizer_name: organizerName,
                organizer_logo: logoUrl,
                organizer_description: organizerDesc,
                rules: rulesContent,
                guide: guideContent
            };

            // Create Exam First
            const examPayload = {
                title: examTitle,
                duration: examDuration,
                start_time: new Date().toISOString(),
                end_time: endTime ? new Date(endTime).toISOString() : null,
                is_published: true,
                landing_config: landing_config
            };

            const newExam = await (fetcher as any)("/exams/", {
                method: "POST",
                body: JSON.stringify(examPayload)
            });

            // Upload cover image if selected
            if (coverImageFile) {
                const formData = new FormData();
                formData.append("file", coverImageFile);
                await (fetcher as any)(`/exams/${newExam.id}/upload-image`, {
                    method: "POST",
                    body: formData,
                });
            }

            for (const q of sanitizedQuestions) {
                await (fetcher as any)("/questions/", {
                    method: "POST",
                    body: JSON.stringify({
                        ...q,
                        exam_id: newExam.id,
                    }),
                });
            }

            startTransition(() => {
                router.push("/admin/exams");
            });

        } catch (error: any) {
            console.error(error);
            alert(error.message || t("admin.exams.new.failed"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto pb-20 animate-fade-in space-y-8 text-[var(--text-primary)] w-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                        {t("admin.exams.new.title")}
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-2">
                        {t("admin.exams.new.subtitle")}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsImportModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-accent)] text-[var(--accent-primary)] hover:bg-[var(--accent-glow)] transition-all text-sm font-medium shadow-sm hover:shadow-md"
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
                                placeholder="VD: Thi giữa kì 2026"
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

                    {/* Cover Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">Ảnh bìa (tuỳ chọn)</label>
                        <div className="flex items-start gap-4">
                            <label className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed border-[var(--border-default)] rounded-xl cursor-pointer hover:border-[var(--accent-primary)] hover:bg-[var(--accent-glow)] transition-all">
                                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImageChange} />
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-muted)] mb-2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                <span className="text-xs text-[var(--text-muted)]">Chọn ảnh JPG, PNG, WebP (tối đa 5MB)</span>
                            </label>
                            {coverImagePreview && (
                                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[var(--border-default)] flex-shrink-0">
                                    <img src={coverImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => { setCoverImageFile(null); setCoverImagePreview(null); }}
                                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-red-500 transition-colors">✕</button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Landing Page Configuration */}
                <section className="surface-card p-8 rounded-2xl border border-[var(--border-subtle)] shadow-sm space-y-6">
                    <h2 className="text-lg font-medium text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4">
                        Cấu hình Landing Page Cuộc thi
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Thời gian kết thúc</label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-shadow bg-[var(--bg-primary)] text-[var(--text-primary)]"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Đơn vị tổ chức</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-shadow bg-[var(--bg-primary)] text-[var(--text-primary)]"
                                placeholder="Tên đơn vị tổ chức"
                                value={organizerName}
                                onChange={(e) => setOrganizerName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">Mô tả đơn vị tổ chức</label>
                        <textarea
                            rows={2}
                            className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-shadow bg-[var(--bg-primary)] text-[var(--text-primary)]"
                            placeholder="Mô tả..."
                            value={organizerDesc}
                            onChange={(e) => setOrganizerDesc(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Ảnh Poster</label>
                            <div className="flex items-start gap-4">
                                <label className="flex-1 flex flex-col items-center justify-center h-24 border-2 border-dashed border-[var(--border-default)] rounded-xl cursor-pointer hover:border-[var(--accent-primary)] hover:bg-[var(--accent-glow)] transition-all">
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setPosterFile(file);
                                        if (file) setPosterPreview(URL.createObjectURL(file));
                                    }} />
                                    <span className="text-xs text-[var(--text-muted)]">Tải lên Poster</span>
                                </label>
                                {posterPreview && (
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[var(--border-default)] flex-shrink-0">
                                        <img src={posterPreview} alt="Poster" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => { setPosterFile(null); setPosterPreview(null); }} className="absolute py-0.5 px-2 right-0.5 top-0.5 rounded-full bg-black/60 text-white text-xs">✕</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Logo Đơn vị</label>
                            <div className="flex items-start gap-4">
                                <label className="flex-1 flex flex-col items-center justify-center h-24 border-2 border-dashed border-[var(--border-default)] rounded-xl cursor-pointer hover:border-[var(--accent-primary)] hover:bg-[var(--accent-glow)] transition-all">
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setOrganizerLogoFile(file);
                                        if (file) setOrganizerLogoPreview(URL.createObjectURL(file));
                                    }} />
                                    <span className="text-xs text-[var(--text-muted)]">Tải lên Logo</span>
                                </label>
                                {organizerLogoPreview && (
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[var(--border-default)] flex-shrink-0 bg-white">
                                        <img src={organizerLogoPreview} alt="Logo" className="w-full h-full object-contain" />
                                        <button type="button" onClick={() => { setOrganizerLogoFile(null); setOrganizerLogoPreview(null); }} className="absolute py-0.5 px-2 right-0.5 top-0.5 rounded-full bg-black/60 text-white text-xs">✕</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">Thể lệ (Markdown/HTML)</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-shadow bg-[var(--bg-primary)] text-[var(--text-primary)]"
                            value={rulesContent}
                            onChange={(e) => setRulesContent(e.target.value)}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">Hướng dẫn thi (Markdown/HTML)</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-shadow bg-[var(--bg-primary)] text-[var(--text-primary)]"
                            value={guideContent}
                            onChange={(e) => setGuideContent(e.target.value)}
                        />
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
                                    title="Xoá câu hỏi"
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
                                                        required={optKey === "A" || optKey === "B"}
                                                        placeholder={`${t("admin.exams.new.option")} ${optKey}`}
                                                        value={q.options?.[optKey] ?? ""}
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

                        {questions.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-[var(--border-subtle)] rounded-2xl">
                                <p className="text-sm text-[var(--text-secondary)] mb-2">{t("admin.exams.new.noQuestions")}</p>
                                <button type="button" onClick={addQuestion} className="text-[var(--accent-primary)] text-sm font-medium hover:underline">
                                    {t("admin.exams.new.addFirst")}
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Submit Bar */}
                <div className="fixed bottom-0 left-64 right-0 p-4 bg-[var(--surface-overlay)] backdrop-blur-md border-t border-[var(--border-subtle)] flex justify-end px-8 z-20">
                    <button
                        type="submit"
                        disabled={isSubmitting || questions.length === 0 || !examTitle}
                        title={questions.length === 0 ? "Vui lòng thêm ít nhất 1 câu hỏi" : (!examTitle ? "Vui lòng nhập tiêu đề" : "")}
                        className="accent-btn px-8 py-2.5 rounded-lg text-sm font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? t("admin.exams.new.publishing") : t("admin.exams.new.publish")}
                    </button>
                </div>
            </form>

            <ImportQuestionsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
            />
        </div>
    );
}
