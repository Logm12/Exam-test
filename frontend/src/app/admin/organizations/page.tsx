"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function OrganizationsLab() {
    const { t } = useLanguage();
    const [isPending, startTransition] = useTransition();
    const [orgs, setOrgs] = useState([
        { id: 1, name: "Department of Mathematics", description: "Core algebra and calculus", created_at: "2026-02-25" },
        { id: 2, name: "Engineering Faculty", description: "Physics and Software Systems", created_at: "2026-02-24" }
    ]);

    return (
        <div className="space-y-6 animate-fade-in font-sans pb-20">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    Org.Units
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Structural isolation and access control boundaries. Strict separation enforced.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Controls */}
                <div className="md:col-span-4 space-y-6">
                    <button className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white text-sm font-semibold py-3 px-6 rounded-md shadow-sm transition-colors flex justify-center items-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Provision Unit
                    </button>
                    <div className="bg-white p-6 rounded-lg shadow-[var(--shadow-sm)] border border-[var(--border-default)] dark:bg-[#1f1f1f]">
                        <h3 className="font-bold text-[var(--text-primary)] mb-4">System Status</h3>
                        <div className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
                            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                                <span>Active Units</span>
                                <span className="text-[var(--text-primary)] font-bold">{orgs.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Network</span>
                                <span className="text-green-600 flex items-center gap-2 font-medium dark:text-green-400">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> OK
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data List */}
                <div className="md:col-span-8 flex flex-col gap-4">
                    {orgs.map(org => (
                        <div key={org.id} className="group relative bg-white border border-[var(--border-default)] rounded-lg p-6 hover:shadow-md transition-shadow dark:bg-[#1f1f1f]">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">{org.name}</h2>
                                <span className="text-xs text-[var(--text-muted)] font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100 dark:bg-gray-800 dark:border-gray-700">ID: {org.id.toString().padStart(4, '0')}</span>
                            </div>
                            <p className="text-[var(--text-secondary)] text-sm mb-6 whitespace-pre-wrap">{org.description}</p>
                            <div className="flex justify-between items-center border-t border-[var(--border-subtle)] pt-4">
                                <span className="text-xs text-[var(--text-muted)]">Deployed: {org.created_at}</span>
                                <button className="text-sm font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] flex items-center gap-1">
                                    Configure
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        </div>
                    ))}

                    {orgs.length === 0 && (
                        <div className="text-center p-12 bg-white border border-dashed border-gray-300 rounded-lg shadow-[var(--shadow-sm)] dark:bg-[#1f1f1f] dark:border-gray-700">
                            <span className="text-sm font-medium text-[var(--text-secondary)]">No deployed units</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
