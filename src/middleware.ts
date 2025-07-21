import type { JWTPayload } from 'jose';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './lib/i18nNavigation';

const intlMiddleware = createMiddleware(routing);
const publicOnlyRoutes = ['/signin', '/signup'];
const publicRoutes = ['/signin', '/signup', '/unauthorized'];
const protectedRoutes: Record<string, string[]> = {
  '/espacos/criar': ['ADMIN'],
  '/espacos': ['ADMIN', 'GESTOR'],
  '/admin/users': ['ADMIN'],
};

type UserJWTPayload = {
  id: string;
  role: string;
} & JWTPayload;

async function getSession(token?: string): Promise<{ roles: string[] } | null> {
  if (!token) {
    return null;
  }
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify<UserJWTPayload>(token, secret);
    if (!payload.role) {
      return { roles: [] };
    }
    const roles = payload.role.replace(/[[\]\s]/g, '').split(',');
    return { roles };
  } catch (error) {
    console.error('Failed to verify or parse JWT:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const locale
      = routing.locales.find(loc => pathname.startsWith(`/${loc}/`))
        || routing.defaultLocale;
  const pathWithoutLocale = pathname.startsWith(`/${locale}`)
    ? pathname.substring(`/${locale}`.length) || '/'
    : pathname;
  const session = await getSession(token);
  if (session) {
    if (publicOnlyRoutes.includes(pathWithoutLocale)) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
    const requiredRoles = protectedRoutes[pathWithoutLocale];
    if (requiredRoles) {
      const hasRequiredRole = session.roles.some(userRole =>
        requiredRoles.includes(userRole),
      );
      if (!hasRequiredRole) {
        return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url));
      }
    }
  } else {
    const isProtectedRoute = !publicRoutes.includes(pathWithoutLocale) && pathWithoutLocale !== '/';
    if (isProtectedRoute) {
      const targetUrl = new URL(`/${locale}/unauthorized`, request.url);
      targetUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(targetUrl);
    }
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
};
