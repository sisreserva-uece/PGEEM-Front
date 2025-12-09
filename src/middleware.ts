import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './lib/i18nNavigation';

const intlMiddleware = createMiddleware(routing);

const publicRoutes = ['/signin', '/signup', '/unauthorized'];
const protectedPrefix = '/dashboard';

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('accessToken')?.value;
  const isProtectedRoute = path.includes(protectedPrefix);
  const isPublicRoute = publicRoutes.some(route => path.includes(route));
  const isRootLocalePath = routing.locales.some(locale => path === `/${locale}`);
  if ((isProtectedRoute || isRootLocalePath) && !token) {
    const locale = request.nextUrl.locale || routing.defaultLocale;
    if (!path.includes('/signin')) {
      return NextResponse.redirect(new URL(`/${locale}/signin`, request.url));
    }
  }
  if ((isPublicRoute || isRootLocalePath) && token) {
    const locale = request.nextUrl.locale || routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next|monitoring|sitemap|robots\\.txt|sounds|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
