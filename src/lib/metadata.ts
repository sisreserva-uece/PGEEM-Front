import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  description:
        'SisReserva',
  keywords: '',
  title: {
    default: 'SisReserva',
    template: '%s | SisReserva',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SisReserva',
    description:
            'SisReserva',
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/assets/images/og-image.png`],
  },
  openGraph: {
    title: 'SisReserva',
    url: '/',
    description:
            'SisReserva',
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/assets/images/og-image.png`],
    locale: 'pt_BR',
    type: 'website',
  },
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};
