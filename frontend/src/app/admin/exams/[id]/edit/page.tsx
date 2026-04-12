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
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [existingCoverImage, setExistingCoverImage] = useState<string | null>(null);

    // Landing Config State
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);
    const [existingPoster, setExistingPoster] = useState<string | null>(null);
    const [organizers, setOrganizers] = useState<{name: string, logoFile: File | null, logoPreview: string | null, existingLogo: string | null, desc: string}[]>([
        { name: "", logoFile: null, logoPreview: null, existingLogo: null, desc: "" }
    ]);
    const [rulesContent, setRulesContent] = useState("");
    const [guideContent, setGuideContent] = useState("");

    const addOrganizer = () => {
        setOrganizers([...organizers, { name: "", logoFile: null, logoPreview: null, existingLogo: null, desc: "" }]);
    };
    const updateOrganizer = (index: number, field: string, value: any) => {
        setOrganizers(prev => {
            const newOrgs = [...prev];
            newOrgs[index] = { ...newOrgs[index], [field]: value };
            return newOrgs;
        });
    };
    const removeOrganizer = (index: number) => {
        setOrganizers(organizers.filter((_, i) => i !== index));
    };
    const [slogan, setSlogan] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [useCustomFaqs, setUseCustomFaqs] = useState(false);
    const [customFaqs, setCustomFaqs] = useState<{q: string, a: string}[]>([{ q: "", a: "" }]);

    const addFaq = () => {
        setCustomFaqs([...customFaqs, { q: "", a: "" }]);
    };
    
    const updateFaq = (index: number, field: "q" | "a", value: string) => {
        const newFaqs = [...customFaqs];
        newFaqs[index][field] = value;
        setCustomFaqs(newFaqs);
    };

    const removeFaq = (index: number) => {
        setCustomFaqs(customFaqs.filter((_, i) => i !== index));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setCoverImageFile(file);
        if (file) {
            setCoverImagePreview(URL.createObjectURL(file));
        } else {
            setCoverImagePreview(null);
        }
    };

    useEffect(() => {
        const loadExamData = async () => {
            try {
                const exam = await fetcher(`/exams/${params.id}`);
                setExamTitle(exam.title);
                setExamDuration(exam.duration);
                const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://127.0.0.1:8000';
                if (exam.cover_image) setExistingCoverImage(`${backendBase}${exam.cover_image}`);

                if (exam.start_time) {
                    const d = new Date(exam.start_time);
                    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                    setStartTime(d.toISOString().slice(0, 16));
                }

                if (exam.end_time) {
                    const d = new Date(exam.end_time);
                    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                    setEndTime(d.toISOString().slice(0, 16));
                }
                
                if (exam.landing_config) {
                    setRulesContent(exam.landing_config.rules || "");
                    setGuideContent(exam.landing_config.guide || "");
                    setSlogan(exam.landing_config.slogan || "");
                    setContactEmail(exam.landing_config.contact_email || "");
                    setContactPhone(exam.landing_config.contact_phone || "");
                    
                    if (exam.landing_config.faqs && exam.landing_config.faqs.length > 0) {
                        setUseCustomFaqs(true);
                        setCustomFaqs(exam.landing_config.faqs);
                    }
                    
                    if (exam.landing_config.poster_image) {
                        setExistingPoster(exam.landing_config.poster_image.startsWith('http') ? exam.landing_config.poster_image : `${backendBase}${exam.landing_config.poster_image}`);
                    }
                    if (exam.landing_config.organizers && exam.landing_config.organizers.length > 0) {
                        setOrganizers(exam.landing_config.organizers.map((org: any) => ({
                            name: org.name || "",
                            logoFile: null,
                            logoPreview: null,
                            existingLogo: org.logo ? (org.logo.startsWith('http') ? org.logo : `${backendBase}${org.logo}`) : null,
                            desc: org.desc || ""
                        })));
                    } else if (exam.landing_config.organizer_name || exam.landing_config.organizer_logo) {
                        // Backwards compatibility layer
                        setOrganizers([{
                            name: exam.landing_config.organizer_name || "",
                            logoFile: null,
                            logoPreview: null,
                            existingLogo: exam.landing_config.organizer_logo ? (exam.landing_config.organizer_logo.startsWith('http') ? exam.landing_config.organizer_logo : `${backendBase}${exam.landing_config.organizer_logo}`) : null,
                            desc: exam.landing_config.organizer_description || ""
                        }]);
                    }
                }

                const qData = await fetcher(`/questions/exam/${params.id}`);
                setQuestions(qData || []);
            } catch (err) {
                console.error(err);
                alert("Lỗi tải dữ liệu bài thi");
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

        let sanitizedQuestions: QuestionForm[];
        try {
            sanitizedQuestions = sanitizeAndValidateQuestions(questions);
        } catch (error: any) {
            alert(error?.message || "Dữ liệu câu hỏi không hợp lệ");
            setIsSubmitting(false);
            return;
        }

        try {
            // Upload landing images 
            const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://127.0.0.1:8000';
            let posterUrl = existingPoster?.replace(backendBase, "") || "";
            let uploadedOrganizers = [];

            if (posterFile) {
                const formData = new FormData();
                formData.append("file", posterFile);
                const res = await (fetcher as any)("/exams/upload-image-generic", { method: "POST", body: formData });
                posterUrl = res.url;
            }

            uploadedOrganizers = await Promise.all(organizers.map(async org => {
                let logoUrl = org.existingLogo?.replace(backendBase, "") || "";
                if (org.logoFile) {
                    const formData = new FormData();
                    formData.append("file", org.logoFile);
                    const res = await (fetcher as any)("/exams/upload-image-generic", { method: "POST", body: formData });
                    logoUrl = res.url;
                }
                return { name: org.name, logo: logoUrl, desc: org.desc };
            }));

            const landing_config = {
                poster_image: posterUrl,
                organizers: uploadedOrganizers,
                organizer_name: uploadedOrganizers[0]?.name || "", // Giữ tương thích ngược
                organizer_logo: uploadedOrganizers[0]?.logo || "",
                organizer_description: uploadedOrganizers[0]?.desc || "",
                rules: rulesContent,
                guide: guideContent,
                slogan: slogan,
                contact_email: contactEmail,
                contact_phone: contactPhone,
                faqs: useCustomFaqs ? customFaqs.filter(f => f.q.trim() || f.a.trim()) : undefined
            };

            // Update Exam (only send fields that are changing)
            await (fetcher as any)(`/exams/${params.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    title: examTitle,
                    duration: examDuration,
                    start_time: startTime ? new Date(startTime).toISOString() : new Date().toISOString(),
                    end_time: endTime ? new Date(endTime).toISOString() : null,
                    is_published: true,
                    landing_config: landing_config
                })
            });

            // Upload cover image if a new one was selected
            if (coverImageFile) {
                const formData = new FormData();
                formData.append("file", coverImageFile);
                await (fetcher as any)(`/exams/${params.id}/upload-image`, {
                    method: "POST",
                    body: formData,
                });
            }

            // For simplicity, we delete all old questions and re-insert 
            // Better: diff and update/create/delete
            // But per current backend, questions belong to exam_id

            // Delete existing
            try {
                const oldQs = await (fetcher as any)(`/questions/exam/${params.id}`);
                await Promise.all(oldQs.map((q: any) => (fetcher as any)(`/questions/${q.id}`, { method: "DELETE" })));
            } catch (e) { }

            // Add new (sequential to preserve ordering)
            for (const q of sanitizedQuestions) {
                await (fetcher as any)("/questions/", {
                    method: "POST",
                    body: JSON.stringify({
                        ...q,
                        exam_id: parseInt(params.id as string),
                    }),
                });
            }

            startTransition(() => {
                router.push("/admin/exams");
            });

        } catch (error) {
            console.error(error);
            alert("Lỗi cập nhật bài thi");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-[var(--text-muted)] animate-pulse">Đang tải...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto pb-20 animate-fade-in space-y-8 text-[var(--text-primary)] w-full">
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

                    {/* Cover Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">Ảnh bìa (tuỳ chọn)</label>
                        <div className="flex items-start gap-4">
                            <label className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed border-[var(--border-default)] rounded-xl cursor-pointer hover:border-[var(--accent-primary)] hover:bg-[var(--accent-glow)] transition-all">
                                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImageChange} />
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-muted)] mb-2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                <span className="text-xs text-[var(--text-muted)]">{coverImageFile ? coverImageFile.name : "Chọn ảnh mới để thay thế"}</span>
                            </label>
                            {(coverImagePreview || existingCoverImage) && (
                                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[var(--border-default)] flex-shrink-0">
                                    <img src={coverImagePreview || existingCoverImage!} alt="Preview" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => { setCoverImageFile(null); setCoverImagePreview(null); setExistingCoverImage(null); }}
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
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Thời gian bắt đầu</label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-shadow bg-[var(--bg-primary)] text-[var(--text-primary)]"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Thời gian kết thúc</label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-shadow bg-[var(--bg-primary)] text-[var(--text-primary)]"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Organizers List */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Đơn vị Tổ chức / Đồng hành</label>
                            <button type="button" onClick={addOrganizer} className="text-[var(--accent-primary)] text-sm font-medium hover:underline flex items-center gap-1">
                                <span>+</span> Thêm đơn vị
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            {organizers.map((org, idx) => (
                                <div key={idx} className="p-4 border border-[var(--border-default)] rounded-xl bg-[var(--surface-hover)] space-y-4 relative">
                                    {organizers.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeOrganizer(idx)}
                                            className="absolute top-4 right-4 text-red-500 hover:text-red-600 transition-colors"
                                            title="Xóa đơn vị này"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                                        </button>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-[var(--text-secondary)]">Tên Đơn vị</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] outline-none bg-white font-medium shadow-sm transition-shadow text-[var(--text-primary)]"
                                                    placeholder="Ví dụ: Trường Đại học XYZ..."
                                                    value={org.name}
                                                    onChange={(e) => updateOrganizer(idx, "name", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-[var(--text-secondary)]">Mô tả (HTML/Text)</label>
                                                <textarea
                                                    rows={3}
                                                    className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] outline-none bg-white shadow-sm transition-shadow text-[var(--text-primary)]"
                                                    placeholder="Giới thiệu nhanh về đơn vị này..."
                                                    value={org.desc}
                                                    onChange={(e) => updateOrganizer(idx, "desc", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-[var(--text-secondary)]">Logo Đơn vị</label>
                                            <div className="flex items-start gap-4">
                                                <label className="flex-1 flex flex-col items-center justify-center h-24 border-2 border-dashed border-[var(--border-default)] rounded-xl cursor-pointer bg-white hover:border-[var(--accent-primary)] transition-all">
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                                        const file = e.target.files?.[0] || null;
                                                        updateOrganizer(idx, "logoFile", file);
                                                        if (file) updateOrganizer(idx, "logoPreview", URL.createObjectURL(file));
                                                    }} />
                                                    <span className="text-xs text-[var(--text-muted)]">Tải lên Logo</span>
                                                </label>
                                                {(org.logoPreview || org.existingLogo) && (
                                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[var(--border-default)] flex-shrink-0 bg-white">
                                                        <img src={org.logoPreview || org.existingLogo!} alt="Logo" className="w-full h-full object-contain p-1" />
                                                        <button type="button" onClick={() => { updateOrganizer(idx, "logoFile", null); updateOrganizer(idx, "logoPreview", null); updateOrganizer(idx, "existingLogo", null); }} className="absolute py-0.5 px-2 right-0.5 top-0.5 rounded-full bg-black/60 text-white text-xs hover:bg-red-500">✕</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border-default)]">
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
                                {(posterPreview || existingPoster) && (
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[var(--border-default)] flex-shrink-0">
                                        <img src={posterPreview || existingPoster!} alt="Poster" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => { setPosterFile(null); setPosterPreview(null); setExistingPoster(null); }} className="absolute py-0.5 px-2 right-0.5 top-0.5 rounded-full bg-black/60 text-white text-xs">✕</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">Slogan / Giới thiệu ngắn (hiển thị dưới tên cuộc thi)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-shadow bg-[var(--bg-primary)] text-[var(--text-primary)]"
                            placeholder="Ví dụ: Hưởng ứng ngày pháp luật Việt Nam (09/11/2025)"
                            value={slogan}
                            onChange={(e) => setSlogan(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Email liên hệ BTC</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-shadow bg-[var(--bg-primary)] text-[var(--text-primary)]"
                                placeholder="btc@example.com"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Điện thoại liên hệ BTC</label>
                            <input
                                type="tel"
                                className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-shadow bg-[var(--bg-primary)] text-[var(--text-primary)]"
                                placeholder="(024) 1234 5678"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                            />
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
                    
                    <div className="space-y-4 pt-4 border-t border-[var(--border-default)]">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Hướng dẫn & Câu trả lời (FAQ)</label>
                            <label className="flex items-center gap-2 text-sm text-[var(--text-primary)] cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-[var(--border-default)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                                    checked={useCustomFaqs}
                                    onChange={(e) => setUseCustomFaqs(e.target.checked)}
                                />
                                Tuỳ chỉnh (thay cho mặc định)
                            </label>
                        </div>
                        
                        {useCustomFaqs && (
                            <div className="space-y-4">
                                {customFaqs.map((faq, index) => (
                                    <div key={index} className="flex gap-4 items-start p-4 border border-[var(--border-default)] rounded-xl bg-gray-50/50">
                                        <div className="flex-1 space-y-3">
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] outline-none bg-white font-medium shadow-sm transition-shadow text-[var(--text-primary)]"
                                                placeholder="Câu hỏi?"
                                                value={faq.q}
                                                onChange={(e) => updateFaq(index, "q", e.target.value)}
                                            />
                                            <textarea
                                                rows={2}
                                                className="w-full px-4 py-2 border border-[var(--border-default)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] outline-none bg-white shadow-sm transition-shadow text-[var(--text-primary)]"
                                                placeholder="Câu trả lời"
                                                value={faq.a}
                                                onChange={(e) => updateFaq(index, "a", e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFaq(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                            title="Xóa câu hỏi này"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addFaq}
                                    className="px-4 py-2 text-sm font-medium text-[var(--accent-primary)] bg-[var(--accent-glow)] rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                                >
                                    <span>+</span> Thêm câu hỏi
                                </button>
                            </div>
                        )}
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
