"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import FdbLogo from "@/components/FdbLogo";
import { fetcher } from "@/lib/api";

export default function RegisterForm() {
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
            setError(t("register.error.passwordMismatch") || "Mật khẩu xác nhận không khớp");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            await fetcher("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password,
                    role: "student"
                })
            });

            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);

        } catch (err: any) {
            setError(err.message || t("register.error.failed") || "Đăng ký thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex font-sans">
            {/* Left side: Image placeholder */}
            <div className="hidden lg:block lg:w-1/2 relative bg-[#1e3a8a]">
                <Image
                    src="/login-bg.jpg"
                    alt="Register Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Right side: Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-32 relative bg-[var(--bg-primary)]">
                {/* Toggles top-right */}


                <div className="w-full max-w-sm mx-auto sm:max-w-md animate-fade-in text-center lg:text-left">
                    <div className="lg:hidden mb-8">
                        <FdbLogo className="text-4xl" />
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-2">
                        {t("register.title") || "Đăng ký tài khoản"}
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-8">
                        {t("register.subtitle") || "Tạo tài khoản thí sinh mới để tham gia thi"}
                    </p>

                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{t("register.success") || "Tạo tài khoản thành công!"}</h3>
                            <p className="text-sm font-medium text-[var(--text-secondary)]">{t("register.redirecting") || "Đang chuyển hướng đến trang đăng nhập..."}</p>
                        </div>
                    ) : (
                        <form className="space-y-6 text-left" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-3.5 rounded-xl text-sm font-medium bg-red-50 text-red-600 border border-red-200 shadow-sm dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">{t("login.username") || "Tài khoản (MSSV)"}</label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full appearance-none rounded-xl border border-[var(--border-default)] px-4 py-3.5 sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/40 focus:border-[#1e3a8a] bg-[var(--surface-card)] text-[var(--text-primary)] shadow-sm"
                                    placeholder="Mã số sinh viên"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">{t("login.password") || "Mật khẩu"}</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-xl border border-[var(--border-default)] px-4 py-3.5 sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/40 focus:border-[#1e3a8a] bg-[var(--surface-card)] text-[var(--text-primary)] shadow-sm"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">{t("register.confirmPassword") || "Xác nhận mật khẩu"}</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-xl border border-[var(--border-default)] px-4 py-3.5 sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/40 focus:border-[#1e3a8a] bg-[var(--surface-card)] text-[var(--text-primary)] shadow-sm"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#1e3a8a] hover:bg-[#152960] focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (t("app.processing") || "Đang xử lý...") : (t("app.register") || "Đăng ký")}
                                </button>
                            </div>

                            <div className="text-sm text-center pt-2">
                                <span className="text-[var(--text-secondary)] font-medium">{t("register.hasAccount") || "Đã có tài khoản?"} </span>
                                <Link href="/login" className="font-bold hover:underline transition-colors text-[#1e3a8a]">
                                    {t("app.signIn") || "Đăng nhập ngay"}
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
