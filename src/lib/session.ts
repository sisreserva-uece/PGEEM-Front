import { cookies } from 'next/headers';
import 'server-only';

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value ?? null;
}
