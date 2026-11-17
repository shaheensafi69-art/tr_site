'use client';

import React from 'react';
import Image from 'next/image';
import {
  Users,
  BedDouble,
  Maximize2,
  Coffee,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  Tv,
  Lock,
  Wind,
  Clock,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { RoomWithPricing } from '@/types/room';
import { useCurrency } from '@/lib/currency/currency-context';
import { toPersianDigits, convertPrice } from '@/lib/currency/currency-utils';

interface RoomCardProps {
  room: RoomWithPricing;
  onSelectRoom: (room: RoomWithPricing, bookingType: 'daily' | 'hourly') => void;
}

export default function RoomCard({ room, onSelectRoom }: RoomCardProps) {
  const { format, rates } = useCurrency();

  const dailyPriceToman = room.pricing?.special_price || room.pricing?.daily_price || 2000000;
  const originalDailyPriceToman = room.pricing?.daily_price || 2000000;
  const hasDiscount = (room.pricing?.discount_percentage || 0) > 0;
  const hourlyPriceToman = room.pricing?.hourly_price || 400000;

  const dailyPriceRial = dailyPriceToman * 10;
  const hourlyPriceRial = hourlyPriceToman * 10;

  return (
    <div className="glass-panel-dark glass-card-hover rounded-3xl overflow-hidden flex flex-col border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
      {/* ====================================================================
          TOP SECTION: ROOM VISUAL + SPECIFICATIONS & AMENITIES
         ==================================================================== */}
      <div className="flex flex-col md:flex-row">
        {/* Room Photo & Badges */}
        <div className="relative w-full md:w-5/12 lg:w-4/12 h-64 md:h-auto min-h-[260px] overflow-hidden shrink-0">
          <Image
            src={room.cover_image}
            alt={room.name}
            fill
            sizes="(max-width: 768px) 100vw, 35vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />

          {hasDiscount && (
            <div className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg border border-rose-400/40">
              {toPersianDigits(room.pricing?.discount_percentage || 0)}٪ تخفیف ویژه
            </div>
          )}

          <div className="absolute bottom-4 right-4 bg-black/85 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{toPersianDigits(room.size_sqm)} متر مربع</span>
          </div>
        </div>

        {/* Room Details & Amenities */}
        <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Title & Standard Capacity Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {room.name}
              </h3>

              <div className="inline-flex items-center gap-1.5 bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>ظرفیت: {toPersianDigits(room.standard_capacity)} نفر</span>
                {room.max_capacity > room.standard_capacity && (
                  <span className="text-amber-400/80 text-[11px]">
                    (تا {toPersianDigits(room.max_capacity)} نفر با سرویس اضافه)
                  </span>
                )}
              </div>
            </div>

            {/* Bed Type */}
            <p className="text-xs sm:text-sm text-neutral-300 flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">نوع تخت: {room.bed_type}</span>
            </p>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-justify">
              {room.description}
            </p>

            {/* Key Amenities (Clean 2x3 Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-neutral-200">
              <div className="flex items-center gap-2 bg-white/[0.04] p-2.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">صبحانه بوفه رایگان</span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.04] p-2.5 rounded-xl border border-white/10">
                <Tv className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">تلویزیون ۴K هوشمند</span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.04] p-2.5 rounded-xl border border-white/10">
                <Wind className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-semibold">سیستم تهویه مطبوع</span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.04] p-2.5 rounded-xl border border-white/10">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">صندوق امانات هتلی</span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.04] p-2.5 rounded-xl border border-white/10">
                <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">چای‌ساز و مینی‌بار</span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.04] p-2.5 rounded-xl border border-white/10">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">نظافت VIP روزانه</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          BOTTOM SECTION: DEDICATED FULL-WIDTH LUXURY PRICING & ACTION BOX
          (یک باکس بزرگ و جادار در زیر هر اتاق با زیرباکس‌های تفکیک‌شده برای تومان، ریال، دلار، یورو و دکمه رزرو)
         ==================================================================== */}
      <div className="w-full bg-[#060c1c]/90 backdrop-blur-xl p-4 sm:p-5 border-t border-white/10 rounded-b-3xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-center">
          {/* Sub-Box 1: قیمت روزانه (تومان، ریال، دلار و یورو) */}
          <div className="p-3.5 rounded-2xl bg-amber-400/[0.04] border border-amber-400/30 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-amber-300 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>اقامت روزانه (هر شب):</span>
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-neutral-400 line-through">
                  {originalDailyPriceToman.toLocaleString('fa-IR')} تومان
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-2 pt-0.5">
              <div className="text-base sm:text-lg font-black text-white">
                {dailyPriceToman.toLocaleString('fa-IR')}{' '}
                <span className="text-xs font-bold text-amber-400">تومان</span>
              </div>

              <div className="text-xs font-bold text-amber-200/90 bg-white/[0.06] px-2.5 py-0.5 rounded-xl border border-white/10 font-mono">
                {dailyPriceRial.toLocaleString('fa-IR')} ریال
              </div>
            </div>

            {/* معادل دلار و یورو */}
            <div className="flex items-center gap-2 pt-1.5 border-t border-white/[0.08] text-[11px] font-bold text-neutral-300">
              <span className="text-[10px] text-neutral-400">معادل ارزی:</span>
              <span className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-mono" dir="ltr">
                ${convertPrice(dailyPriceToman, 'USD', rates)} USD
              </span>
              <span className="bg-sky-500/10 text-sky-300 px-2 py-0.5 rounded-lg border border-sky-500/20 font-mono" dir="ltr">
                €{convertPrice(dailyPriceToman, 'EUR', rates)} EUR
              </span>
            </div>
          </div>

          {/* Sub-Box 2: قیمت ساعتی (تومان، ریال، دلار و یورو) یا مزایای اقامت */}
          {room.is_hourly_available ? (
            <div className="p-3.5 rounded-2xl bg-cyan-400/[0.04] border border-cyan-400/30 space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-cyan-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>اقامت ساعتی (۳ تا ۱۲ ساعت):</span>
                </span>
                <span className="text-[10px] text-cyan-300/80 font-bold bg-cyan-400/10 px-2 py-0.5 rounded-md">
                  انعطاف زمانی
                </span>
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-2 pt-0.5">
                <div className="text-base sm:text-lg font-black text-white">
                  {hourlyPriceToman.toLocaleString('fa-IR')}{' '}
                  <span className="text-xs font-bold text-cyan-400">تومان / ساعت</span>
                </div>

                <div className="text-xs font-bold text-cyan-200/90 bg-white/[0.06] px-2.5 py-0.5 rounded-xl border border-white/10 font-mono">
                  {hourlyPriceRial.toLocaleString('fa-IR')} ریال
                </div>
              </div>

              {/* معادل ساعتی دلار و یورو */}
              <div className="flex items-center gap-2 pt-1.5 border-t border-white/[0.08] text-[11px] font-bold text-neutral-300">
                <span className="text-[10px] text-neutral-400">معادل هر ساعت:</span>
                <span className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-mono" dir="ltr">
                  ${convertPrice(hourlyPriceToman, 'USD', rates)} USD
                </span>
                <span className="bg-sky-500/10 text-sky-300 px-2 py-0.5 rounded-lg border border-sky-500/20 font-mono" dir="ltr">
                  €{convertPrice(hourlyPriceToman, 'EUR', rates)} EUR
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-400/[0.04] border border-emerald-400/30 space-y-2 shadow-sm">
              <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>مزایای رزرو مستقیم:</span>
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed pt-0.5">
                تضمین بهترین قیمت، صبحانه بوفه رایگان و تایید فوری در هتل تابان
              </p>
              <div className="flex items-center gap-2 pt-1 border-t border-white/[0.08] text-[10px] text-neutral-400">
                <span>پذیرش کلیه کارت‌های شتاب و پرداخت ارزی</span>
              </div>
            </div>
          )}

          {/* Sub-Box 3: دکمه بزرگ و لوکس رزرو این اتاق */}
          <div>
            <button
              type="button"
              onClick={() => onSelectRoom(room, 'daily')}
              className="w-full gold-glow-btn py-4 px-6 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>رزرو آنلاین این اتاق</span>
              <ChevronLeft className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
