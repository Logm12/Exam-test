"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/admin";
    const errorParam = searchParams.get("error");
    const { t } = useLanguage();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(
        errorParam === "AccessDenied"
            ? t("admin.login.error.access")
            : errorParam === "CredentialsSignin"
                ? t("admin.login.error.invalid")
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
                setError(t("admin.login.error.invalid"));
                return;
            }

            router.push(callbackUrl === "/login" ? "/admin" : callbackUrl);
            router.refresh();
        } catch (err: any) {
            setError(err.message || t("admin.login.error.system"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            {/* Language toggle top-right */}
            <div className="absolute top-6 right-6">
                <LanguageToggle />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-indigo-600 rounded flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">EO</span>
                    </div>
                </div>
                <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-white">
                    {t("admin.login.title")}
                </h2>
                <p className="mt-2 text-center text-sm text-neutral-400">
                    {t("admin.login.subtitle")}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-neutral-800 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-neutral-700">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-900/50 text-red-200 p-3 rounded-lg text-sm border border-red-800">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-neutral-300">{t("admin.login.username")}</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full appearance-none rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-white placeholder-neutral-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="admin"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-300">{t("admin.login.password")}</label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-white placeholder-neutral-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm shadow-indigo-900/50 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-800 disabled:opacity-50 transition-all"
                            >
                                {isLoading ? t("app.processing") : t("admin.login.submit")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
