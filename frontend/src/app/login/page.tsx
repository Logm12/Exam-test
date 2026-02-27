"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { fetcher } from "@/lib/api";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const errorParam = searchParams.get("error");
    const { t } = useLanguage();

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

    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            if (isRegistering) {
                await fetcher("/auth/register", {
                    method: "POST",
                    body: JSON.stringify({
                        username,
                        password,
                        role: "student"
                    })
                });
            }

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
        <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            {/* Language toggle top-right */}
            <div className="absolute top-6 right-6">
                <LanguageToggle />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900">
                    {t("login.title")}
                </h2>
                <p className="mt-2 text-center text-sm text-neutral-600">
                    {t("login.subtitle")}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-neutral-200/50 sm:rounded-2xl sm:px-10 border border-neutral-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">{t("login.username")}</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full appearance-none rounded-lg border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700">{t("login.password")}</label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-lg border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
                            >
                                {isLoading ? t("app.processing") : isRegistering ? t("app.register") : t("app.signIn")}
                            </button>
                        </div>

                        <div className="text-sm text-center">
                            <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-indigo-600 font-medium hover:underline cursor-pointer transition-colors">
                                {isRegistering ? t("login.switchLogin") : t("login.switchRegister")}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-neutral-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-neutral-500">{t("login.orContinue")}</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3">
                            <button
                                onClick={() => signIn("google", { callbackUrl })}
                                className="flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
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
                                className="flex w-full items-center justify-center gap-3 rounded-lg border border-transparent bg-[#0068FF] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#005BFF] focus:outline-none focus:ring-2 focus:ring-[#0068FF] focus:ring-offset-2 transition-all"
                            >
                                <span className="font-bold text-lg tracking-tighter mr-1 -mt-0.5">Zalo</span>
                                Zalo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <LanguageProvider>
            <LoginForm />
        </LanguageProvider>
    );
}
