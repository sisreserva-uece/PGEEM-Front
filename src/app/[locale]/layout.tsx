import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import { Toaster } from 'sonner';
import { CenteredPageLayout } from '@/components/CenteredPageLayout';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SessionProvider } from '@/features/auth/components/SessionProvider';
import { authService } from '@/features/auth/services/authService';
import { ProtectedNavigation } from '@/features/nav-bar/components/ProtectedNavigation';
import { inter } from '@/lib/font';
import { routing } from '@/lib/i18nNavigation';
import { AppProviders } from '@/lib/providers/AppProviders';
import { SERVER_API_URL } from '@/lib/serverEnv';
import { getSession } from '@/lib/session';
import '@fontsource/inter';
import '@/styles/global.css';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

async function forceLogoutAndRedirect(locale: string): Promise<never> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

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

  redirect(`/${locale}/signin`);
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  const token = await getSession();
  let user = null;

  if (token) {
    try {
      const response = await authService.getMe({
        headers: { Authorization: `Bearer ${token}` },
      });
      user = response.data.data;
    } catch {
      await forceLogoutAndRedirect(locale);
    }
  }

  return (
    <html lang={locale} className={`${inter.className}`}>
      <body suppressHydrationWarning className="antialiased">
        <AppProviders>
          <SessionProvider user={user}>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <div className="flex min-h-screen flex-col overflow-x-hidden">
                <Header />
                <ProtectedNavigation />
                <main className="flex-grow bg-gradient-to-b from-white from-50% to-[#D3EADA]">
                  <CenteredPageLayout>
                    {props.children}
                  </CenteredPageLayout>
                </main>
                <Footer />
              </div>
              <Toaster richColors />
            </NextIntlClientProvider>
          </SessionProvider>
        </AppProviders>
      </body>
    </html>
  );
}
