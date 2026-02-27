"use client";

import { useOptimistic, startTransition } from "react";

type ThemeConfig = {
    primary_color: string;
    surface_color: string;
    font_family: string;
    background_url?: string;
};

interface LivePreviewProps {
    initialTheme: ThemeConfig;
}

export default function LivePreview({ initialTheme }: LivePreviewProps) {
    // We use optimistic state to instantly reflect changes
    const [optimisticTheme, addOptimisticTheme] = useOptimistic(
        initialTheme,
        (state: ThemeConfig, newTheme: ThemeConfig) => ({ ...state, ...newTheme })
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
            {/* Editor Panel */}
            <div className="lg:col-span-1 bg-white border border-neutral-200 p-8 flex flex-col gap-8 font-mono text-sm shadow-sm">
                <div>
                    <h3 className="font-bold text-neutral-900 tracking-tight uppercase mb-6 border-b border-neutral-200 pb-4">
                        Aesthetic Configuration
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-neutral-500 mb-2 font-semibold">Primary Accent</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={optimisticTheme.primary_color}
                                    onChange={(e) => startTransition(() => addOptimisticTheme({ ...optimisticTheme, primary_color: e.target.value }))}
                                    className="w-10 h-10 cursor-pointer border-0 p-0 rounded-none bg-transparent"
                                />
                                <span className="text-neutral-800 tracking-wider bg-neutral-100 px-3 py-1">{optimisticTheme.primary_color}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-neutral-500 mb-2 font-semibold">Base Surface</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={optimisticTheme.surface_color}
                                    onChange={(e) => startTransition(() => addOptimisticTheme({ ...optimisticTheme, surface_color: e.target.value }))}
                                    className="w-10 h-10 cursor-pointer border-0 p-0 rounded-none bg-transparent"
                                />
                                <span className="text-neutral-800 tracking-wider bg-neutral-100 px-3 py-1">{optimisticTheme.surface_color}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-neutral-500 mb-2 font-semibold">Typography System</label>
                            <select
                                value={optimisticTheme.font_family}
                                onChange={(e) => startTransition(() => addOptimisticTheme({ ...optimisticTheme, font_family: e.target.value }))}
                                className="w-full border-2 border-neutral-200 bg-transparent p-3 outline-none focus:border-neutral-900 transition-colors cursor-pointer"
                            >
                                <option value="Space Grotesk">Space Grotesk (Default)</option>
                                <option value="Inter">Inter (System)</option>
                                <option value="JetBrains Mono">JetBrains Mono</option>
                            </select>
                        </div>

                        <button className="w-full bg-neutral-900 text-white font-bold py-4 mt-8 hover:bg-neutral-800 transition-colors uppercase tracking-[0.2em] text-xs">
                            Commit Design
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Panel */}
            <div
                className="lg:col-span-2 relative overflow-hidden border border-neutral-200 flex items-center justify-center p-8 transition-colors duration-300"
                style={{
                    "--exam-primary": optimisticTheme.primary_color,
                    backgroundColor: optimisticTheme.surface_color,
                    fontFamily: optimisticTheme.font_family === 'Space Grotesk' ? 'var(--font-space-grotesk), sans-serif' :
                        optimisticTheme.font_family === 'JetBrains Mono' ? 'var(--font-jetbrains-mono), monospace' : 'sans-serif'
                } as React.CSSProperties}
            >
                {/* Minimalist Grid Pattern Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                <div className="absolute top-6 left-6 text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest z-10 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full hidden md:block" style={{ backgroundColor: 'var(--exam-primary)' }}></span>
                    Live Environment
                </div>

                {/* Mock Exam UI Container */}
                <div className="w-full max-w-2xl bg-white p-12 shadow-2xl relative z-10">
                    <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: 'var(--exam-primary)' }}></div>

                    <header className="flex justify-between items-start mb-16 border-b border-neutral-100 pb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-neutral-900 mb-2">
                                Physics Qualification
                            </h1>
                            <p className="text-neutral-400 text-sm font-mono tracking-wider uppercase">— Question 04 of 20</p>
                        </div>
                        <div className="font-mono text-2xl tracking-tighter font-semibold" style={{ color: 'var(--exam-primary)' }}>
                            45:00
                        </div>
                    </header>

                    <main className="space-y-10">
                        <h2 className="text-xl font-medium text-neutral-900 leading-relaxed max-w-[90%]">
                            What is the fundamental principle behind the uncertainty of measuring both position and momentum of a particle simultaneously?
                        </h2>

                        <div className="space-y-4">
                            {[
                                "Heisenberg's Uncertainty Principle",
                                "Pauli Exclusion Principle",
                                "Schrödinger's Cat Paradox",
                                "Bohr's Complementarity"
                            ].map((option, i) => (
                                <label key={i} className="flex items-center gap-5 p-5 border border-neutral-200 hover:border-neutral-900 cursor-pointer transition-all duration-200 group bg-neutral-50/50 hover:bg-white text-neutral-600 hover:text-neutral-900">
                                    <div className="w-6 h-6 border-2 border-neutral-300 group-hover:border-neutral-900 flex items-center justify-center transition-colors">
                                        {i === 0 && <div className="w-3 h-3" style={{ backgroundColor: 'var(--exam-primary)' }} />}
                                    </div>
                                    <span className="font-medium">{option}</span>
                                </label>
                            ))}
                        </div>
                    </main>

                    <footer className="mt-16 flex justify-between items-center pt-8 border-t border-neutral-100">
                        <button className="text-neutral-400 font-bold hover:text-neutral-900 transition-colors uppercase tracking-widest text-xs px-2">
                            &larr; Previous
                        </button>
                        <button
                            className="text-white font-bold px-10 py-4 tracking-[0.15em] uppercase text-xs hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: 'var(--exam-primary)' }}
                        >
                            Next Stage &rarr;
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    );
}
