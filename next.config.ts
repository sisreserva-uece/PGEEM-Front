import withBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';
import '@/lib/env';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
export default bundleAnalyzer(
  withNextIntl({
    eslint: {
      dirs: ['.'],
      ignoreDuringBuilds: true,
    },
    experimental: {
      authInterrupts: true,
    },
    poweredByHeader: false,
    reactStrictMode: true,
    serverExternalPackages: ['@electric-sql/pglite'],
    images: {
      formats: ['image/webp'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          pathname: '/**',
        },
      ],
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  },
  ),
);
