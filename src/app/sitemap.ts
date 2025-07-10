import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const TARGET_LOCALE = 'pt';
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    {
      url: `${BASE_URL}/${TARGET_LOCALE}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];
  return [...staticRoutes];
}
