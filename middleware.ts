import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

export function middleware() {
  // const path = request.nextUrl.pathname;
  // const token = request.cookies.get('token');
  // const publicPath = path.startsWith('/auth');
  // if (!publicPath && !token) {
  //   return NextResponse.redirect(new URL('/auth/sign-in/', request.url));
  // }
  // if (publicPath && token) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
