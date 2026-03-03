"use client";

import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

type Exam = {
    id: number;
    title: string;
};

function ReceiptContent({ exam, examId }: { exam: Exam | null; examId: string }) {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
            <header className="bg-white border-b border-neutral-200">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-end">
                    <LanguageToggle />
                </div>
            </header>
            <div className="flex-1 flex items-center justify-center p-6 text-center animate-fade-in">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-neutral-200 max-w-lg w-full space-y-8">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border-8 border-green-50/50">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">{t("exam.receipt.title")}</h1>
                        <p className="text-neutral-500 text-sm">
                            {t("exam.receipt.desc")}
                            {" "}
                            <span className="font-semibold text-neutral-900">{exam?.title || `#${examId}`}</span>
                        </p>
                    </div>

                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex justify-between items-center text-sm">
                        <span className="text-neutral-500">{t("exam.receipt.timestamp")}</span>
                        <span className="font-mono font-medium text-neutral-900" suppressHydrationWarning>
                            {typeof window !== "undefined" ? new Date().toLocaleString() : ""}
                        </span>
                    </div>

                    <div className="pt-4 border-t border-neutral-100">
                        <Link href="/dashboard" className="inline-block w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-6 py-3 rounded-xl transition-colors text-center">
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
