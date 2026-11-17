import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import BookingClientPage from './BookingClientPage';
import { HotelWithDetails } from '@/types/hotel';
import { RoomWithPricing } from '@/types/room';

export const metadata = {
  title: 'رزرو آنلاین اتاق | TehranRoom',
  description: 'رزرو آنلاین و لحظه‌ای اتاق‌های هتل تابان تهران به صورت روزانه و ساعتی با تایید فوری.',
};

interface BookingPageProps {
  searchParams: Promise<{
    hotel?: string;
    room?: string;
    type?: string;
  }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams;
  const hotelSlug = params.hotel || 'hotel-taban';
  const selectedRoomId = params.room;
  const stayType = params.type === 'hourly' ? 'hourly' : 'daily';

  const supabase = createServerClient();

  // Fetch hotel
  const { data: hotelData } = await supabase
    .from('hotels')
    .select(`
      *,
      province:provinces(*),
      city:cities(*)
    `)
    .eq('slug', hotelSlug)
    .single();

  const hotel: HotelWithDetails = (hotelData as any) || null;

  // Fetch rooms for this hotel
  const { data: roomsData } = await supabase
    .from('rooms')
    .select(`
      *,
      pricing:room_pricing(*)
    `)
    .eq('hotel_id', hotel?.id)
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  const rooms: RoomWithPricing[] = (roomsData || []).map((r: any) => ({
    ...r,
    pricing: Array.isArray(r.pricing) ? r.pricing[0] : r.pricing,
  }));

  return (
    <BookingClientPage
      hotel={hotel}
      rooms={rooms}
      initialRoomId={selectedRoomId}
      initialStayType={stayType}
    />
  );
}

