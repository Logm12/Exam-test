"use client";
import { useState, useEffect } from "react";
import { fetcher } from "@/lib/api";

interface UserAccount {
    id: number;
    username: string;
    role: string;
}

export default function StudentsManagementPage() {
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
            setError(err.message || "Failed to load users");
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
            setUsers(users.map((u) => (u.id === user.id ? { ...u, role: editRole } : u)));
            setEditingId(null);
        } catch (err: any) {
            alert(err.message || "Failed to update user");
        }
    };

    const handleDelete = async (id: number, username: string) => {
        if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) return;
        try {
            await fetcher(`/users/${id}`, { method: "DELETE" });
            setUsers(users.filter((u) => u.id !== id));
        } catch (err: any) {
            alert(err.message || "Failed to delete user");
        }
    };

    const filteredUsers = filter === "all" ? users : users.filter((u) => u.role === filter);
    const studentCount = users.filter((u) => u.role === "student").length;
    const adminCount = users.filter((u) => u.role === "admin").length;

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                    Students & Accounts
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                    Manage user accounts and role assignments.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm">
                    <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Users</h3>
                    <p className="text-2xl font-bold text-neutral-900 mt-2">{users.length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm">
                    <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Students</h3>
                    <p className="text-2xl font-bold text-emerald-600 mt-2">{studentCount}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm">
                    <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Administrators</h3>
                    <p className="text-2xl font-bold text-indigo-600 mt-2">{adminCount}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1 w-fit">
                {(["all", "student", "admin"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${filter === tab
                                ? "bg-white text-neutral-900 shadow-sm"
                                : "text-neutral-500 hover:text-neutral-700"
                            }`}
                    >
                        {tab === "all" ? `All (${users.length})` : tab === "student" ? `Students (${studentCount})` : `Admins (${adminCount})`}
                    </button>
                ))}
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">{error}</div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-neutral-300 border-t-indigo-600 rounded-full animate-spin" />
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-neutral-200 rounded-2xl">
                    <p className="text-neutral-500 text-sm">No users found</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                <th className="px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-neutral-400 font-mono">#{user.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-neutral-900 text-sm">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === user.id ? (
                                            <div className="flex items-center space-x-2">
                                                <select
                                                    value={editRole}
                                                    onChange={(e) => setEditRole(e.target.value)}
                                                    className="text-xs border border-neutral-300 rounded-lg px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                >
                                                    <option value="student">Student</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <button
                                                    onClick={() => saveRole(user)}
                                                    className="text-xs font-medium text-emerald-600 hover:text-emerald-800"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="text-xs font-medium text-neutral-400 hover:text-neutral-600"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.role === "admin"
                                                        ? "bg-indigo-50 text-indigo-700"
                                                        : "bg-neutral-100 text-neutral-600"
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
                                                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                                            >
                                                Edit Role
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id, user.username)}
                                                className="text-xs font-medium text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
