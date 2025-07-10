import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import pathMatch from 'path-match';
import { routing } from './lib/i18nNavigation';

const intlMiddleware = createMiddleware(routing);
const route = pathMatch();
const isDashboardRoute = route('/dashboard/:path*');
const isLocalizedDashboardRoute = route('/:locale/dashboard/:path*');

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isDashboardRoute(pathname) || isLocalizedDashboardRoute(pathname)) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      const locale = request.nextUrl.pathname.match(/^\/([a-z-]+)\//i)?.[1] ?? '';
      const signInUrl = new URL(request.url);
      signInUrl.pathname = `/${locale}`;
      signInUrl.searchParams.set('auth', 'login');
      return Response.redirect(signInUrl);
    }
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next|monitoring|sitemap|robots\\.txt|sounds|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
