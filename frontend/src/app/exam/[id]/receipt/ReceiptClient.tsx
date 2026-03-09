"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

type Exam = {
    id: number;
    title: string;
};

function ReceiptContent({ exam, examId }: { exam: Exam | null; examId: string }) {
    const { t } = useLanguage();
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        setCurrentTime(new Date().toLocaleString());
    }, []);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col font-sans">
            <header className="bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-end">
                    <LanguageToggle />
                </div>
            </header>
            <div className="flex-1 flex items-center justify-center p-6 text-center animate-fade-in">
                <div className="surface-card p-12 max-w-lg w-full space-y-8">
                    <div className="w-20 h-20 bg-[var(--status-success)] rounded-full flex items-center justify-center mx-auto border-8 border-green-50/50 dark:border-green-900/30">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold text-[var(--text-primary)] tracking-tight">{t("exam.receipt.title")}</h1>
                        <p className="text-[var(--text-secondary)] text-sm">
                            {t("exam.receipt.desc")}
                            {" "}
                            <span className="font-semibold text-[var(--text-primary)]">{exam?.title || `#${examId}`}</span>
                        </p>
                    </div>

                    <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-subtle)] flex justify-between items-center text-sm">
                        <span className="text-[var(--text-secondary)]">{t("exam.receipt.timestamp")}</span>
                        <span className="font-mono font-medium text-[var(--text-primary)]">
                            {currentTime}
                        </span>
                    </div>

                    <div className="pt-4 border-t border-[var(--border-subtle)]">
                        <Link href="/dashboard" className="accent-btn inline-block w-full px-6 py-3 text-center text-sm font-semibold">
                            {t("exam.receipt.returnDashboard")}
                        </Link>
                    </div>
                </div>
            </div>
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
