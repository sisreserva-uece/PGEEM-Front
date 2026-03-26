import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './lib/i18nNavigation';

const intlMiddleware = createMiddleware(routing);
const publicRoutes = ['/signin', '/signup', '/unauthorized', '/api/auth'];

function isTokenExpired(token: string) {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;
    const payload = JSON.parse(atob(payloadBase64));
    const exp = payload.exp * 1000;
    return Date.now() >= exp; 
  } catch {
    return true; 
  }
}

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  let token = request.cookies.get('accessToken')?.value;

  if (path.startsWith('/_next') || path.includes('.')) {
    return NextResponse.next();
  }
<<<<<<< Updated upstream
  const token = request.cookies.get('accessToken')?.value;
  const isProtectedRoute = path.includes(protectedPrefix);
=======

  const detectedLocale = routing.locales.find(l => path.startsWith(`/${l}/`) || path === `/${l}`) ?? routing.defaultLocale;
  const urlLocalePrefix = `/${detectedLocale}`;
>>>>>>> Stashed changes
  const isPublicRoute = publicRoutes.some(route => path.includes(route));

  if (token && isTokenExpired(token)) {
    const response = NextResponse.redirect(new URL(`${urlLocalePrefix}/signin`, request.url));
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken'); 
    return response;
  }
  if (!isPublicRoute && !token) {
    if (!path.includes('/signin')) {
      return NextResponse.redirect(new URL(`${urlLocalePrefix}/signin`, request.url));
    }
  }

  if (isPublicRoute && token && path.includes('/signin')) {
    return NextResponse.redirect(new URL(`${urlLocalePrefix}/dashboard`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|monitoring|sitemap|robots\\.txt|sounds|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
