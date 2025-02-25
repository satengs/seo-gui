import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('auth_token')?.value;
    const decodedToken = token ? verifyToken(token) : null;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
        req.nextUrl.pathname.startsWith('/register');

    // If there's a token and trying to access auth pages
    if (decodedToken && isAuthPage) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/keywords';
        return NextResponse.redirect(redirectUrl);
    }

    // If there's no token and trying to access a protected route
    if (!decodedToken && !isAuthPage) {
        const redirectUrl = new URL('/login', req.url);
        return NextResponse.redirect(redirectUrl);
    }

    // Check admin routes
    if (req.nextUrl.pathname.startsWith('/users')) {
        if (!decodedToken || !['admin', 'superadmin'].includes(decodedToken.role)) {
            const redirectUrl = new URL('/', req.url);
            return NextResponse.redirect(redirectUrl);
        }
    }

    // Add pathname to headers for layout to use
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-pathname', req.nextUrl.pathname);

    // Return response with modified headers
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};