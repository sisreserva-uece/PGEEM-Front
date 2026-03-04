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

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'Refresh token não encontrado.' }, { status: 401 });
  }

  let springResponse: Response;
  try {
    springResponse = await fetch(`${SERVER_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${refreshToken}`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Serviço indisponível.' }, { status: 503 });
  }

  if (!springResponse.ok) {
    return NextResponse.json({ error: 'Sessão expirada.' }, { status: 401 });
  }

  const nextResponse = NextResponse.json({ success: true }, { status: 200 });

  const setCookies = getSetCookieHeaders(springResponse.headers);
  for (const cookie of setCookies) {
    nextResponse.headers.append('Set-Cookie', cookie);
  }

  return nextResponse;
}
