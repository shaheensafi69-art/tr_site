import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://tehranroom.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/booking/voucher/', '/_next/'],
      },
      {
        // Google Search & Google Gemini / SGE (GEO / SEO)
        userAgent: ['Googlebot', 'Googlebot-Image', 'Google-Extended'],
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // Bing & Microsoft Copilot
        userAgent: ['Bingbot', 'bingbot'],
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // OpenAI / SearchGPT / ChatGPT (AIO / GEO)
        userAgent: ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot'],
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // Perplexity AI Search (AIO / GEO)
        userAgent: ['PerplexityBot'],
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // Applebot / Siri Voice Search (AEO)
        userAgent: ['Applebot', 'Applebot-Extended'],
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // Anthropic Claude (AIO)
        userAgent: ['ClaudeBot', 'anthropic-ai'],
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

