import { cookies } from 'next/headers';
import 'server-only';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-fallback-secret-dont-use-in-prod';
const key = new TextEncoder().encode(SECRET_KEY);

export async function createSession(token: string) {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  cookieStore.set('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  if (!token) {
    return null;
  }
  return token;
}

/**
 * Optional: Verify token integrity on the server side
 * This is useful if you want to know the user's role in Middleware
 */
export async function verifySession(token: string) {
  try {
    return true;
  } catch (error) {
    return false;
  }
}
