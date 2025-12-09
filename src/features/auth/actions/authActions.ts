'use server';

import type { SignInFormValues } from '../types';
import { getLocale } from 'next-intl/server';
import { redirect } from '@/lib/i18nNavigation';
import { createSession, deleteSession } from '@/lib/session';
import { authService } from '../services/authService';
import { signInSchema } from '../types';

export async function loginAction(data: SignInFormValues): Promise<{ error?: string } | void> {
  const locale = await getLocale();
  const validatedFields = signInSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: 'Dados inválidos' };
  }
  try {
    const response = await authService.signIn(validatedFields.data);
    const token = response.data.data?.token;
    if (!token) {
      return { error: 'Token não fornecido pelo servidor' };
    }
    await createSession(token);
  } catch (error: any) {
    return { error: error.response?.data?.message || 'Erro ao realizar login' };
  }
  redirect({ href: '/dashboard', locale });
}

export async function logoutAction() {
  const locale = await getLocale();
  await deleteSession();

  redirect({ href: '/signin', locale });
}
