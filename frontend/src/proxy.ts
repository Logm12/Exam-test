import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get('host') ?? '';

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userRole = token?.role as string | undefined;

    // Protected routes: /dashboard requires authentication
    if (url.pathname.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (userRole === 'admin') {
            return NextResponse.redirect(new URL('/admin', req.url));
        }
    }

    // Admin routes: /admin/* requires admin role
    if (url.pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (userRole !== 'admin') {
            return NextResponse.redirect(new URL('/login?error=AccessDenied', req.url));
        }
    }

    const response = NextResponse.next();

    // Security Headers
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data: lh3.googleusercontent.com http://127.0.0.1:8000 http://localhost:8000;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' http://127.0.0.1:8000 http://127.0.0.1:8001 http://localhost:8000 http://localhost:8001;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, ' ').trim();

    response.headers.set("Content-Security-Policy", cspHeader);
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    return response;
}
