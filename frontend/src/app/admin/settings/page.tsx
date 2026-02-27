"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function SystemSettingsPage() {
    const router = useRouter();
    const [platformName, setPlatformName] = useState("ExamOS");
    const [maxDuration, setMaxDuration] = useState(180);
    const [allowRegistration, setAllowRegistration] = useState(true);
    const [enforceAntiCheat, setEnforceAntiCheat] = useState(true);
    const [requireFullscreen, setRequireFullscreen] = useState(true);
    const [autoGrading, setAutoGrading] = useState(true);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // Settings are client-side for this iteration.
        // In production, these would be persisted to the backend.
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-3xl">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                    System Settings
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                    Configure platform behavior and security policies.
                </p>
            </div>

            {saved && (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-100 flex items-center space-x-2">
                    <span className="font-medium">Settings saved successfully.</span>
                </div>
            )}

            {/* General Settings */}
            <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-100">
                    <h2 className="text-base font-medium text-neutral-900">General</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Core platform configuration</p>
                </div>
                <div className="divide-y divide-neutral-100">
                    <div className="px-6 py-5 flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-neutral-900">Platform Name</label>
                            <p className="text-xs text-neutral-500 mt-0.5">Displayed in headers and emails</p>
                        </div>
                        <input
                            type="text"
                            value={platformName}
                            onChange={(e) => setPlatformName(e.target.value)}
                            className="w-48 px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div className="px-6 py-5 flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-neutral-900">Maximum Exam Duration</label>
                            <p className="text-xs text-neutral-500 mt-0.5">Upper limit in minutes for any exam</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="number"
                                value={maxDuration}
                                onChange={(e) => setMaxDuration(parseInt(e.target.value))}
                                min={10}
                                max={600}
                                className="w-24 px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-right"
                            />
                            <span className="text-xs text-neutral-500">min</span>
                        </div>
                    </div>
                    <div className="px-6 py-5 flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-neutral-900">Open Registration</label>
                            <p className="text-xs text-neutral-500 mt-0.5">Allow new users to self-register</p>
                        </div>
                        <button
                            onClick={() => setAllowRegistration(!allowRegistration)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${allowRegistration ? "bg-indigo-600" : "bg-neutral-300"}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${allowRegistration ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Security Settings */}
            <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-100">
                    <h2 className="text-base font-medium text-neutral-900">Security & Anti-Cheat</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Exam integrity enforcement controls</p>
                </div>
                <div className="divide-y divide-neutral-100">
                    <div className="px-6 py-5 flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-neutral-900">Anti-Cheat Suite</label>
                            <p className="text-xs text-neutral-500 mt-0.5">Block right-click, copy-paste, and keyboard shortcuts during exams</p>
                        </div>
                        <button
                            onClick={() => setEnforceAntiCheat(!enforceAntiCheat)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${enforceAntiCheat ? "bg-indigo-600" : "bg-neutral-300"}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${enforceAntiCheat ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                    </div>
                    <div className="px-6 py-5 flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-neutral-900">Fullscreen Enforcement</label>
                            <p className="text-xs text-neutral-500 mt-0.5">Require fullscreen mode for exam submissions</p>
                        </div>
                        <button
                            onClick={() => setRequireFullscreen(!requireFullscreen)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${requireFullscreen ? "bg-indigo-600" : "bg-neutral-300"}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${requireFullscreen ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                    </div>
                    <div className="px-6 py-5 flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-neutral-900">Auto-Grading</label>
                            <p className="text-xs text-neutral-500 mt-0.5">Automatically grade multiple-choice questions on submit</p>
                        </div>
                        <button
                            onClick={() => setAutoGrading(!autoGrading)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${autoGrading ? "bg-indigo-600" : "bg-neutral-300"}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${autoGrading ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-red-100 bg-red-50/30">
                    <h2 className="text-base font-medium text-red-900">Danger Zone</h2>
                    <p className="text-xs text-red-500 mt-0.5">Irreversible actions</p>
                </div>
                <div className="px-6 py-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-neutral-900">Sign Out</p>
                        <p className="text-xs text-neutral-500 mt-0.5">End your current session and return to the login page</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-indigo-200 transition-all"
                >
                    Save Settings
                </button>
            </div>
        </div>
    );
}
