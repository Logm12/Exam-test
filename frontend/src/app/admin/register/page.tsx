"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { fetcher } from "@/lib/api";

export default function AdminRegisterPage() {
    const router = useRouter();
    const { t } = useLanguage();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError(t("register.error.passwordMismatch") || "Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Note: In a real system, you'd likely want a secret key or 
            // explicit admin permission check to register another admin.
            await fetcher("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password,
                    role: "admin" // Create as admin
                })
            });

            setSuccess(true);
            setTimeout(() => {
                router.push("/admin/login");
            }, 2000);

        } catch (err: any) {
            setError(err.message || t("admin.login.error.system"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            {/* Toggles top-right */}
            <div className="absolute top-6 right-6 flex items-center space-x-3">
                <ThemeToggle />
                <LanguageToggle />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in text-center relative z-10">
                <div className="inline-flex justify-center items-center w-14 h-14 rounded-2xl mb-6 shadow-lg border-2 border-[var(--accent-primary)] bg-[var(--bg-secondary)]">
                    <span className="text-[var(--accent-primary)] font-bold text-xl tracking-tighter">EO</span>
                </div>
                <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                    {t("admin.register.title") || "Create Admin Account"}
                </h2>
                <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
                    {t("admin.register.subtitle") || "Provision a new admin account"}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="surface-card py-8 px-4 sm:px-10 border-t-4 border-t-[var(--accent-primary)] shadow-2xl">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(5, 150, 105, 0.1)' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--status-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">{t("admin.register.success") || "Admin account created!"}</h3>
                            <p className="text-sm text-[var(--text-secondary)]">{t("register.redirecting") || "Redirecting to login..."}</p>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t("admin.login.username")}</label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full appearance-none rounded-lg border px-3 py-2 sm:text-sm transition-all focus:outline-none focus:ring-2"
                                    style={{
                                        background: 'var(--bg-primary)',
                                        borderColor: 'var(--border-default)',
                                        color: 'var(--text-primary)'
                                    }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-glow)'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
                                    placeholder="admin_new"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t("admin.login.password")}</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-lg border px-3 py-2 sm:text-sm transition-all focus:outline-none focus:ring-2"
                                    style={{
                                        background: 'var(--bg-primary)',
                                        borderColor: 'var(--border-default)',
                                        color: 'var(--text-primary)'
                                    }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-glow)'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t("admin.register.confirmPassword") || "Confirm Password"}</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-lg border px-3 py-2 sm:text-sm transition-all focus:outline-none focus:ring-2"
                                    style={{
                                        background: 'var(--bg-primary)',
                                        borderColor: 'var(--border-default)',
                                        color: 'var(--text-primary)'
                                    }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-glow)'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="accent-btn flex w-full justify-center py-2.5 px-4 disabled:opacity-50"
                                >
                                    {isLoading ? t("app.processing") : (t("admin.register.submit") || "Create Admin")}
                                </button>
                            </div>

                            <div className="text-sm text-center pt-2">
                                <span className="text-[var(--text-secondary)]">{t("admin.register.hasAccount") || "Already an admin?"} </span>
                                <Link href="/admin/login" className="font-medium hover:underline transition-colors" style={{ color: 'var(--accent-primary)' }}>
                                    {t("admin.register.switchLogin") || "Log in now"}
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Background decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[var(--accent-glow)] rounded-full blur-[100px] -z-10 opacity-30 pointer-events-none"></div>
        </div>
    );
}
