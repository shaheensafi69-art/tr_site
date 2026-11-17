import React from 'react';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import ReviewsClientView from './ReviewsClientView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'نظرات و تجربیات مسافران هتل‌های تهران | TehranRoom',
  description: 'مشاهده نظرات، بازخوردها و امتیازات مسافران واقعی هتل‌های برتر تهران در پلتفرم تهران‌روم.',
};

export default async function ReviewsPage() {
  const supabase = createServerClient();

  const [{ data: reviewsData }, { data: hotelsData }] = await Promise.all([
    supabase
      .from('reviews')
      .select(`
        *,
        hotel:hotels(id, name, stars)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('hotels')
      .select('id, name, stars')
      .eq('is_published', true)
      .order('name', { ascending: true }),
  ]);

  const reviews = reviewsData || [];
  const hotels = hotelsData || [];

  return (
    <div className="min-h-screen dark-mesh-bg pt-28 pb-20 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
          <Link href="/" className="hover:text-amber-400">
            صفحه اصلی
          </Link>
          <span>/</span>
          <span className="text-white font-bold">نظرات و تجربیات مسافران</span>
        </div>

        <ReviewsClientView initialReviews={reviews as any} hotels={hotels} />
      </div>
    </div>
  );
}
