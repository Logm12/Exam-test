import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetcher(endpoint: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers || {});
    // Don't set Content-Type for FormData – browser sets it automatically with boundary
    const isFormData = options.body instanceof FormData;
    if (!isFormData && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // Isomorphic Token Injection (Works on both Client and Server Components)
    let token = null;
    if (typeof window === "undefined") {
        // Server-side
        try {
            const { getServerSession } = await import("next-auth");
            const { authOptions } = await import("@/lib/auth");
            const session = await getServerSession(authOptions);
            token = (session as any)?.accessToken;
        } catch (e) {
            console.warn("Failed to get server session in fetcher", e);
        }
    } else {
        // Client-side
        const session = await getSession();
        token = (session as any)?.accessToken;
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Ensure the endpoint starts with a slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Fix Node 18+ strict IPv6 resolution bug for localhost by directly targeting IPv4 loopback on server
    let finalUrl = `${API_URL}${cleanEndpoint}`;
    if (typeof window === "undefined" && finalUrl.includes("localhost")) {
        finalUrl = finalUrl.replace("localhost", "127.0.0.1");
    }

    const response = await fetch(finalUrl, {
        cache: "no-store", // Explicitly opt out of Next.js aggressive cache to prevent build-time static errors
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'An error occurred while fetching the data.');
    }

    return response.json();
}
