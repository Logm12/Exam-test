"use client";
import { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";

type OptionMap = { [key: string]: string };

interface QuestionForm {
    content: string;
    type: "multiple_choice" | "short_answer";
    options: OptionMap;
    correct_answer: string;
}

export default function CreateExam() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [examTitle, setExamTitle] = useState("");
    const [examDuration, setExamDuration] = useState(60);
    const [questions, setQuestions] = useState<QuestionForm[]>([]);

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
        updated[qIndex].options[optKey] = value;
        setQuestions(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create Exam First
            const examPayload = {
                title: examTitle,
                duration: examDuration,
                start_time: new Date().toISOString(),
                is_published: true
            };

            const newExam = await fetcher("/exams/", {
                method: "POST",
                body: JSON.stringify(examPayload)
            });

            // Create Questions sequentially or better Promise.all
            // Ref: react-best-practices async-parallel
            const qPromises = questions.map((q) =>
                fetcher("/questions/", {
                    method: "POST",
                    body: JSON.stringify({
                        ...q,
                        exam_id: newExam.id
                    })
                })
            );

            await Promise.all(qPromises);

            startTransition(() => {
                router.push("/admin");
            });

        } catch (error) {
            console.error(error);
            alert("Failed to create exam");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                    Create New Exam
                </h1>
                <p className="text-sm text-neutral-500 mt-2">
                    Configure exam details and build your question bank.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <section className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
                    <h2 className="text-lg font-medium text-neutral-900 border-b border-neutral-100 pb-4">
                        Exam Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700">Exam Title</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                                placeholder="e.g. Midterm 2026"
                                value={examTitle}
                                onChange={(e) => setExamTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700">Duration (Minutes)</label>
                            <input
                                type="number"
                                required
                                min={1}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                                value={examDuration}
                                onChange={(e) => setExamDuration(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </section>

                {/* Questions Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-neutral-900">Questions Bank ({questions.length})</h2>
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="bg-neutral-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            + Add Question
                        </button>
                    </div>

                    <div className="space-y-6">
                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm relative group">
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(qIndex)}
                                    className="absolute top-4 right-4 text-neutral-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove Question"
                                >
                                    ✕
                                </button>

                                <div className="space-y-4 pr-8">
                                    <div className="flex items-center space-x-4">
                                        <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                            {qIndex + 1}
                                        </span>
                                        <select
                                            value={q.type}
                                            onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
                                            className="text-sm border-neutral-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        >
                                            <option value="multiple_choice">Multiple Choice</option>
                                            <option value="short_answer">Short Answer</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <textarea
                                            required
                                            placeholder="Question content..."
                                            rows={2}
                                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-none"
                                            value={q.content}
                                            onChange={(e) => updateQuestion(qIndex, "content", e.target.value)}
                                        />
                                    </div>

                                    {q.type === "multiple_choice" ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                            {["A", "B", "C", "D"].map((optKey) => (
                                                <div key={optKey} className="flex items-center space-x-3 bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-200">
                                                    <input
                                                        type="radio"
                                                        name={`correct_ans_${qIndex}`}
                                                        value={optKey}
                                                        checked={q.correct_answer === optKey}
                                                        onChange={(e) => updateQuestion(qIndex, "correct_answer", e.target.value)}
                                                        className="text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-sm font-medium text-neutral-500">{optKey}</span>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder={`Option ${optKey}`}
                                                        value={q.options[optKey]}
                                                        onChange={(e) => updateOption(qIndex, optKey, e.target.value)}
                                                        className="bg-transparent text-sm w-full outline-none placeholder:text-neutral-400"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="pt-2">
                                            <input
                                                type="text"
                                                required
                                                placeholder="Expected correct answer (will be manually graded if not matched)"
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 flex-1 text-sm outline-none"
                                                value={q.correct_answer}
                                                onChange={(e) => updateQuestion(qIndex, "correct_answer", e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {questions.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-2xl">
                                <p className="text-sm text-neutral-500 mb-2">No questions yet</p>
                                <button type="button" onClick={addQuestion} className="text-indigo-600 text-sm font-medium hover:underline">
                                    Add the first question
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Submit Bar */}
                <div className="fixed bottom-0 left-64 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-neutral-200 flex justify-end px-8 z-20">
                    <button
                        type="submit"
                        disabled={isSubmitting || questions.length === 0}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-indigo-200 transition-all"
                    >
                        {isSubmitting ? "Publishing..." : "Publish Exam"}
                    </button>
                </div>
            </form>
        </div>
    );
}
