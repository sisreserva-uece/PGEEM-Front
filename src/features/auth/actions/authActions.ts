'use server';
import { cookies } from 'next/headers';

export async function updateSessionAction(newToken: string) {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken'); 
}