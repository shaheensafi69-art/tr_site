'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Star, MessageSquare, ShieldCheck, Building2, Filter, RotateCcw } from 'lucide-react';
import { toPersianDigits } from '@/lib/currency/currency-utils';
import { formatToJalaliString } from '@/lib/date-utils';
import ReviewSubmitForm from './ReviewSubmitForm';

interface HotelItem {
  id: string;
  name: string;
  stars?: number;
}

interface ReviewItem {
  id: string;
  hotel_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_verified_stay: boolean;
  created_at: string;
  hotel?: {
    id: string;
    name: string;
    stars: number;
  };
}

interface ReviewsClientViewProps {
  initialReviews: ReviewItem[];
  hotels: HotelItem[];
}

export default function ReviewsClientView({
  initialReviews,
  hotels,
}: ReviewsClientViewProps) {
  const [selectedHotelFilter, setSelectedHotelFilter] = useState<string>('all');

  const filteredReviews = useMemo(() => {
    if (selectedHotelFilter === 'all') return initialReviews;
    return initialReviews.filter((r) => r.hotel_id === selectedHotelFilter);
  }, [initialReviews, selectedHotelFilter]);

  const totalReviews = filteredReviews.length;
  const avgRating =
    totalReviews > 0
      ? (
          filteredReviews.reduce((acc, r) => acc + (r.rating || 5), 0) /
          totalReviews
        ).toFixed(1)
      : '5.0';

  const selectedHotelName = useMemo(() => {
    if (selectedHotelFilter === 'all') return 'هتل‌های برتر تهران‌روم';
    const found = hotels.find((h) => h.id === selectedHotelFilter);
    return found?.name || 'اقامتگاه انتخابی';
  }, [selectedHotelFilter, hotels]);

  return (
    <div className="space-y-10">
      {/* Header & Stats Banner */}
      <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs text-amber-400 font-bold block mb-1">
            شفافیت و کیفیت مهمان‌نوازی
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            دیدگاه‌های میهمانان {selectedHotelName}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            کلیه نظرات ثبت شده پس از بررسی اصالت رزرواسیون منتشر می‌گردند.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/[0.04] border border-white/10 text-white p-5 rounded-2xl shrink-0">
          <div className="text-right">
            <span className="text-3xl font-black text-amber-400">
              {toPersianDigits(avgRating)}
            </span>
            <span className="text-xs text-neutral-400 block">از ۵ امتیاز</span>
          </div>
          <div className="border-r border-white/10 pr-4">
            <div className="flex text-amber-400 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-xs text-neutral-300">
              بر اساس {toPersianDigits(totalReviews)} نظر ثبت شده
            </span>
          </div>
        </div>
      </div>

      {/* Hotel Filter Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>فیلتر دیدگاه‌ها بر اساس اقامتگاه:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedHotelFilter('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              selectedHotelFilter === 'all'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                : 'bg-white/[0.04] text-neutral-300 hover:text-white border border-white/10 hover:bg-white/[0.08]'
            }`}
          >
            همه اقامتگاه‌ها ({toPersianDigits(initialReviews.length)})
          </button>

          {hotels.map((h) => {
            const isSelected = selectedHotelFilter === h.id;
            const count = initialReviews.filter((r) => r.hotel_id === h.id).length;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => setSelectedHotelFilter(h.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                    : 'bg-white/[0.04] text-neutral-300 hover:text-white border border-white/10 hover:bg-white/[0.08]'
                }`}
              >
                <span>{h.name}</span>
                <span className={isSelected ? 'text-slate-950 font-black' : 'text-neutral-400'}>
                  ({toPersianDigits(count)})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content: Reviews List + Submit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="glass-panel-dark rounded-3xl p-6 border border-white/10 shadow-lg space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">
                      {rev.customer_name}
                    </span>
                    {rev.is_verified_stay && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                        ✓ اقامت تایید شده
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex text-amber-400">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-neutral-400 font-mono" dir="ltr">
                      {formatToJalaliString(rev.created_at)}
                    </span>
                  </div>
                </div>

                {/* Hotel Tag */}
                {rev.hotel && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-300 text-[11px] font-bold border border-amber-400/20">
                    <Building2 className="w-3 h-3 text-amber-400" />
                    <span>اقامتگاه: {rev.hotel.name}</span>
                    <span className="text-amber-400">{'★'.repeat(rev.hotel.stars || 4)}</span>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-justify">
                  {rev.comment}
                </p>
              </div>
            ))
          ) : (
            <div className="glass-panel-dark rounded-3xl p-10 text-center text-neutral-400 border border-white/10 space-y-3">
              <MessageSquare className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-sm font-bold text-white">
                هنوز دیدگاهی برای {selectedHotelName} ثبت نشده است.
              </p>
              <p className="text-xs text-neutral-400">
                شما می‌توانید اولین نفری باشید که تجربه اقامت خود در این هتل را به اشتراک می‌گذارد!
              </p>
            </div>
          )}
        </div>

        {/* Submit Review Card with Hotel Selector */}
        <div className="lg:col-span-1">
          <ReviewSubmitForm
            hotels={hotels}
            defaultHotelId={selectedHotelFilter !== 'all' ? selectedHotelFilter : undefined}
          />
        </div>
      </div>
    </div>
  );
}
