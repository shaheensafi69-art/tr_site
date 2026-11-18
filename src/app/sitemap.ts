import { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tehranroom.com';
  const supabase = createServerClient();

  // 1. Fetch all published hotels dynamically
  const { data: hotels } = await supabase
    .from('hotels')
    .select('slug, updated_at')
    .eq('is_published', true);

  const hotelUrls: MetadataRoute.Sitemap = (hotels || []).map((hotel) => ({
    url: `${baseUrl}/hotels/${hotel.slug}`,
    lastModified: new Date(hotel.updated_at || Date.now()),
    changeFrequency: 'daily',
    priority: 0.95,
  }));

  // 2. Fetch all published cities dynamically
  const { data: cities } = await supabase
    .from('cities')
    .select('slug, created_at')
    .eq('is_active', true);

  const cityUrls: MetadataRoute.Sitemap = (cities || []).map((city) => ({
    url: `${baseUrl}/hotels?city=${city.slug}`,
    lastModified: new Date(city.created_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 3. High-authority static routes
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hotels`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/booking/track`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/booking/cancel`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  return [...staticUrls, ...hotelUrls, ...cityUrls];
}

