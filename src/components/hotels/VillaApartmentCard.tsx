'use client';

import React from 'react';
import Image from 'next/image';
import {
  Waves,
  Building,
  MapPin,
  Star,
  Users,
  BedDouble,
  Bath,
  Phone,
  CheckCircle2,
  CalendarCheck2,
  Car,
  Wifi,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useCurrency } from '@/lib/currency/currency-context';
import { toPersianDigits } from '@/lib/currency/currency-utils';

export interface VillaApartmentItem {
  id: string;
  property_type: 'villa' | 'apartment';
  name: string;
  slug: string;
  province_id?: string;
  city_id?: string;
  province?: { id: string; name: string; slug: string };
  city?: { id: string; name: string; slug: string };
  location_area: string;
  address: string;
  bedrooms_count: number;
  bathrooms_count: number;
  standard_capacity: number;
  max_capacity: number;
  size_sqm: number;
  daily_price: number;
  weekend_price: number;
  has_pool: boolean;
  has_jacuzzi: boolean;
  has_billiards: boolean;
  has_bbq: boolean;
  has_parking: boolean;
  has_wifi: boolean;
  cover_image: string;
  images: string[];
  description: string;
  rules: string[];
  google_maps_url: string;
  phone: string;
  rating: number;
  review_count: number;
}

interface VillaApartmentCardProps {
  item: VillaApartmentItem;
}

export default function VillaApartmentCard({ item }: VillaApartmentCardProps) {
  const { currency, format } = useCurrency();

  const isVilla = item.property_type === 'villa';

  return (
    <div className="group glass-panel-dark glass-card-hover rounded-3xl overflow-hidden flex flex-col md:flex-row border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all">
      {/* Property Image & Badges */}
      <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden bg-neutral-900 shrink-0">
        <Image
          src={item.cover_image || (item.images && item.images[0]) || '/bg_logo.png'}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />

        {/* Type Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-black backdrop-blur-md shadow-lg flex items-center gap-1.5 ${
              isVilla
                ? 'bg-sky-500/90 text-white shadow-sky-500/30'
                : 'bg-emerald-500/90 text-white shadow-emerald-500/30'
            }`}
          >
            {isVilla ? <Waves className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />}
            <span>{isVilla ? 'ویلای استخردار لوکس' : 'آپارتمان مبله VIP'}</span>
          </span>
        </div>

        {/* Photos Count & Rating */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <div className="bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-xl flex items-center gap-1.5 border border-white/10 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{toPersianDigits(item.rating || 5.0)}</span>
            <span className="text-[10px] text-neutral-400">({toPersianDigits(item.review_count || 12)} نظر)</span>
          </div>

          {Array.isArray(item.images) && item.images.length > 1 && (
            <div className="hidden sm:flex bg-black/80 backdrop-blur-md text-neutral-300 px-2.5 py-1 rounded-xl text-[10px] font-bold border border-white/10">
              {toPersianDigits(item.images.length)} عکس
            </div>
          )}
        </div>
      </div>

      {/* Info & Booking Section */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Header Row: Location & Verified */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-neutral-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{item.location_area} — {item.address}</span>
            </span>

            <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              تایید کیفیت تهران‌روم
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-400 transition-colors tracking-tight">
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Specs Bar */}
          <div className="grid grid-cols-4 gap-2 py-2 px-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 block">اتاق خواب:</span>
              <span className="font-mono font-black text-white">{toPersianDigits(item.bedrooms_count)} خواب</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block">سرویس حمام:</span>
              <span className="font-mono font-black text-white">{toPersianDigits(item.bathrooms_count)} مستر</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block">ظرفیت:</span>
              <span className="font-mono font-black text-white">تا {toPersianDigits(item.max_capacity)} نفر</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block">زیربنا:</span>
              <span className="font-mono font-black text-white">{toPersianDigits(item.size_sqm)} متر</span>
            </div>
          </div>

          {/* Amenities Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {item.has_pool && (
              <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-sky-500/10 text-sky-300 border border-sky-500/20 flex items-center gap-1">
                <Waves className="w-3 h-3" />
                <span>استخر آبگرم</span>
              </span>
            )}
            {item.has_jacuzzi && (
              <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                جکوزی
              </span>
            )}
            {item.has_billiards && (
              <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                میز بیلیارد
              </span>
            )}
            {item.has_bbq && (
              <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                باربیکیو
              </span>
            )}
            {item.has_parking && (
              <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/5 text-neutral-300 border border-white/10 flex items-center gap-1">
                <Car className="w-3 h-3" />
                <span>پارکینگ</span>
              </span>
            )}
            {item.has_wifi && (
              <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/5 text-neutral-300 border border-white/10 flex items-center gap-1">
                <Wifi className="w-3 h-3" />
                <span>اینترنت وای‌فای</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Reservation CTA */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-neutral-400 block">نرخ هر شب اقامت دربست:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                {format(item.daily_price)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {item.google_maps_url && (
              <a
                href={item.google_maps_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="مسیریابی روی گوگل مپ"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">گوگل مپ</span>
              </a>
            )}

            <a
              href={`tel:${item.phone || '+982191008899'}`}
              className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>هماهنگی و رزرو فوری</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
