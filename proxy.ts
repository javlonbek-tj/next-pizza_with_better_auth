import { betterFetch } from '@better-fetch/fetch';
import { NextRequest, NextResponse } from 'next/server';
import type { Session } from '@/lib/auth';
import { USER_ROLES } from '@/lib/constants';

const AUTH_ROUTES = ['/profile', '/orders'];
const ADMIN_ROUTES = ['/admin', '/api/admin'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsAuth = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const needsAdmin = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (!needsAuth && !needsAdmin) {
    return NextResponse.next();
  }

  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      baseURL: request.nextUrl.origin,
      headers: { cookie: request.headers.get('cookie') ?? '' },
    },
  );

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (needsAdmin && session.user.role !== USER_ROLES.ADMIN) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/orders/:path*', '/admin/:path*', '/api/admin/:path*'],
};
