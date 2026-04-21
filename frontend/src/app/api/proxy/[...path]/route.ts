import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, await params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, await params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, await params);
}

async function proxyRequest(request: NextRequest, params: { path: string[] }) {
    const path = params.path.join("/");
    const url = `${BACKEND_URL}/${path}`;

    // Preserve query string
    const searchParams = request.nextUrl.searchParams.toString();
    const fullUrl = searchParams ? `${url}?${searchParams}` : url;
    
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
        // Don't forward host or other hop-by-hop headers
        if (!["host", "connection", "content-length", "authorization"].includes(key.toLowerCase())) {
            headers[key] = value;
        }
    });

    // Inject NextAuth Authorization token
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (token?.accessToken) {
        headers["Authorization"] = `Bearer ${token.accessToken}`;
    }

    const fetchOptions: RequestInit = {
        method: request.method,
        headers,
    };

    // Forward request body for non-GET methods
    if (request.method !== "GET" && request.method !== "HEAD") {
        const contentType = request.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            fetchOptions.body = await request.text();
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
            fetchOptions.body = await request.text();
        } else if (contentType.includes("multipart/form-data")) {
            fetchOptions.body = await request.arrayBuffer();
            // Important: Preserve the boundary in the content-type header
            headers["content-type"] = contentType;
        } else {
            fetchOptions.body = await request.arrayBuffer();
        }
    }

    try {
        const response = await fetch(fullUrl, fetchOptions);
        const data = await response.text();

        return new NextResponse(data, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                "Content-Type": response.headers.get("Content-Type") || "application/json",
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { detail: `Backend unreachable: ${error.message}` },
            { status: 502 }
        );
    }
}
