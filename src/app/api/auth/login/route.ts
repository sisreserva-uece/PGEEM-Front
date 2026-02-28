import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SERVER_API_URL } from '@/lib/serverEnv';

function getSetCookieHeaders(headers: Headers): string[] {
  if (typeof (headers as any).getSetCookie === 'function') {
    return (headers as any).getSetCookie() as string[];
  }
  const single = headers.get('set-cookie');
  return single ? [single] : [];
}

function rewriteRefreshTokenPath(cookies: string[]): string[] {
  return cookies.map(cookie =>
    cookie.replace(/;\s*Path=\/auth\/refresh/i, '; Path=/api/auth/refresh'),
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição inválido.' }, { status: 400 });
  }

  let springResponse: Response;
  try {
    springResponse = await fetch(`${SERVER_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json({ error: 'Serviço indisponível.' }, { status: 503 });
  }

  if (!springResponse.ok) {
    const errorData = await springResponse.json().catch(() => ({
      error: 'Erro ao realizar login.',
    }));
    return NextResponse.json(errorData, { status: springResponse.status });
  }

  const nextResponse = NextResponse.json({ success: true }, { status: 200 });

  const setCookies = rewriteRefreshTokenPath(getSetCookieHeaders(springResponse.headers));
  for (const cookie of setCookies) {
    nextResponse.headers.append('Set-Cookie', cookie);
  }

  return nextResponse;
}
