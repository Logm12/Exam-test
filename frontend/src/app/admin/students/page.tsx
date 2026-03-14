"use client";
import React, { useState, useEffect } from "react";
import { fetcher } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

interface UserAccount {
    id: number;
    username: string;
    role: string;
}

export default function StudentsManagementPage() {
    const { t } = useLanguage();
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editRole, setEditRole] = useState("");
    const [filter, setFilter] = useState<"all" | "student" | "admin">("all");

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const data = await fetcher("/users/");
            setUsers(data);
        } catch (err: any) {
            setError(err.message || "Lỗi tải dữ liệu người dùng");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const startEdit = (user: UserAccount) => {
        setEditingId(user.id);
        setEditRole(user.role);
    };

    const saveRole = async (user: UserAccount) => {
        try {
            await fetcher(`/users/${user.id}`, {
                method: "PUT",
                body: JSON.stringify({ username: user.username, role: editRole }),
            });
            setUsers(users.map((u: UserAccount) => (u.id === user.id ? { ...u, role: editRole } : u)));
            setEditingId(null);
        } catch (err: any) {
            alert(err.message || "Lỗi cập nhật người dùng");
        }
    };

    const handleDelete = async (id: number, username: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xoá người dùng "${username}"? Hành động này không thể hoàn tác.`)) return;
        try {
            await fetcher(`/users/${id}`, { method: "DELETE" });
            setUsers(users.filter((u: UserAccount) => u.id !== id));
        } catch (err: any) {
            alert(err.message || "Lỗi xoá người dùng");
        }
    };

    const filteredUsers = filter === "all" ? users : users.filter((u: UserAccount) => u.role === filter);
    const studentCount = users.filter((u: UserAccount) => u.role === "student").length;
    const adminCount = users.filter((u: UserAccount) => u.role === "admin").length;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in font-sans pb-20 w-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    Thí sinh & Tài khoản
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Quản lý tài khoản người dùng và phân quyền.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-[var(--shadow-sm)] border border-[var(--border-default)] dark:bg-[#1f1f1f]">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Tổng số tài khoản</h3>
                        <div className="w-8 h-8 rounded bg-gray-50 text-gray-500 flex items-center justify-center dark:bg-gray-800">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{users.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-[var(--shadow-sm)] border border-[var(--border-default)] dark:bg-[#1f1f1f]">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Thí sinh</h3>
                        <div className="w-8 h-8 rounded bg-green-50 text-green-600 flex items-center justify-center dark:bg-green-900/30 dark:text-green-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{studentCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-[var(--shadow-sm)] border border-[var(--border-default)] dark:bg-[#1f1f1f]">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Quản trị viên</h3>
                        <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-900/30 dark:text-blue-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{adminCount}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-md p-1 w-fit mb-6 border border-gray-200 dark:border-gray-700">
                {(["all", "student", "admin"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded text-xs font-semibold transition-all capitalize ${filter === tab
                            ? "bg-white text-[var(--accent-primary)] shadow-sm dark:bg-gray-700 dark:text-blue-400"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        {tab === "all" ? `Tất cả (${users.length})` : tab === "student" ? `Khoá thi (${studentCount})` : `Quản trị (${adminCount})`}
                    </button>
                ))}
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-200 mb-6 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-[var(--accent-primary)] rounded-full animate-spin dark:border-gray-700" />
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-lg shadow-[var(--shadow-sm)] dark:bg-[#1f1f1f] dark:border-gray-700">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-50 dark:bg-gray-800">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="17" y1="8" x2="23" y2="14"></line><line x1="23" y1="8" x2="17" y2="14"></line></svg>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm font-medium">Không tìm thấy người dùng</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-[var(--border-default)] shadow-[var(--shadow-sm)] overflow-hidden dark:bg-[#1f1f1f]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border-default)] bg-gray-50/50 dark:bg-gray-800/50">
                                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Tên đăng nhập</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Vai trò</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-default)]">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors group dark:hover:bg-gray-800">
                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-mono">#{user.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-[var(--text-primary)] text-sm">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingId === user.id ? (
                                                <div className="flex items-center space-x-2">
                                                    <select
                                                        value={editRole}
                                                        onChange={(e: any) => setEditRole(e.target.value)}
                                                        className="text-xs bg-white border border-gray-300 rounded-md px-2.5 py-1.5 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                    >
                                                        <option value="student">Thí sinh</option>
                                                        <option value="admin">Quản trị viên</option>
                                                    </select>
                                                    <button
                                                        onClick={() => saveRole(user)}
                                                        className="text-xs font-semibold text-green-600 hover:text-green-700 bg-green-50 px-3 py-1.5 rounded border border-green-200 dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-400 dark:hover:text-green-300"
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="text-xs font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-1.5 rounded border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                                    >
                                                        Huỷ
                                                    </button>
                                                </div>
                                            ) : (
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold border ${user.role === "admin"
                                                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30"
                                                        : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => startEdit(user)}
                                                    className="text-xs font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 dark:hover:bg-blue-900/30 dark:hover:border-blue-800/50"
                                                >
                                                    Sửa phân quyền
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id, user.username)}
                                                    className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:border-red-800/50"
                                                >
                                                    Xoá
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
