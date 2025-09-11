import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect /admin and /api/admin
  const isAdminPath = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (isAdminPath || isAdminApi) {
    const cookie = request.cookies.get('admin_auth');
    const authed = cookie?.value === '1';

    // Allow access to login page without auth
    const isLogin = pathname.startsWith('/admin/login');
    // Allow auth API (login/logout) without auth
    const isAuthApi = pathname.startsWith('/api/admin/auth');

    if (!authed && !isLogin && !isAuthApi) {
      // For API, return 401 JSON
      if (isAdminApi) {
        return new NextResponse(JSON.stringify({ ok: false, message: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin', '/api/admin/:path*'],
};
