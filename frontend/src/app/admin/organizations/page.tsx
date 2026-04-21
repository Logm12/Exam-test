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

    const [showModal, setShowModal] = useState(false);
    const [newOrg, setNewOrg] = useState({ name: "", description: "" });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const id = orgs.length + 1;
        const created_at = new Date().toISOString().split('T')[0];
        setOrgs([...orgs, { id, ...newOrg, created_at }]);
        setShowModal(false);
        setNewOrg({ name: "", description: "" });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in font-sans pb-20 w-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    Đơn vị tổ chức
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Quản lý cơ cấu và phân quyền kiểm soát.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Controls */}
                <div className="md:col-span-4 space-y-6">
                    <button 
                        onClick={() => setShowModal(true)}
                        className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white text-sm font-semibold py-3 px-6 rounded-md shadow-sm transition-colors flex justify-center items-center gap-2"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Tạo đơn vị mới
                    </button>
                    <div className="bg-white p-6 rounded-lg shadow-[var(--shadow-sm)] border border-[var(--border-default)] dark:bg-[#1f1f1f]">
                        <h3 className="font-bold text-[var(--text-primary)] mb-4">Trạng thái hệ thống</h3>
                        <div className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
                            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                                <span>Đơn vị đang hoạt động</span>
                                <span className="text-[var(--text-primary)] font-bold">{orgs.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Mạng</span>
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
                                <span className="text-xs text-[var(--text-muted)]">Đã tạo: {org.created_at}</span>
                                <button className="text-sm font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] flex items-center gap-1">
                                    Cấu hình
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        </div>
                    ))}

                    {orgs.length === 0 && (
                        <div className="text-center p-12 bg-white border border-dashed border-gray-300 rounded-lg shadow-[var(--shadow-sm)] dark:bg-[#1f1f1f] dark:border-gray-700">
                            <span className="text-sm font-medium text-[var(--text-secondary)]">Không có đơn vị nào</span>
                        </div>
                    )}
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1f1f1f] rounded-lg p-6 max-w-md w-full shadow-xl border border-[var(--border-default)]">
                        <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Thêm đơn vị mới</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[var(--text-secondary)]">Tên đơn vị</label>
                                <input 
                                    name="name"
                                    type="text" 
                                    required
                                    className="w-full px-4 py-2 border rounded-md bg-[var(--bg-primary)] border-[var(--border-default)] text-[var(--text-primary)]"
                                    value={newOrg.name}
                                    onChange={e => setNewOrg({...newOrg, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[var(--text-secondary)]">Mô tả</label>
                                <textarea 
                                    name="description"
                                    rows={3}
                                    className="w-full px-4 py-2 border rounded-md bg-[var(--bg-primary)] border-[var(--border-default)] text-[var(--text-primary)]"
                                    value={newOrg.description}
                                    onChange={e => setNewOrg({...newOrg, description: e.target.value})}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-slate-800"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium bg-[var(--accent-primary)] text-white rounded-md hover:bg-[var(--accent-primary-hover)]"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
