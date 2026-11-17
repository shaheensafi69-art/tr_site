import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import HotelClientView from './HotelClientView';
import { HotelWithDetails } from '@/types/hotel';
import { RoomWithPricing } from '@/types/room';

export const revalidate = 30;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data: hotel } = await supabase
    .from('hotels')
    .select('name, short_description, cover_image')
    .eq('slug', slug)
    .single();

  if (!hotel) {
    return { title: 'هتل یافت نشد | TehranRoom' };
  }

  return {
    title: `رزرو آنلاین ${hotel.name} - قیمت، اتاق‌ها و نظرات`,
    description: hotel.short_description,
    openGraph: {
      title: `${hotel.name} | سامانه رزرواسیون لوکس تهران‌روم`,
      description: hotel.short_description,
      images: [{ url: hotel.cover_image }],
    },
  };
}

export default async function HotelDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createServerClient();

  // 1. Fetch hotel details
  const { data: hotelData, error: hotelErr } = await supabase
    .from('hotels')
    .select(`
      *,
      province:provinces(*),
      city:cities(*)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (hotelErr || !hotelData) {
    notFound();
  }

  const hotel = hotelData as unknown as HotelWithDetails;

  // 2. Fetch rooms with pricing
  const { data: roomsData } = await supabase
    .from('rooms')
    .select(`
      *,
      pricing:room_pricing(*)
    `)
    .eq('hotel_id', hotel.id)
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  const rooms: RoomWithPricing[] = (roomsData || []).map((r: any) => ({
    ...r,
    pricing: Array.isArray(r.pricing) ? r.pricing[0] : r.pricing,
  }));

  // 3. Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('hotel_id', hotel.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  // Schema.org JSON-LD for Hotel
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    description: hotel.description,
    image: hotel.cover_image,
    telephone: hotel.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: hotel.address,
      addressLocality: 'Tehran',
      addressRegion: 'Tehran',
      addressCountry: 'IR',
    },
    starRating: {
      '@type': 'Rating',
      ratingValue: hotel.stars,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: hotel.rating,
      reviewCount: hotel.review_count,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HotelClientView hotel={hotel} rooms={rooms} reviews={reviews || []} />
    </>
  );
}

