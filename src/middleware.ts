import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './lib/i18nNavigation';

const intlMiddleware = createMiddleware(routing);
const publicOnlyRoutes = ['/signin', '/signup'];
const publicRoutes = ['/signin', '/signup', '/unauthorized'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const locale = routing.locales.find(loc => pathname.startsWith(`/${loc}/`)) || routing.defaultLocale;
  const pathWithoutLocale = pathname.startsWith(`/${locale}`)
    ? pathname.substring(`/${locale}`.length) || '/'
    : pathname;
  if (token) {
    if (publicOnlyRoutes.includes(pathWithoutLocale)) {
      const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }
  if (!token) {
    if (!publicRoutes.includes(pathWithoutLocale) && pathWithoutLocale !== '/') {
      const signInUrl = new URL(`/${locale}/unauthorized`, request.url);
      signInUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ],
};
