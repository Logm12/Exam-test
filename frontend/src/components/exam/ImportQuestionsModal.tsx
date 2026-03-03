"use client";

import { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ParsedQuestion {
    number: number;
    content: string;
    options: Record<string, string>;
    correct_answer: string | null;
    type: string;
}

interface ImportQuestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (questions: ParsedQuestion[]) => void;
    examId?: number;
}

export default function ImportQuestionsModal({ isOpen, onClose, onImport, examId }: ImportQuestionsModalProps) {
    const { t } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFile = useCallback(async (file: File) => {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!["docx", "pdf"].includes(ext || "")) {
            setError(t("import.error"));
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError(t("import.maxSize"));
            return;
        }

        setError(null);
        setIsProcessing(true);
        setFileName(file.name);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/proxy/exams/import-questions", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Parse failed");
            }

            const data = await res.json();
            setParsedQuestions(data.questions);
            setSelectedIds(new Set(data.questions.map((_: ParsedQuestion, i: number) => i)));
        } catch (err) {
            setError(t("import.error"));
        } finally {
            setIsProcessing(false);
        }
    }, [t]);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const toggleSelect = (idx: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    };

    const selectAll = () => {
        if (selectedIds.size === parsedQuestions.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(parsedQuestions.map((_, i) => i)));
        }
    };

    const handleImport = () => {
        const selected = parsedQuestions.filter((_, i) => selectedIds.has(i));
        onImport(selected);
        onClose();
        resetState();
    };

    const resetState = () => {
        setParsedQuestions([]);
        setSelectedIds(new Set());
        setError(null);
        setFileName(null);
        setIsProcessing(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) { onClose(); resetState(); } }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative surface-card w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col mx-4" style={{ borderRadius: 'var(--radius-xl)' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t("import.title")}</h2>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">{t("import.description")}</p>
                    </div>
                    <button onClick={() => { onClose(); resetState(); }} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer p-1">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {parsedQuestions.length === 0 ? (
                        /* Dropzone */
                        <div
                            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${isDragging ? 'border-[var(--accent-primary)] bg-[var(--accent-glow)]' : 'border-[var(--border-default)] hover:border-[var(--accent-primary)]'}`}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".docx,.pdf"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFile(file);
                                }}
                            />
                            {isProcessing ? (
                                <div className="space-y-3">
                                    <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-sm text-[var(--text-secondary)]">{t("import.processing")}</p>
                                    <p className="text-xs text-[var(--text-muted)]">{fileName}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <svg className="mx-auto text-[var(--text-muted)]" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                    <p className="text-sm text-[var(--text-secondary)]">{t("import.dropzone")}</p>
                                    <p className="text-xs text-[var(--text-muted)]">{t("import.maxSize")}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Questions List */
                        <div className="space-y-3">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                    {t("import.found").replace("{count}", String(parsedQuestions.length))}
                                </p>
                                <button onClick={selectAll} className="text-xs text-[var(--accent-primary)] hover:underline cursor-pointer">
                                    {selectedIds.size === parsedQuestions.length ? "Deselect All" : "Select All"}
                                </button>
                            </div>
                            {parsedQuestions.map((q, idx) => (
                                <div
                                    key={idx}
                                    className={`surface-card p-4 cursor-pointer transition-all ${selectedIds.has(idx) ? 'border-[var(--accent-primary)]' : ''}`}
                                    onClick={() => toggleSelect(idx)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center mt-0.5 transition-colors ${selectedIds.has(idx) ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)]' : 'border-[var(--border-default)]'}`}>
                                            {selectedIds.has(idx) && (
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[var(--text-primary)]">
                                                {q.number}. {q.content}
                                            </p>
                                            <div className="mt-2 space-y-1">
                                                {Object.entries(q.options).map(([letter, text]) => (
                                                    <p key={letter} className={`text-xs ${letter === q.correct_answer ? 'text-[var(--status-success)] font-semibold' : 'text-[var(--text-secondary)]'}`}>
                                                        {letter}. {text} {letter === q.correct_answer ? " (correct)" : ""}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--status-danger)' }}>
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {parsedQuestions.length > 0 && (
                    <div className="p-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                        <button
                            onClick={() => { resetState(); }}
                            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                        >
                            Upload a different file
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={selectedIds.size === 0}
                            className="accent-btn px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t("import.addSelected")} ({selectedIds.size})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
