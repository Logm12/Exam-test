"use client";
import { useState, useEffect, useCallback, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetcher } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

type OptionMap = { [key: string]: string };

type Question = {
    id: number;
    content: string;
    type: "multiple_choice" | "short_answer";
    options: OptionMap;
};

type ExamData = {
    id: number;
    title: string;
    duration: number;
};

/* ==================== ANTI-CHEAT HOOK ==================== */
function useAntiCheat(durationMinutes: number, maxViolations: number, onAutoSubmit: () => void, isDisabled: () => boolean = () => false) {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
    const [warnings, setWarnings] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const isDisabledRef = useRef(isDisabled);
    useEffect(() => { isDisabledRef.current = isDisabled; });

    // Sync timeLeft when durationMinutes changes (e.g. after exam data loads)
    useEffect(() => {
        if (durationMinutes > 0) {
            Promise.resolve().then(() => setTimeLeft(durationMinutes * 60));
        }
    }, [durationMinutes]);

    // Timer countdown
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // Tab switch and blur detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && !isDisabledRef.current()) {
                setWarnings((w) => {
                    const next = w + 1;
                    return next;
                });
                setShowWarning(true);
            }
        };
        const handleBlur = () => {
            if (isDisabledRef.current()) return;
            setWarnings((w) => {
                const next = w + 1;
                return next;
            });
            setShowWarning(true);
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
        };
    }, []);

    // Auto-submit on exceeding maxViolations
    const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
    useEffect(() => {
        if (warnings >= maxViolations && !hasAutoSubmitted) {
            Promise.resolve().then(() => {
                setHasAutoSubmitted(true);
                onAutoSubmit();
            });
        }
    }, [warnings, maxViolations, onAutoSubmit, hasAutoSubmitted]);

    // Block right-click, copy, paste
    useEffect(() => {
        const preventDefault = (e: Event) => e.preventDefault();
        document.addEventListener("contextmenu", preventDefault);
        document.addEventListener("copy", preventDefault);
        document.addEventListener("paste", preventDefault);
        return () => {
            document.removeEventListener("contextmenu", preventDefault);
            document.removeEventListener("copy", preventDefault);
            document.removeEventListener("paste", preventDefault);
        };
    }, []);

    const dismissWarning = () => setShowWarning(false);

    return { timeLeft, warnings, showWarning, dismissWarning };
}

/* ==================== WARNING MODAL ==================== */
function WarningModal({ warnings, maxViolations, onDismiss, t }: {
    warnings: number;
    maxViolations: number;
    onDismiss: () => void;
    t: (key: string) => string;
}) {
    const remaining = maxViolations - warnings;
    const isAutoSubmit = warnings >= maxViolations;

    const message = isAutoSubmit
        ? t("anticheat.warning.autosubmit")
        : t("anticheat.warning.tabswitch")
            .replace("{count}", String(warnings))
            .replace("{remaining}", String(remaining));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative surface-card p-8 max-w-md mx-4 text-center space-y-4" style={{ borderRadius: 'var(--radius-xl)' }}>
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--status-danger)" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{t("anticheat.warning.title")}</h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{message}</p>
                <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
                    {Array.from({ length: maxViolations }).map((_, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 rounded-full transition-colors"
                            style={{ background: i < warnings ? 'var(--status-danger)' : 'var(--border-default)' }}
                        />
                    ))}
                </div>
                {!isAutoSubmit && (
                    <button
                        onClick={onDismiss}
                        className="accent-btn px-6 py-2.5 text-sm mt-2"
                    >
                        {t("anticheat.warning.understood")}
                    </button>
                )}
            </div>
        </div>
    );
}

function ConfirmSubmitModal({ onConfirm, onCancel, isSubmitting, t }: {
    onConfirm: () => void;
    onCancel: () => void;
    isSubmitting: boolean;
    t: (key: string) => string;
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!isSubmitting ? onCancel : undefined} />
            <div className="relative surface-card p-8 max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-200" style={{ borderRadius: 'var(--radius-xl)' }}>
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-[var(--accent-glow)]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                        {t("exam.take.confirmSubmitTitle") || "Nộp bài thi?"}
                    </h2>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                        {t("exam.take.confirmSubmit") || "Bạn có chắc chắn muốn kết thúc bài thi này không? Hành động này không thể hoàn tác."}
                    </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                    <button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="w-full accent-btn py-3 font-bold rounded-xl flex items-center justify-center space-x-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>{t("exam.take.submitting")}</span>
                            </>
                        ) : (
                            <span>{t("exam.take.finishExam")}</span>
                        )}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="w-full py-3 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        {t("common.cancel") || "Hủy bỏ"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ==================== EXAM CONTENT ==================== */
function ExamContent({ examId }: { examId: string }) {
    const { t } = useLanguage();
    const router = useRouter();
    const [exam, setExam] = useState<ExamData | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [flaggedIds, setFlaggedIds] = useState<Set<number>>(new Set());
    const [doneIds, setDoneIds] = useState<Set<number>>(new Set());
    const [showSidebar, setShowSidebar] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState("");
    const startedAtRef = useRef<number | null>(null);

    useEffect(() => {
        setCurrentTime(new Date().toLocaleString());
    }, []);

    useEffect(() => {
        const loadExam = async () => {
            try {
                // Check if already submitted before loading exam
                const myExams: Array<{ id: number; status?: string }> = await fetcher(`/exams/me`);
                const thisExam = myExams.find((e) => String(e.id) === String(examId));
                if (thisExam?.status === "submitted") {
                    window.location.replace('/dashboard');
                    return;
                }

                const studentExam = await fetcher(`/exams/${examId}/student`);
                setExam({
                    id: studentExam.id,
                    title: studentExam.title,
                    duration: studentExam.duration,
                });
                setQuestions(studentExam.questions || []);
            } catch (err) {
                console.error("Failed to load exam data", err);
                window.location.replace('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };
        loadExam();
    }, [examId, router]);

    useEffect(() => {
        startedAtRef.current = null;
    }, [examId]);

    useEffect(() => {
        if (exam && startedAtRef.current === null) {
            startedAtRef.current = Date.now();
        }
    }, [exam]);

    const isSubmittingRef = useRef(false);
    useEffect(() => { isSubmittingRef.current = isSubmitting; }, [isSubmitting]);

    const submitExam = useCallback(async (isAutoSubmit = false, violationCount = 0) => {
        if (!exam || isSubmittingRef.current) return;
        isSubmittingRef.current = true;  // Set immediately (before await) so anti-cheat is disabled right away
        setIsSubmitting(true);
        try {
            const answersPayload: Record<string, string> = {};
            Object.entries(answers).forEach(([question_id, answer_text]) => {
                answersPayload[question_id.toString()] = answer_text;
            });

            const timeSpentSeconds = startedAtRef.current
                ? Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000))
                : null;

            await fetcher(`/exams/${exam.id}/submit`, {
                method: "POST",
                body: JSON.stringify({
                    answers: answersPayload,
                    forced_submit: isAutoSubmit,
                    violation_count: violationCount,
                    time_spent_seconds: timeSpentSeconds,
                })
            });

            alert(t("exam.take.submitSuccess") || "Nộp bài thành công!");
            // Use full navigation to bypass Next.js router cache so dashboard shows fresh data
            window.location.replace('/dashboard');
        } catch (err: unknown) {
            const error = err as { message?: string; status?: number };
            console.error("Submission failed", error);
            const errorMessage = error?.message || "";
            let alertMessage = t("exam.take.submitFailed") || "Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.";
            
            if (errorMessage.includes("Exam already submitted")) {
                alertMessage = t("exam.take.alreadySubmitted") || "Bài thi này đã được nộp rồi. Bạn không thể nộp lại.";
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    window.location.replace('/dashboard');
                }, 2000);
            }
            
            alert(alertMessage);
            setIsSubmitting(false);
            isSubmittingRef.current = false;
        }
    }, [exam, answers, t]);

    const isAnswered = useCallback((q: Question) => {
        const a = answers[q.id];
        if (a === undefined || a === null) return false;
        return String(a).trim().length > 0;
    }, [answers]);

    const toggleFlag = (id: number) => {
        setFlaggedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleDone = (id: number) => {
        setDoneIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const goToQuestion = useCallback((index: number) => {
        if (index >= 0 && index < questions.length) {
            setCurrentQuestionIndex(index);
            // Scroll to top of the question container for better UX
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [questions.length]);

    const handleAnswerAutoAdvance = useCallback((questionId: number) => {
        // If not flagged, auto-advance after 800ms
        if (!flaggedIds.has(questionId)) {
            setTimeout(() => {
                setCurrentQuestionIndex(prev => {
                    if (prev < questions.length - 1) return prev + 1;
                    return prev;
                });
            }, 800);
        }
    }, [flaggedIds, questions.length]);

    const handleAutoSubmit = useCallback(() => {
        submitExam(true, 3);
    }, [submitExam]);

    const { timeLeft, warnings, showWarning, dismissWarning } = useAntiCheat(
        exam?.duration || 60,
        3,
        handleAutoSubmit,
        () => isSubmittingRef.current
    );

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (timeLeft <= 0 && exam && !isSubmitting && !isLoading) {
            submitExam(true, warnings);
        }
    }, [timeLeft, exam, isSubmitting, isLoading, submitExam, warnings]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="animate-pulse h-12 w-48 rounded-lg" style={{ background: 'var(--surface-card)' }} />
            </div>
        );
    }

    if (!exam) return null;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col font-sans select-none">
            {/* Warning Modal */}
            {showWarning && (
                <WarningModal
                    warnings={warnings}
                    maxViolations={3}
                    onDismiss={dismissWarning}
                    t={t}
                />
            )}

            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)]" style={{ background: 'var(--surface-overlay)' }}>
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
                            <span className="text-white font-bold text-xs">EO</span>
                        </div>
                        <div className="font-semibold tracking-tight text-sm text-[var(--text-primary)]">
                            {exam.title}
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {warnings > 0 && (
                            <div className="text-xs font-semibold px-3 py-1 rounded-full border flex items-center" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--status-danger)', borderColor: 'rgba(239,68,68,0.3)' }}>
                                <svg className="mr-1.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                                {warnings}/3
                            </div>
                        )}

                        <div className={`font-mono text-lg font-bold ${timeLeft < 300 ? 'animate-pulse' : ''}`} style={{ color: timeLeft < 300 ? 'var(--status-danger)' : 'var(--status-success)' }}>
                            {formatTime(timeLeft)}
                        </div>
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="p-2 rounded-lg hover:bg-[var(--border-subtle)] transition-colors ml-2"
                            title={showSidebar ? "Ẩn danh sách câu hỏi" : "Hiện danh sách câu hỏi"}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="relative z-[100] ml-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowConfirmModal(true);
                                }}
                                disabled={isSubmitting}
                                className="accent-btn py-2 px-6 font-semibold shadow-lg text-sm rounded-lg hover:shadow-xl transition-all cursor-pointer pointer-events-auto"
                                style={{ background: 'var(--accent-primary)', color: 'white' }}
                            >
                                {isSubmitting ? t("exam.take.submitting") : t("exam.take.finishExam")}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Layout Wrapper */}
            <div className="flex-1 flex overflow-hidden">
                {/* Main Content */}
                <main className={`flex-1 overflow-y-auto px-6 py-12 space-y-8 pb-32 transition-all duration-300`}>
                    <div className="max-w-4xl mx-auto space-y-8">
                        {questions.length > 0 && questions[currentQuestionIndex] && (
                            <div key={questions[currentQuestionIndex].id} className="surface-card p-8 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="absolute -top-3 -left-3 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white select-none" style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 14px var(--accent-glow)' }}>
                                    {currentQuestionIndex + 1}
                                </div>
                                
                                <div className="absolute top-4 right-4 flex items-center space-x-2">
                                    <button 
                                        onClick={() => toggleFlag(questions[currentQuestionIndex].id)}
                                        className={`p-2 rounded-lg transition-all border ${flaggedIds.has(questions[currentQuestionIndex].id) ? 'bg-orange-100 border-orange-300 text-orange-600' : 'bg-transparent border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-orange-500'}`}
                                        title="Gắn cờ để xem lại"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill={flaggedIds.has(questions[currentQuestionIndex].id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => toggleDone(questions[currentQuestionIndex].id)}
                                        className={`p-2 rounded-lg transition-all border ${doneIds.has(questions[currentQuestionIndex].id) ? 'bg-green-100 border-green-300 text-green-600' : 'bg-transparent border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-green-500'}`}
                                        title="Đánh dấu đã hoàn thành"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="text-base font-medium text-[var(--text-primary)] leading-relaxed pl-4 mb-6 pr-20">
                                    {questions[currentQuestionIndex].content}
                                </div>
                                <div className="pl-4">
                                    {questions[currentQuestionIndex].type === "multiple_choice" ? (
                                        <div className="space-y-3">
                                            {Object.entries(questions[currentQuestionIndex].options).map(([optKey, optText]) => (
                                                <label
                                                    key={optKey}
                                                    className={`flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[questions[currentQuestionIndex].id] === optKey
                                                        ? 'border-[var(--accent-primary)]'
                                                        : 'border-[var(--border-subtle)] hover:border-[var(--text-muted)]'
                                                        }`}
                                                    style={answers[questions[currentQuestionIndex].id] === optKey ? { background: 'var(--accent-glow)' } : {}}
                                                >
                                                    <div className="flex items-center h-6">
                                                        <input
                                                            type="radio"
                                                            name={`q-${questions[currentQuestionIndex].id}`}
                                                            value={optKey}
                                                            checked={answers[questions[currentQuestionIndex].id] === optKey}
                                                            onChange={(e) => {
                                                                const qId = questions[currentQuestionIndex].id;
                                                                setAnswers(prev => ({ ...prev, [qId]: e.target.value }));
                                                                if (!doneIds.has(qId)) toggleDone(qId);
                                                                handleAnswerAutoAdvance(qId);
                                                            }}
                                                            className="w-4 h-4 accent-[var(--accent-primary)]"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="font-bold text-[var(--text-primary)] mr-2">{optKey}.</span>
                                                        <span className="text-[var(--text-secondary)]">{optText}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <textarea
                                                rows={4}
                                                placeholder={t("exam.take.typeAnswer")}
                                                value={answers[questions[currentQuestionIndex].id] || ""}
                                                onChange={(e) => {
                                                    const qId = questions[currentQuestionIndex].id;
                                                    setAnswers(prev => ({ ...prev, [qId]: e.target.value }));
                                                    if (e.target.value.trim() && !doneIds.has(qId)) toggleDone(qId);
                                                }}
                                                className="w-full rounded-xl border-2 border-[var(--border-default)] focus:border-[var(--accent-primary)] p-4 font-mono text-sm resize-none transition-colors outline-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
                                                spellCheck={false}
                                            />
                                            <div className="text-xs text-[var(--text-muted)] font-medium text-right">
                                                {(answers[questions[currentQuestionIndex].id] || "").length} {t("exam.take.characters")}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="mt-10 flex items-center justify-between border-t border-[var(--border-subtle)] pt-6">
                                    <button
                                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                        disabled={currentQuestionIndex === 0}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-[var(--border-default)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-semibold text-[var(--text-secondary)]"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                                        <span>{t("common.prev") || "Câu trước"}</span>
                                    </button>
                                    
                                    <div className="text-xs font-bold text-[var(--text-muted)] tracking-widest uppercase">
                                        {currentQuestionIndex + 1} / {questions.length}
                                    </div>

                                    <button
                                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                        disabled={currentQuestionIndex === questions.length - 1}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-[var(--border-default)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-semibold text-[var(--text-secondary)]"
                                    >
                                        <span>{t("common.next") || "Câu tiếp"}</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {questions.length === 0 && (
                            <div className="text-center py-20 surface-card">
                                <p className="text-[var(--text-secondary)]">{t("exam.take.noQuestions")}</p>
                            </div>
                        )}

                    </div>
                </main>

                {/* Sidebar Question Navigator */}
                <aside 
                    className={`border-l border-[var(--border-subtle)] bg-[var(--surface-overlay)] transition-all duration-300 overflow-y-auto ${showSidebar ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}
                >
                    <div className="p-6 space-y-6 min-w-[20rem]">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-[var(--text-primary)]">Danh sách câu hỏi</h3>
                            <span className="text-xs font-medium px-2 py-1 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)]">
                                {Object.keys(answers).length}/{questions.length}
                            </span>
                        </div>

                        <div className="grid grid-cols-5 gap-3">
                            {questions.map((q, idx) => {
                                const answered = isAnswered(q);
                                const isFlagged = flaggedIds.has(q.id);
                                const isDone = doneIds.has(q.id);
                                
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => goToQuestion(idx)}
                                        className={`relative w-11 h-11 rounded-xl border-2 text-sm font-bold transition-all flex items-center justify-center ${currentQuestionIndex === idx ? 'ring-2 ring-[var(--accent-primary)] ring-offset-2' : ''}`}
                                        style={isDone
                                            ? { background: 'var(--accent-glow)', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }
                                            : { background: 'var(--surface-card)', borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }
                                        }
                                    >
                                        {idx + 1}
                                        {isFlagged && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                                                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /></svg>
                                            </div>
                                        )}
                                        {isDone && (
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="pt-6 border-t border-[var(--border-subtle)] space-y-3">
                            <div className="flex items-center text-xs text-[var(--text-muted)]">
                                <div className="w-3 h-3 rounded bg-green-500 mr-2" />
                                <span>Đã hoàn thành (Tick)</span>
                            </div>
                            <div className="flex items-center text-xs text-[var(--text-muted)]">
                                <div className="w-3 h-3 rounded bg-orange-500 mr-2" />
                                <span>Cần xem lại (Cờ)</span>
                            </div>
                        </div>
                        
                        <div className="py-4">
                            <button
                                onClick={() => setShowConfirmModal(true)}
                                disabled={isSubmitting}
                                className="w-full accent-btn py-3 font-bold rounded-xl"
                            >
                                {isSubmitting ? t("exam.take.submitting") : "NỘP BÀI THI"}
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
            
            {showConfirmModal && (
                <ConfirmSubmitModal
                    onConfirm={() => {
                        setShowConfirmModal(false);
                        submitExam(false, warnings);
                    }}
                    onCancel={() => setShowConfirmModal(false)}
                    isSubmitting={isSubmitting}
                    t={t}
                />
            )}
        </div>
    );
}

export default function ExamEngine({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(`/login?callbackUrl=/exam/${id}`);
        }
    }, [status, router, id]);

    if (status === "loading" || status === "unauthenticated") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="animate-pulse h-12 w-48 rounded-lg" style={{ background: 'var(--surface-card)' }} />
            </div>
        );
    }

    return <ExamContent examId={id} />;
}
