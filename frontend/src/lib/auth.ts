import { AuthOptions, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

const getApiUrl = () => {
    const isServer = typeof window === "undefined";
    if (isServer) {
        return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://backend:8000/api/v1";
    }
    return process.env.NEXT_PUBLIC_API_URL || "https://fdbtalent.vnuis.edu.vn/api/v1";
};

const API_URL = getApiUrl();

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                try {
                    const loginUrl = `${API_URL}/auth/login`;
                    console.log(`[NextAuth] Authorizing via: ${loginUrl}`);

                    const res = await fetch(loginUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: new URLSearchParams({
                            username: credentials.username,
                            password: credentials.password,
                        }).toString(),
                    });

                    if (!res.ok) return null;

                    const data = await res.json();

                    if (credentials.role && data.user.role !== credentials.role) {
                        return null;
                    }

                    return {
                        id: data.user.id.toString(),
                        name: credentials.username,
                        email: credentials.username,
                        role: data.user.role,
                        profile_completed: data.user.profile_completed,
                        accessToken: data.access_token,
                    };
                } catch (error: any) {
                    console.error("CredentialsProvider authorize error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update" && session?.profile_completed !== undefined) {
                token.profile_completed = session.profile_completed;
            }

            if (user) {
                token.accessToken = (user as any).accessToken;
                token.role = (user as any).role;
                token.userId = user.id;
                token.profile_completed = (user as any).profile_completed;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session as any).accessToken = token.accessToken;
                (session.user as any).role = token.role;
                (session.user as any).id = token.userId;
                (session.user as any).profile_completed = token.profile_completed;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 1 day
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    useSecureCookies: process.env.NODE_ENV === "production",
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
        error: "/login",
    },
};
