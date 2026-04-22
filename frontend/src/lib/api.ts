import { getSession } from "next-auth/react";

const getApiUrl = () => {
    const isServer = typeof window === "undefined";
    if (isServer) {
        // Build URL dynamically based on internal Docker network URL for SSR
        return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://backend:8000/api/v1";
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
};

const API_URL = getApiUrl();

export async function fetcher(endpoint: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers || {});

    // Don't set Content-Type for FormData – browser sets it automatically with boundary
    const isFormData = options.body instanceof FormData;
    if (isFormData === false && headers.has('Content-Type') === false) {
        headers.set('Content-Type', 'application/json');
    }

    // Isomorphic Token Injection
    let token = null;
    const isServer = typeof window === "undefined";
    if (isServer) {
        try {
            const { getServerSession } = await import("next-auth");
            const { authOptions } = await import("@/lib/auth");
            const session = await getServerSession(authOptions);
            token = (session as any)?.accessToken;
        } catch (e) {
            console.warn("[Fetcher] Failed to get server session:", e);
        }
    } else {
        const session = await getSession();
        token = (session as any)?.accessToken;
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let finalUrl = `${API_URL}${cleanEndpoint}`;

    // Fix Node 18+ strict IPv6 resolution bug for localhost
    if (isServer && finalUrl.includes("localhost")) {
        finalUrl = finalUrl.replace("localhost", "127.0.0.1");
    }

    try {
        const response = await fetch(finalUrl, {
            ...options,
            signal: options.signal || AbortSignal.timeout(30000),
            headers,
        });

        if (response.ok === false) {
            const errorText = await response.text();
            let errorDetail = "An error occurred while fetching the data.";
            try {
                const errorJson = JSON.parse(errorText);
                errorDetail = errorJson.detail || errorDetail;
            } catch (p) {
                errorDetail = errorText || errorDetail;
            }
            console.error(`[Fetcher Error] ${response.status} ${response.statusText} at ${endpoint}:`, errorDetail);
            const error = new Error(errorDetail);
            (error as any).status = response.status;
            throw error;
        }

        return response.json();
    } catch (err: any) {
        if (err.status === 401) {
            console.error("[Fetcher] Unauthorized request. Token might be invalid or expired.");
        }
        throw err;
    }
}
