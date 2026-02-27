"use client";

import { useAntiCheat } from "@/hooks/useAntiCheat";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentExamWrapper({ children }: { children: React.ReactNode }) {
    // Use the Strict Anti-Cheat Hook
    const { isFullscreen, violationCount, requestFullscreen } = useAntiCheat({
        disableContextMenu: true,
        disableCopyPaste: true,
        disableShortcuts: true,
        requireFullscreen: true
    });

    const [hasStarted, setHasStarted] = useState(false);
    const router = useRouter();

    // If a student accrues too many violations, boot them.
    useEffect(() => {
        if (violationCount >= 3) {
            alert("Academic Integrity Violation Detected 3 Times. Your exam has been voided.");
            router.push("/login?error=CheatingDetected");
        }
    }, [violationCount, router]);

    if (!hasStarted) {
        return (
            <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-neutral-800 border border-neutral-700 p-8 rounded-2xl shadow-xl text-center space-y-6">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Secure Exam Environment</h1>
                    <p className="text-sm text-neutral-400">
                        This exam requires fullscreen access and strictly prohibits tab-switching, right-clicking, or copying.
                    </p>
                    <div className="bg-neutral-900/50 p-4 rounded-lg text-left text-xs text-neutral-400 space-y-2">
                        <p>• You have {3 - violationCount} strikes remaining before automatic failure.</p>
                        <p>• Screen visibility changes are logged securely.</p>
                        <p>• Unauthorized keybinds (Ctrl+C, Alt+Tab) are intercepted.</p>
                    </div>
                    <button
                        onClick={() => {
                            requestFullscreen();
                            setHasStarted(true);
                        }}
                        className="w-full bg-neutral-50 text-neutral-900 hover:bg-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg"
                    >
                        I Agree, Start Exam in Fullscreen
                    </button>
                </div>
            </div>
        );
    }

    // Display the Exam interface, appending an intrusive overlay if they drop out of Fullscreen
    return (
        <div className="min-h-screen relative">
            {!isFullscreen && hasStarted && (
                <div className="fixed inset-0 z-50 bg-red-600/90 backdrop-blur-sm flex items-center justify-center p-8">
                    <div className="bg-white p-8 rounded-2xl max-w-lg w-full text-center shadow-2xl">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Fullscreen Required</h2>
                        <p className="text-neutral-700 mb-6">You have exited the designated secure environment. Please return to fullscreen to continue your exam.</p>
                        <button
                            onClick={requestFullscreen}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all w-full"
                        >
                            Return to Exam
                        </button>
                    </div>
                </div>
            )}

            {/* Violations Counter Visual Feedback */}
            {violationCount > 0 && (
                <div className="fixed top-4 right-4 z-40 bg-red-100 text-red-800 border-l-4 border-red-500 px-4 py-3 shadow-lg rounded-r flex items-center space-x-3">
                    <span className="font-bold">Warning</span>
                    <span className="text-sm">Strikes: {violationCount} / 3</span>
                </div>
            )}

            <div className={!isFullscreen ? "blur-sm pointer-events-none" : ""}>
                {children}
            </div>
        </div>
    );
}
