import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './lib/i18nNavigation';

const intlMiddleware = createMiddleware(routing);

const publicRoutes = ['/signin', '/signup', '/unauthorized'];
const protectedPrefix = '/dashboard';

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }
  const token = request.cookies.get('accessToken')?.value;
  const isProtectedRoute = path.includes(protectedPrefix);
  const isPublicRoute = publicRoutes.some(route => path.includes(route));
  const isRootLocalePath = routing.locales.some(locale => path === `/${locale}`);
  const detectedLocale
    = routing.locales.find(l => path.startsWith(`/${l}/`) || path === `/${l}`)
      ?? routing.defaultLocale;
  const urlLocalePrefix
    = detectedLocale === routing.defaultLocale ? '' : `/${detectedLocale}`;

  if ((isProtectedRoute || isRootLocalePath) && !token) {
    if (!path.includes('/signin')) {
      return NextResponse.redirect(new URL(`${urlLocalePrefix}/signin`, request.url));
    }
  }

  if ((isPublicRoute || isRootLocalePath) && token) {
    return NextResponse.redirect(new URL(`${urlLocalePrefix}/dashboard`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next|monitoring|sitemap|robots\\.txt|sounds|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
