"use client";
import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import FdbLogo from "@/components/FdbLogo";

function LoginForm() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const errorParam = searchParams.get("error");
    const { t } = useLanguage();

    const [role, setRole] = useState<"student" | "admin">("student");

    useEffect(() => {
        if (status === "authenticated") {
            // "vào trang đăng nhập là kể cả student hay admin đều phải login"
            // So if they somehow land on /login while authenticated, we can optionally sign them out
            // signOut({ redirect: false });
            // Alternatively, we just do not auto-redirect them, letting them see the login form.
        }
    }, [status]);

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
                    sizes="50vw"
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
