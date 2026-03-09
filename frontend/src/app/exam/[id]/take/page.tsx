"use client";
import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { fetcher } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

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
function useAntiCheat(durationMinutes: number, maxViolations: number, onAutoSubmit: () => void) {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
    const [warnings, setWarnings] = useState(0);
    const [showWarning, setShowWarning] = useState(false);

    // Sync timeLeft when durationMinutes changes (e.g. after exam data loads)
    useEffect(() => {
        if (durationMinutes > 0) {
            setTimeLeft(durationMinutes * 60);
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
            if (document.hidden) {
                setWarnings((w) => {
                    const next = w + 1;
                    return next;
                });
                setShowWarning(true);
            }
        };
        const handleBlur = () => {
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
            setHasAutoSubmitted(true);
            onAutoSubmit();
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

/* ==================== EXAM CONTENT ==================== */
function ExamContent({ examId }: { examId: string }) {
    const { t } = useLanguage();
    const router = useRouter();
    const [exam, setExam] = useState<ExamData | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        setCurrentTime(new Date().toLocaleString());
    }, []);

    useEffect(() => {
        const loadExam = async () => {
            try {
                const examData = await fetcher(`/exams/${examId}`);
                const questionsData = await fetcher(`/questions/exam/${examId}`);
                setExam(examData);
                setQuestions(questionsData);
            } catch (err) {
                console.error("Failed to load exam data", err);
                router.push("/dashboard");
            } finally {
                setIsLoading(false);
            }
        };
        loadExam();
    }, [examId, router]);

    const submitExam = useCallback(async (isAutoSubmit = false, violationCount = 0) => {
        if (!exam || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const answersPayload: Record<string, string> = {};
            Object.entries(answers).forEach(([question_id, answer_text]) => {
                answersPayload[question_id.toString()] = answer_text;
            });

            await fetcher(`/exams/${exam.id}/submit`, {
                method: "POST",
                body: JSON.stringify({
                    answers: answersPayload,
                    forced_submit: isAutoSubmit,
                    violation_count: violationCount
                })
            });

            router.push(`/exam/${exam.id}/receipt`);
        } catch (err) {
            console.error("Submission failed", err);
            alert(t("exam.take.submitFailed"));
            setIsSubmitting(false);
        }
    }, [exam, answers, isSubmitting, router, t]);

    const handleAutoSubmit = useCallback(() => {
        submitExam(true, 3);
    }, [submitExam]);

    const { timeLeft, warnings, showWarning, dismissWarning } = useAntiCheat(
        exam?.duration || 60,
        3,
        handleAutoSubmit
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
                        <ThemeToggle />
                        <LanguageToggle />
                        <div className={`font-mono text-lg font-bold ${timeLeft < 300 ? 'animate-pulse' : ''}`} style={{ color: timeLeft < 300 ? 'var(--status-danger)' : 'var(--status-success)' }}>
                            {formatTime(timeLeft)}
                        </div>
                        <div className="relative z-[100] ml-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    if (confirm(t("exam.take.confirmSubmit"))) {
                                        submitExam(false, warnings);
                                    }
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

            {/* Questions */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 space-y-8 pb-32">
                {questions.map((q, index) => (
                    <div key={q.id} className="surface-card p-8 relative" id={`q-${q.id}`}>
                        <div className="absolute -top-3 -left-3 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white select-none" style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 14px var(--accent-glow)' }}>
                            {index + 1}
                        </div>
                        <div className="text-base font-medium text-[var(--text-primary)] leading-relaxed pl-4 mb-6">
                            {q.content}
                        </div>
                        <div className="pl-4">
                            {q.type === "multiple_choice" ? (
                                <div className="space-y-3">
                                    {Object.entries(q.options).map(([optKey, optText]) => (
                                        <label
                                            key={optKey}
                                            className={`flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[q.id] === optKey
                                                ? 'border-[var(--accent-primary)]'
                                                : 'border-[var(--border-subtle)] hover:border-[var(--text-muted)]'
                                                }`}
                                            style={answers[q.id] === optKey ? { background: 'var(--accent-glow)' } : {}}
                                        >
                                            <div className="flex items-center h-6">
                                                <input
                                                    type="radio"
                                                    name={`q-${q.id}`}
                                                    value={optKey}
                                                    checked={answers[q.id] === optKey}
                                                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
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
                                        value={answers[q.id] || ""}
                                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                        className="w-full rounded-xl border-2 border-[var(--border-default)] focus:border-[var(--accent-primary)] p-4 font-mono text-sm resize-none transition-colors outline-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
                                        spellCheck={false}
                                    />
                                    <div className="text-xs text-[var(--text-muted)] font-medium text-right">
                                        {(answers[q.id] || "").length} {t("exam.take.characters")}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {questions.length === 0 && (
                    <div className="text-center py-20 surface-card">
                        <p className="text-[var(--text-secondary)]">{t("exam.take.noQuestions")}</p>
                    </div>
                )}
                <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-subtle)] flex justify-between items-center text-sm">
                    <span className="text-[var(--text-secondary)]">{t("exam.receipt.timestamp")}</span>
                    <span className="font-mono font-medium text-[var(--text-primary)]">
                        {currentTime}
                    </span>
                </div>
            </main>
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
