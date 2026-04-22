"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { fetcher } from "@/lib/api";

type QuestionResult = {
    question_id: number;
    content: string;
    type: string;
    options: Record<string, string> | null;
    selected_option: string | null;
    text_response: string | null;
    correct_answer: string;
    is_correct: boolean;
};

type ExamResult = {
    exam_title: string;
    score: number;
    correct_count: number;
    submitted_at: string;
    details: QuestionResult[];
};

type Exam = {
    id: number;
    title: string;
};

function ReceiptContent({ exam, examId }: { exam: Exam | null; examId: string }) {
    const { t } = useLanguage();
    const [currentTime, setCurrentTime] = useState("");
    const [result, setResult] = useState<ExamResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        setCurrentTime(new Date().toLocaleString());
        
        async function loadResult() {
            try {
                const data = await fetcher(`/exams/${examId}/result`);
                setResult(data);
            } catch (err) {
                console.error("Failed to load exam result:", err);
            } finally {
                setLoading(false);
            }
        }
        
        loadResult();
    }, [examId]);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col font-sans">
            <header className="bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <span className="font-semibold text-[var(--text-primary)]">{exam?.title || t("exam.receipt.title")}</span>
                    <Link href="/dashboard" className="text-sm text-[var(--accent-color)] hover:underline">
                        {t("exam.receipt.returnDashboard")}
                    </Link>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-8 animate-fade-in">
                {/* Score Summary Card */}
                <div className="surface-card p-10 text-center space-y-6">
                    <div className="w-20 h-20 bg-[var(--status-success)] rounded-full flex items-center justify-center mx-auto border-8 border-green-50/50 dark:border-green-900/30">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold text-[var(--text-primary)] tracking-tight">{t("exam.receipt.title")}</h1>
                        <p className="text-[var(--text-secondary)]">
                            {t("exam.receipt.desc")} <span className="font-semibold text-[var(--text-primary)]">{exam?.title}</span>
                        </p>
                    </div>

                    {result && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] transition-all hover:shadow-md">
                                <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Điểm số</div>
                                <div className="text-2xl font-bold text-[var(--accent-color)]">{result.score.toFixed(2)}/10</div>
                            </div>
                            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] transition-all hover:shadow-md">
                                <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Câu đúng</div>
                                <div className="text-2xl font-bold text-[var(--text-primary)]">{result.correct_count}/{result.details.length}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] transition-all hover:shadow-md">
                                <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Thời gian nộp</div>
                                <div className="text-sm font-medium text-[var(--text-primary)] mt-2">
                                    {new Date(result.submitted_at).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                        {result && (
                            <button 
                                onClick={() => setShowDetails(!showDetails)}
                                className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] px-8 py-3 rounded-xl transition-all font-medium text-sm"
                            >
                                {showDetails ? "Ẩn chi tiết bài làm" : "Xem chi tiết bài làm"}
                            </button>
                        )}
                        <Link href="/dashboard" className="accent-btn px-8 py-3 rounded-xl font-medium text-sm">
                            {t("exam.receipt.returnDashboard")}
                        </Link>
                    </div>
                </div>

                {/* Detailed Questions List */}
                {showDetails && result && (
                    <div className="space-y-4 animate-slide-up">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Chi tiết kết quả</h2>
                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span> Đúng
                                </div>
                                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span> Sai
                                </div>
                            </div>
                        </div>
                        
                        {result.details.map((q, idx) => (
                            <div key={q.question_id} className={`surface-card overflow-hidden border-l-4 transition-all hover:shadow-lg ${q.is_correct ? 'border-l-green-500' : 'border-l-red-500'}`}>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-bold text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full uppercase tracking-widest">
                                            Câu {idx + 1}
                                        </span>
                                        {q.is_correct ? (
                                            <span className="text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                CHÍNH XÁC
                                            </span>
                                        ) : (
                                            <span className="text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                                CHƯA CHÍNH XÁC
                                            </span>
                                        )}
                                    </div>
                                    <h3 
                                        className="text-lg text-[var(--text-primary)] mb-6 font-medium leading-relaxed prose dark:prose-invert max-w-full" 
                                        dangerouslySetInnerHTML={{ __html: q.content }} 
                                    />
                                    
                                    {q.type === 'multiple_choice' && q.options && (
                                        <div className="grid grid-cols-1 gap-3">
                                            {Object.entries(q.options).map(([key, text]) => {
                                                const isSelected = q.selected_option === key;
                                                const isCorrect = q.correct_answer === key;
                                                
                                                let bgColor = "bg-[var(--bg-secondary)] border-[var(--border-subtle)]";
                                                let indicator = null;

                                                if (isSelected) {
                                                    if (q.is_correct) {
                                                        bgColor = "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-800";
                                                        indicator = <span className="ml-auto text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-tighter">Bạn chọn đúng</span>;
                                                    } else {
                                                        bgColor = "bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-800";
                                                        indicator = <span className="ml-auto text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-tighter">Bạn đã chọn</span>;
                                                    }
                                                } else if (isCorrect) {
                                                    bgColor = "bg-green-50/50 border-green-300 border-dashed dark:bg-green-800/10 dark:border-green-900";
                                                    indicator = <span className="ml-auto text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-tighter">Đáp án đúng</span>;
                                                }

                                                return (
                                                    <div 
                                                        key={key} 
                                                        className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${bgColor}`}
                                                    >
                                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-[var(--accent-color)] text-white' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'}`}>
                                                            {key}
                                                        </span>
                                                        <span className="text-[var(--text-primary)] text-sm">{text}</span>
                                                        {indicator}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {q.type !== 'multiple_choice' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                                                <div className="text-[10px] text-[var(--text-secondary)] uppercase font-bold mb-2 tracking-widest">Câu trả lời của bạn:</div>
                                                <div className={`text-sm font-medium ${q.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                                                    {q.text_response || "Không có câu trả lời"}
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/10 dark:border-green-800">
                                                <div className="text-[10px] text-green-600 dark:text-green-400 uppercase font-bold mb-2 tracking-widest">Đáp án đúng:</div>
                                                <div className="text-sm text-[var(--text-primary)] font-medium">{q.correct_answer}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="py-12 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--text-secondary)]">
                <div className="max-w-5xl mx-auto px-6">
                    <p>&copy; {new Date().getFullYear()} VNUIS FDBTalent Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default function ReceiptClient({ exam, examId }: { exam: Exam | null; examId: string }) {
    return (
        <LanguageProvider>
            <ReceiptContent exam={exam} examId={examId} />
        </LanguageProvider>
    );
}
