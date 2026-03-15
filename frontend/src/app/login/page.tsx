"use client";
import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";

function LoginForm() {
    const router = useRouter();
    const { status } = useSession();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const errorParam = searchParams.get("error");
    const { t } = useLanguage();

    const [role, setRole] = useState<"student" | "admin">("student");

    useEffect(() => {
        if (status === "authenticated") {
            router.push(callbackUrl === "/login" || callbackUrl === "/admin/login" ? (role === "admin" ? "/admin" : "/dashboard") : callbackUrl);
        }
    }, [status, router, callbackUrl, role]);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(
        errorParam === "AccessDenied"
            ? t("login.error.accessDenied") || "Truy cập bị từ chối."
            : errorParam === "CredentialsSignin"
                ? t("login.error.invalid") || "Tài khoản hoặc mật khẩu không đúng."
                : errorParam === "Invalid role selected"
                    ? "Sai vai trò. Vui lòng chọn lại vai trò đăng nhập."
                    : errorParam ? decodeURIComponent(errorParam) : ""
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                username,
                password,
                role,
                redirect: false,
            });

            if (result?.error) {
                if (result.error === "Invalid role selected") {
                    setError("Sai vai trò. Vui lòng chọn lại vai trò đăng nhập.");
                } else if (result.error === "CredentialsSignin") {
                    setError(t("login.error.invalid") || "Tài khoản hoặc mật khẩu không đúng.");
                } else {
                    setError(result.error);
                }
                return;
            }

            let targetUrl = role === "admin" ? "/admin" : "/dashboard";
            if (callbackUrl && !callbackUrl.includes('/login') && callbackUrl !== '/') {
                targetUrl = callbackUrl;
            }
            router.push(targetUrl);
            router.refresh();
        } catch (err: any) {
            setError(err.message || t("login.error.failed") || "Đăng nhập thất bại.");
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
                    alt="Login Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Right side: Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-32 relative bg-[var(--bg-primary)]">
                {/* Toggles top-right */}
                <div className="absolute top-6 right-6 flex items-center space-x-3">
                    <ThemeToggle />
                    <LanguageToggle />
                </div>

                <div className="w-full max-w-sm mx-auto sm:max-w-md animate-fade-in text-center lg:text-left">
                    <div className="lg:hidden inline-flex items-center justify-center w-16 h-16 bg-[#1e3a8a] text-white rounded-2xl mb-8 shadow-xl">
                        <span className="font-black text-2xl">FDB</span>
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-2">
                        Chào mừng!
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-8">
                        Vui lòng chọn vai trò để đăng nhập vào hệ thống
                    </p>

                    {/* Role Selection Tabs */}
                    <div className="flex bg-[var(--bg-tertiary)] p-1.5 rounded-xl mb-8 shadow-inner border border-[var(--border-subtle)]">
                        <button
                            type="button"
                            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${role === 'student' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'}`}
                            onClick={() => { setRole("student"); setUsername(""); setPassword(""); setError(""); }}
                        >
                            Thí sinh
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${role === 'admin' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'}`}
                            onClick={() => { setRole("admin"); setUsername(""); setPassword(""); setError(""); }}
                        >
                            Quản trị viên
                        </button>
                    </div>

                    <form className="space-y-6 text-left" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3.5 rounded-xl text-sm font-medium bg-red-50 text-red-600 border border-red-200 shadow-sm dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">{t("login.username") || "Tài khoản"}</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full appearance-none rounded-xl border border-[var(--border-default)] px-4 py-3.5 sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/40 focus:border-[#1e3a8a] bg-[var(--surface-card)] text-[var(--text-primary)] shadow-sm"
                                placeholder={role === "admin" ? "" : "Mã số sinh viên (MSSV)"}
                            />
                        </div>

                        <div>
                            <label className="flex items-center justify-between text-sm font-semibold text-[var(--text-secondary)] mb-2">
                                <span>{t("login.password") || "Mật khẩu"}</span>
                                <Link href="#" className="font-bold text-[#f59e0b] hover:text-[#d97706] transition-colors focus:outline-none focus:underline">Quên mật khẩu?</Link>
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full appearance-none rounded-xl border border-[var(--border-default)] px-4 py-3.5 sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/40 focus:border-[#1e3a8a] bg-[var(--surface-card)] text-[var(--text-primary)] shadow-sm"
                                placeholder=""
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-[var(--border-default)] text-[#1e3a8a] focus:ring-[#1e3a8a] bg-[var(--bg-primary)]"
                            />
                            <label htmlFor="remember-me" className="ml-2.5 block text-sm font-medium text-[var(--text-secondary)] cursor-pointer select-none">
                                Ghi nhớ đăng nhập
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#1e3a8a] hover:bg-[#152960] focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (t("app.processing") || "Đang xử lý...") : "Đăng nhập"}
                            </button>
                        </div>

                        {role === "student" && (
                            <div className="text-sm text-center pt-2">
                                <span className="text-[var(--text-secondary)] font-medium">{t("login.noAccount")} </span>
                                <Link href="/register" className="font-bold hover:underline transition-colors text-[#1e3a8a]">
                                    {t("login.switchRegister") || "Đăng ký ngay"}
                                </Link>
                            </div>
                        )}
                    </form>

                    {role === "student" && (
                        <div className="mt-8 pt-8 border-t border-[var(--border-subtle)]">
                            <div className="relative flex justify-center text-sm -mt-11 mb-6">
                                <span className="px-3 bg-[var(--bg-primary)] text-[var(--text-muted)] font-medium">Hoặc</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => signIn("google", { callbackUrl })}
                                    className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] px-4 py-3 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </button>

                                <button
                                    onClick={() => signIn("zalo", { callbackUrl })}
                                    className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-transparent px-4 py-3 text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0068FF]/50 transition-all cursor-pointer bg-[#0068FF] hover:bg-[#005BFF] hover:shadow-md"
                                >
                                    <span className="font-extrabold text-lg tracking-tighter mr-0.5 -mt-0.5">Zalo</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)]" />}>
            <LoginForm />
        </Suspense>
    );
}
