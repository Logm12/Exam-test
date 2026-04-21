import { AuthOptions, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

const getApiUrl = () => {
    const isServer = typeof window === "undefined";
    if (isServer) {
        // Use internal Docker network URL if available, otherwise fallback to public
        return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
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
                    // Internal communication (server-to-server)
                    const loginUrl = `${API_URL}/auth/login`;
                    console.log(`[NextAuth] Authorizing via: ${loginUrl}`);
                    // Authenticate against FastAPI backend
                    const formData = new URLSearchParams();
                    formData.append("username", credentials.username);
                    formData.append("password", credentials.password);


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

                    console.log(`[NextAuth] Login fetch status: ${res.status}`);

                    if (!res.ok) {
                        const errBody = await res.text();
                        console.error(`[NextAuth] Login failed. Status: ${res.status}, Body: ${errBody}`);
                        return null;
                    }

                    const data = await res.json();
                    console.log(`[NextAuth] Login success for user: ${data.user?.username}`);

                    if (credentials.role && data.user.role !== credentials.role) {
                        console.error(`[NextAuth] Role mismatch. Expected: ${credentials.role}, Got: ${data.user.role}`);
                        throw new Error("Invalid role selected");
                    }

                    // Return user object for NextAuth session
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
                    if (error.message === "Invalid role selected") {
                        throw error;
                    }
                    return null;
                }
            },
        }),

        // Google OAuth provider (optional, requires env vars)
        ...(process.env.GOOGLE_CLIENT_ID
            ? [
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
                }),
            ]
            : []),

        // Facebook OAuth provider
        ...(process.env.FACEBOOK_CLIENT_ID
            ? [
                FacebookProvider({
                    clientId: process.env.FACEBOOK_CLIENT_ID,
                    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
                }),
            ]
            : []),

        // Custom Zalo OAuth2 Provider
        ...(process.env.ZALO_CLIENT_ID
            ? [
                {
                    id: "zalo",
                    name: "Zalo",
                    type: "oauth" as const,
                    authorization: "https://oauth.zaloapp.com/v4/permission?app_id=" + process.env.ZALO_CLIENT_ID,
                    token: "https://oauth.zaloapp.com/v4/access_token",
                    userinfo: "https://graph.zalo.me/v2.0/me?fields=id,name,picture",
                    clientId: process.env.ZALO_CLIENT_ID,
                    clientSecret: process.env.ZALO_CLIENT_SECRET || "",
                    profile(profile: any) {
                        return {
                            id: profile.id,
                            name: profile.name,
                            email: `${profile.id}@zalo.me`, // Zalo doesn't reliably return email, creating a stub
                            image: profile.picture?.data?.url,
                        };
                    },
                },
            ]
            : []),
    ],
    callbacks: {
        async jwt({ token, user, account, trigger, session }) {
            // Handle update trigger from useSession().update()
            if (trigger === "update" && session?.profile_completed !== undefined) {
                token.profile_completed = session.profile_completed;
            }

            // On first sign-in, pack user data into the JWT
            if (user) {
                token.accessToken = (user as any).accessToken;
                token.role = (user as any).role;
                token.userId = user.id;
                token.profile_completed = (user as any).profile_completed;
            }

            // Social OAuth flow: exchange token with backend
            // For now, we stub this out since the FastAPI backend needs matching OAuth endpoints for /auth/facebook and /auth/zalo.
            // When social providers hit this, we create a provisional "student" role unless the backend overrides it.
            if (account?.provider === "google" && account.id_token) {
                try {
                    // Fix IPv6 localhost resolution specifically for Node 18+ SSR
                    const googleAuthUrl = `${API_URL}/auth/google`.replace("localhost", "127.0.0.1");

                    const res = await fetch(googleAuthUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: account.id_token }),
                    });

                    if (res.ok) {
                        const backendData = await res.json();
                        token.accessToken = backendData.access_token;
                        token.role = backendData.user.role;
                        token.userId = backendData.user.id.toString();
                        token.profile_completed = backendData.user.profile_completed;
                    }
                } catch (error) {
                    console.error("Google JWT exchange error:", error);
                }
            } else if (account?.provider && ["facebook", "zalo"].includes(account.provider)) {
                // Future Implementation: Exchange Facebook/Zalo tokens with backend
                // For now, provision client-side session to allow dashboard access
                if (!token.role) token.role = "student";
                if (!token.userId) token.userId = "social-" + user.id;
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
        maxAge: 8 * 60 * 60, // 8 Hours
    },
    useSecureCookies: process.env.NODE_ENV === "production",
    cookies: process.env.NODE_ENV === "production" ? {
        sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true
            }
        }
    } : undefined,
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
        error: "/login",
    },
};
