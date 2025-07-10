import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { routing } from '@/lib/i18nNavigation';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function PublicLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col bg-gradient-to-b from-white from-50% to-[#D3EADA]">{props.children}</main>
      <Footer />
    </div>
  );
}
