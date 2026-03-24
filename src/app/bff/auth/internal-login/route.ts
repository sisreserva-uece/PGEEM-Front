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
    cookie.replace(/;\s*Path=\/auth\/refresh/i, '; Path=/bff/auth/refresh'),
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: 'Corpo inválido' }, { status: 400 });
  }

  let springResponse: Response;

  try {
    springResponse = await fetch(`${SERVER_API_URL}/auth/login/internal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json({ error: 'Serviço indisponível' }, { status: 503 });
  }

  if (springResponse.status === 202) {
    const data = await springResponse.json();
    return NextResponse.json(data, { status: 202 });
  }

  if (!springResponse.ok) {
    const error = await springResponse.json().catch(() => ({}));
    return NextResponse.json(error, { status: springResponse.status });
  }

  const nextResponse = NextResponse.json({ success: true }, { status: 200 });

  const cookies = rewriteRefreshTokenPath(getSetCookieHeaders(springResponse.headers));
  cookies.forEach(c => nextResponse.headers.append('Set-Cookie', c));

  return nextResponse;
}
