"use client";

import { useState, useEffect, useTransition } from "react";

export default function OrganizationsLab() {
    const [isPending, startTransition] = useTransition();
    const [orgs, setOrgs] = useState([
        { id: 1, name: "Department of Mathematics", description: "Core algebra and calculus", created_at: "2026-02-25" },
        { id: 2, name: "Engineering Faculty", description: "Physics and Software Systems", created_at: "2026-02-24" }
    ]);

    return (
        <div className="min-h-screen bg-[var(--exam-surface,#F8F9FA)] font-sans p-8 md:p-16">
            <header className="max-w-4xl mb-24 border-b-2 border-neutral-900 pb-8">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-neutral-900" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                    Org.Units
                </h1>
                <p className="mt-6 text-xl text-neutral-500 max-w-xl" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                    Structural isolation and access control boundaries. Strict separation enforced.
                </p>
            </header>

            <div className="max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Controls */}
                    <div className="md:col-span-4 space-y-8">
                        <button className="w-full bg-neutral-900 text-white uppercase tracking-widest text-sm py-4 px-6 hover:bg-neutral-800 transition-colors border border-transparent" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                            + Provision Unit
                        </button>
                        <div className="bg-white p-6 border border-neutral-200 shadow-sm">
                            <h3 className="font-bold text-neutral-900 mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>System Status</h3>
                            <div className="flex flex-col gap-3 text-xs text-neutral-500" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                                <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                                    <span>Active Units</span>
                                    <span className="text-neutral-900 font-bold">{orgs.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Network</span>
                                    <span className="text-green-600 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> OK
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data List */}
                    <div className="md:col-span-8 flex flex-col gap-6">
                        {orgs.map(org => (
                            <div key={org.id} className="group relative bg-white border border-neutral-200 p-8 hover:border-neutral-900 transition-colors">
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>{org.name}</h2>
                                    <span className="text-xs text-neutral-400" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>ID: {org.id.toString().padStart(4, '0')}</span>
                                </div>
                                <p className="text-neutral-600 mb-8 whitespace-pre-wrap">{org.description}</p>
                                <div className="flex justify-between items-center border-t border-neutral-100 pt-6">
                                    <span className="text-xs text-neutral-400" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Deployed: {org.created_at}</span>
                                    <button className="text-sm font-bold text-neutral-900 hover:opacity-70 uppercase tracking-wider" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Configure -{'>'}</button>
                                </div>
                            </div>
                        ))}

                        {orgs.length === 0 && (
                            <div className="text-center p-12 border border-dashed border-neutral-300 text-neutral-500">
                                <span className="uppercase tracking-widest text-sm" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>No deployed units</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
