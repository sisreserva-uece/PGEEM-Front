import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import React from 'react';
import { Toaster } from 'sonner';
import { CenteredPageLayout } from '@/components/CenteredPageLayout';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SessionProvider } from '@/features/auth/components/SessionProvider';
import { ProtectedNavigation } from '@/features/nav-bar/components/ProtectedNavigation';
import { inter } from '@/lib/font';
import { routing } from '@/lib/i18nNavigation';
import { AppProviders } from '@/lib/providers/AppProviders';
import '@fontsource/inter';
import '@/styles/global.css';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
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
  return (
    <html lang={locale} className={`${inter.className}`}>
      <body suppressHydrationWarning className="antialiased">
        <AppProviders>
          <SessionProvider>
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
