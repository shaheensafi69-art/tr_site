'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Wifi, Utensils, Coffee, Car, ShieldCheck, ChevronLeft, BedDouble, Check } from 'lucide-react';
import { HotelWithDetails } from '@/types/hotel';
import { useCurrency } from '@/lib/currency/currency-context';
import { toPersianDigits, convertPrice } from '@/lib/currency/currency-utils';

interface HotelCardProps {
  hotel: HotelWithDetails;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const { format, rates } = useCurrency();

  const minPriceToman = hotel.min_price || 1950000;

  return (
    <div className="group glass-panel-dark glass-card-hover rounded-3xl overflow-hidden flex flex-col md:flex-row border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {/* Hotel Image with Badges */}
      <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
        <Image
          src={hotel.cover_image}
          alt={hotel.name}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />

        {/* Featured Badge */}
        {hotel.is_featured && (
          <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.4)] flex items-center gap-1">
            <span>هتل منتخب تهران‌روم</span>
          </div>
        )}

        {/* Rating overlay on mobile */}
        <div className="absolute bottom-4 right-4 md:hidden bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-bold mr-1">{toPersianDigits(hotel.rating)}</span>
          </div>
          <span className="text-[10px] text-neutral-400">({toPersianDigits(hotel.review_count)} نظر)</span>
        </div>
      </div>

      {/* Hotel Info & Pricing */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Stars & Location */}
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="text-xs text-neutral-400 mr-2 font-medium">
                هتل {toPersianDigits(hotel.stars)} ستاره لوکس
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-white/[0.04] backdrop-blur-md text-white px-3.5 py-1 rounded-xl text-xs font-bold border border-white/[0.08]">
              <span>امتیاز {toPersianDigits(hotel.rating)}</span>
              <span className="text-amber-400 font-extrabold">از ۵</span>
              <span className="text-[11px] text-neutral-400">({toPersianDigits(hotel.review_count)} نظر)</span>
            </div>
          </div>

          {/* Hotel Name */}
          <Link href={`/hotels/${hotel.slug}`}>
            <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-400 transition-colors mb-2 tracking-tight">
              {hotel.name}
            </h3>
          </Link>

          {/* Address */}
          <p className="text-xs sm:text-sm text-neutral-400 flex items-center gap-1.5 mb-3.5">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{hotel.address}</span>
          </p>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 leading-relaxed mb-5">
            {hotel.short_description}
          </p>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1 text-xs bg-white/[0.04] border border-white/[0.08] text-neutral-300 px-3 py-1.5 rounded-xl">
              <Wifi className="w-3.5 h-3.5 text-amber-400" />
              <span>وای‌فای پرسرعت رایگان</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-white/[0.04] border border-white/[0.08] text-neutral-300 px-3 py-1.5 rounded-xl">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              <span>صبحانه بوفه سلف‌سرویس</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-white/[0.04] border border-white/[0.08] text-neutral-300 px-3 py-1.5 rounded-xl">
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>کافی‌شاپ ۲۴ ساعته</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-white/[0.04] border border-white/[0.08] text-neutral-300 px-3 py-1.5 rounded-xl">
              <Car className="w-3.5 h-3.5 text-amber-400" />
              <span>پارکینگ اختصاصی</span>
            </span>
          </div>
        </div>

        {/* Bottom Pricing & Action */}
        <div className="pt-4 border-t border-white/[0.08] flex items-end justify-between gap-4">
          <div>
            <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">
              شروع قیمت از هر شب:
            </span>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-white">
                {format(minPriceToman)}
              </span>
              <span className="text-xs font-bold text-neutral-400 font-mono" dir="ltr">
                ({(minPriceToman * 10).toLocaleString('fa-IR')} ریال)
              </span>
              <span className="text-xs font-bold text-emerald-400 font-mono" dir="ltr">
                ${convertPrice(minPriceToman, 'USD', rates)} USD
              </span>
              <span className="text-xs font-bold text-sky-400 font-mono" dir="ltr">
                €{convertPrice(minPriceToman, 'EUR', rates)} EUR
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold block mt-0.5 flex items-center gap-1">
              <span>✓ شامل صبحانه بوفه و بدون مالیات پنهان</span>
            </span>
          </div>

          <Link
            href={`/hotels/${hotel.slug}`}
            className="gold-glow-btn px-6 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shrink-0 group-hover:scale-105"
          >
            <span>مشاهده اتاق‌ها و رزرو</span>
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

