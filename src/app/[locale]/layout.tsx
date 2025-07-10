import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import React from 'react';
import { Toaster } from 'sonner';
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
          <NextIntlClientProvider locale={locale} messages={messages}>
            {props.children}
            <Toaster richColors />
          </NextIntlClientProvider>
        </AppProviders>
      </body>
    </html>
  );
}
