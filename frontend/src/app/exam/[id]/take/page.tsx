"use client";
import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

type OptionMap = { [key: string]: string };

type Question = {
    id: number;
    content: string;
    type: "multiple_choice" | "short_answer";
    options: OptionMap;
};

type Exam = {
    id: number;
    title: string;
    duration: number;
};

function useAntiCheat(examId: number, durationMinutes: number, maxViolations: number = 3, onViolationLimit: () => void) {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
    const [warnings, setWarnings] = useState(0);

    useEffect(() => {
        if (warnings >= maxViolations) {
            onViolationLimit();
        }
    }, [warnings, maxViolations, onViolationLimit]);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setWarnings((w) => w + 1);
            }
        };
        const handleBlur = () => {
            setWarnings((w) => w + 1);
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
        };
    }, []);

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

    return { timeLeft, warnings };
}

function ExamContent({ examId }: { examId: string }) {
    const { t } = useLanguage();
    const router = useRouter();
    const [exam, setExam] = useState<Exam | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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

    const { timeLeft, warnings } = useAntiCheat(
        exam?.id || 0,
        exam?.duration || 60,
        3,
        () => submitExam(true, 3)
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
        return <div className="min-h-screen flex items-center justify-center font-sans bg-neutral-50"><div className="animate-pulse bg-neutral-200 h-12 w-48 rounded-lg"></div></div>;
    }

    if (!exam) return null;

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-sans select-none">
            <header className="bg-neutral-900 border-b border-black text-white sticky top-0 z-40 shadow-md">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="font-semibold tracking-tight text-sm">
                            {exam.title}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {warnings > 0 && (
                            <div className="text-xs font-semibold bg-red-500/20 text-red-500 px-3 py-1 rounded-full border border-red-500/50 flex items-center">
                                <span className="mr-2 font-bold">!</span>
                                {warnings} {warnings > 1 ? t("exam.take.warnings") : t("exam.take.warning")}
                            </div>
                        )}
                        <LanguageToggle className="text-white border-white/30 hover:bg-white/10" />
                        <div className={`font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
                            {formatTime(timeLeft)}
                        </div>
                        <button
                            onClick={() => {
                                if (confirm(t("exam.take.confirmSubmit"))) {
                                    submitExam(false, warnings);
                                }
                            }}
                            disabled={isSubmitting}
                            className="bg-white text-black hover:bg-neutral-200 px-5 py-2 rounded font-medium text-sm transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? t("exam.take.submitting") : t("exam.take.finishExam")}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 animate-fade-in space-y-12 pb-32">
                {questions.map((q, index) => (
                    <div key={q.id} className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm relative" id={`q-${q.id}`}>
                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-indigo-600 text-white rounded-xl shadow-lg border border-indigo-700 flex items-center justify-center font-bold text-lg select-none">
                            {index + 1}
                        </div>
                        <div className="text-lg font-medium text-neutral-900 leading-relaxed pl-4 mb-8">
                            {q.content}
                        </div>
                        <div className="pl-4">
                            {q.type === "multiple_choice" ? (
                                <div className="space-y-3">
                                    {Object.entries(q.options).map(([optKey, optText]) => (
                                        <label
                                            key={optKey}
                                            className={`flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[q.id] === optKey
                                                ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                                : 'border-neutral-100 bg-white hover:border-neutral-300 hover:bg-neutral-50'
                                                }`}
                                        >
                                            <div className="flex items-center h-6">
                                                <input
                                                    type="radio"
                                                    name={`q-${q.id}`}
                                                    value={optKey}
                                                    checked={answers[q.id] === optKey}
                                                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-600 border-neutral-300"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-bold text-neutral-900 mr-2">{optKey}.</span>
                                                <span className="text-neutral-700">{optText}</span>
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
                                        className="w-full rounded-xl border-2 border-neutral-200 focus:border-indigo-600 focus:ring-0 p-4 font-mono text-sm resize-none transition-colors outline-none"
                                        spellCheck={false}
                                    />
                                    <div className="text-xs text-neutral-400 font-medium text-right">
                                        {(answers[q.id] || "").length} {t("exam.take.characters")}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {questions.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200 shadow-sm">
                        <p className="text-neutral-500">{t("exam.take.noQuestions")}</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function ExamEngine({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return (
        <LanguageProvider>
            <ExamContent examId={id} />
        </LanguageProvider>
    );
}
