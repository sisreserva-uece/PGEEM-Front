import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/*?auth='],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  } as MetadataRoute.Robots;
}
