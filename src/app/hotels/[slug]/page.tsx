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
    .select(`
      id, name, short_description, description, cover_image, stars, address, phone,
      province:provinces(name),
      city:cities(name)
    `)
    .eq('slug', slug)
    .single();

  if (!hotel) {
    return { title: 'هتل یافت نشد | TehranRoom' };
  }

  // Fetch rooms for dynamic room-level keywords & metadata
  const { data: rooms } = await supabase
    .from('rooms')
    .select('name, room_type, bed_type')
    .eq('hotel_id', hotel.id)
    .eq('is_published', true);

  const roomNames = (rooms || []).map((r) => r.name);
  const roomsSnippet = roomNames.length > 0 ? ` (اتاق‌های ${roomNames.slice(0, 3).join('، ')})` : '';
  const cityName = (hotel.city as any)?.name || 'تهران';
  const canonicalUrl = `https://tehranroom.com/hotels/${slug}`;

  const dynamicTitle = `رزرو آنلاین ${hotel.name} ${hotel.stars} ستاره${roomsSnippet} | تضمین کمترین قیمت تهران‌روم`;
  const dynamicDescription = `${hotel.short_description || hotel.description?.slice(0, 160)} رزرو مستقیم و قطعی در ${hotel.name} (${cityName}) با امکان رزرو روزانه و اقامت ساعتی، تایید فوری واچر شرکتی، صبحانه بوفه و پشتیبانی شبانه‌روزی.`;

  return {
    title: dynamicTitle,
    description: dynamicDescription,
    keywords: [
      hotel.name,
      `رزرو ${hotel.name}`,
      `قیمت اتاق‌های ${hotel.name}`,
      `رزرو هتل در ${cityName}`,
      `هتل ${hotel.stars} ستاره ${cityName}`,
      `هتل تابان میدان فردوسی`,
      'رزرو ساعتی هتل',
      'رزرو هتل با واچر رسمی',
      ...roomNames,
      ...roomNames.map((rn) => `رزرو ${rn} ${hotel.name}`),
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fa-IR': canonicalUrl,
      },
    },
    openGraph: {
      title: `${hotel.name} - رزرو مستقیم با نرخ مصوب | تهران‌روم`,
      description: dynamicDescription,
      url: canonicalUrl,
      siteName: 'تهران‌روم',
      locale: 'fa_IR',
      type: 'website',
      images: [
        {
          url: hotel.cover_image,
          width: 800,
          height: 460,
          alt: `نمای اتاق‌ها و لابی ${hotel.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${hotel.name} | سامانه رزرواسیون لوکس تهران‌روم`,
      description: dynamicDescription,
      images: [hotel.cover_image],
    },
    other: {
      'geo.placename': hotel.address,
      'geo.region': 'IR-07',
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

  // Multi-Level Rich Schema.org JSON-LD for Hotel, Rooms, Geo & Breadcrumbs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Hotel', 'LodgingBusiness'],
        '@id': `https://tehranroom.com/hotels/${slug}#hotel`,
        name: hotel.name,
        alternateName: 'Hotel Taban Tehran',
        description: hotel.description,
        image: Array.isArray(hotel.images) && hotel.images.length > 0 ? hotel.images : [hotel.cover_image],
        telephone: hotel.phone || '+989357122978',
        email: hotel.email || 'info@tehranroom.com',
        url: `https://tehranroom.com/hotels/${slug}`,
        hasMap: hotel.google_maps_url || 'https://maps.app.goo.gl/hmhZz2Xv6CSnqX3x8',
        address: {
          '@type': 'PostalAddress',
          streetAddress: hotel.address,
          addressLocality: (hotel.city as any)?.name || 'تهران',
          addressRegion: (hotel.province as any)?.name || 'تهران',
          addressCountry: 'IR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: hotel.latitude || 35.7022,
          longitude: hotel.longitude || 51.4179,
        },
        priceRange: '1,200,000 IRR - 2,400,000 IRR',
        currenciesAccepted: 'IRR',
        paymentAccepted: 'کارت‌به‌کارت بانکی شتاب, کارت اعتباری',
        checkinTime: hotel.check_in_time || '14:00',
        checkoutTime: hotel.check_out_time || '12:00',
        starRating: {
          '@type': 'Rating',
          ratingValue: hotel.stars || 2,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: hotel.rating || 4.5,
          reviewCount: hotel.review_count || 12,
          bestRating: 5,
          worstRating: 1,
        },
        amenityFeature: [
          { '@type': 'LocationFeatureSpecification', name: 'اینترنت وای‌فای پرسرعت رایگان', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'پذیرش ۲۴ ساعته شبانه‌روزی', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'سیستم سرمایش و گرمایش اسپلیت', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'بوفه صبحانه گرم و سرد', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'دسترسی سریع به ایستگاه مترو فردوسی', value: true },
        ],
        containsPlace: rooms.map((r) => ({
          '@type': 'HotelRoom',
          name: r.name,
          description: r.description,
          occupancy: {
            '@type': 'QuantitativeValue',
            maxValue: r.max_capacity,
          },
          bed: {
            '@type': 'BedDetails',
            typeOfBed: r.bed_type,
            numberOfBeds: r.standard_capacity,
          },
          offers: {
            '@type': 'Offer',
            price: r.pricing?.daily_price || 1200000,
            priceCurrency: 'IRR',
            availability: 'https://schema.org/InStock',
            validFrom: new Date().toISOString().split('T')[0],
          },
        })),
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', 'p'],
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'صفحه اصلی',
            item: 'https://tehranroom.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'هتل‌ها و اقامتگاه‌ها',
            item: 'https://tehranroom.com/hotels',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: hotel.name,
            item: `https://tehranroom.com/hotels/${slug}`,
          },
        ],
      },
    ],
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

