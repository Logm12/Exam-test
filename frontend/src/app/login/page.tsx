"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { useEffect } from "react";

function LoginForm() {
    const router = useRouter();
    const { status } = useSession();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const errorParam = searchParams.get("error");
    const { t } = useLanguage();

    useEffect(() => {
        if (status === "authenticated") {
            router.push(callbackUrl === "/login" ? "/dashboard" : callbackUrl);
        }
    }, [status, router, callbackUrl]);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(
        errorParam === "AccessDenied"
            ? t("login.error.accessDenied")
            : errorParam === "CredentialsSignin"
                ? t("login.error.invalid")
                : ""
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(t("login.error.invalid"));
                return;
            }

            router.push(callbackUrl === "/login" ? "/dashboard" : callbackUrl);
            router.refresh();
        } catch (err: any) {
            setError(err.message || t("login.error.failed"));
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
                <div className="inline-flex justify-center items-center w-14 h-14 rounded-2xl mb-6 shadow-lg" style={{ background: 'var(--accent-gradient)' }}>
                    <span className="text-white font-bold text-2xl tracking-tighter">EO</span>
                </div>
                <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                    {t("login.title")}
                </h2>
                <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
                    {t("login.subtitle")}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="surface-card py-8 px-4 sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t("login.username")}</label>
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
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t("login.password")}</label>
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
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="accent-btn flex w-full justify-center py-2.5 px-4 disabled:opacity-50"
                            >
                                {isLoading ? t("app.processing") : t("app.signIn")}
                            </button>
                        </div>

                        <div className="text-sm text-center">
                            <span className="text-[var(--text-secondary)]">{t("login.noAccount")} </span>
                            <Link href="/register" className="font-medium hover:underline transition-colors" style={{ color: 'var(--accent-primary)' }}>
                                {t("login.switchRegister")}
                            </Link>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t" style={{ borderColor: 'var(--border-subtle)' }}></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 text-[var(--text-muted)]" style={{ background: 'var(--surface-card)' }}>{t("login.orContinue")}</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3">
                            <button
                                onClick={() => signIn("google", { callbackUrl })}
                                className="flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 disabled:opacity-50 cursor-pointer hover:bg-[var(--surface-hover)]"
                                style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)', background: 'transparent' }}
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
                                className="flex w-full items-center justify-center gap-3 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all cursor-pointer"
                                style={{ background: '#0068FF' }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#005BFF'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#0068FF'}
                            >
                                <span className="font-bold text-lg tracking-tighter mr-1 -mt-0.5">Zalo</span>
                                Zalo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[var(--accent-glow)] rounded-full blur-[100px] -z-10 opacity-60 pointer-events-none"></div>
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
