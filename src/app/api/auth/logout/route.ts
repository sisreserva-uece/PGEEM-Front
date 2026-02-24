import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SERVER_API_URL } from '@/lib/serverEnv';

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const cookieHeader = [
    accessToken && `accessToken=${accessToken}`,
    refreshToken && `refreshToken=${refreshToken}`,
  ]
    .filter(Boolean)
    .join('; ');

  try {
    await fetch(`${SERVER_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });
  } catch {
  }

  const nextResponse = NextResponse.json({ success: true }, { status: 200 });
  nextResponse.headers.append(
    'Set-Cookie',
    'accessToken=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
  );
  nextResponse.headers.append(
    'Set-Cookie',
    'refreshToken=; Path=/api/auth/refresh; Max-Age=0; HttpOnly; SameSite=Lax',
  );

  return nextResponse;
}
