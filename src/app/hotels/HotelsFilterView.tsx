'use client';

import React, { useState, useMemo } from 'react';
import {
  Star,
  Filter,
  Building,
  SlidersHorizontal,
  RotateCcw,
  Waves,
  Home,
  Sparkles,
} from 'lucide-react';
import { HotelWithDetails } from '@/types/hotel';
import HotelCard from '@/components/hotels/HotelCard';
import VillaApartmentCard, { VillaApartmentItem } from '@/components/hotels/VillaApartmentCard';
import { toPersianDigits } from '@/lib/currency/currency-utils';

interface HotelsFilterViewProps {
  initialHotels: HotelWithDetails[];
  initialVillas?: VillaApartmentItem[];
}

export default function HotelsFilterView({ initialHotels, initialVillas = [] }: HotelsFilterViewProps) {
  // Category Tab: 'all' | 'hotels' | 'villas' | 'apartments' (User Request)
  const [category, setCategory] = useState<'all' | 'hotels' | 'villas' | 'apartments'>('all');
  const [selectedStars, setSelectedStars] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'stars_high' | 'stars_low'>('recommended');

  const starFilters = [
    { value: 'all', label: 'همه درجه‌ها' },
    { value: '5', label: '۵ ستاره', stars: 5 },
    { value: '4', label: '۴ ستاره', stars: 4 },
    { value: '3', label: '۳ ستاره', stars: 3 },
    { value: '2', label: '۲ ستاره', stars: 2 },
    { value: '1', label: '۱ ستاره', stars: 1 },
  ];

  // Filter & Sort Hotels
  const filteredHotels = useMemo(() => {
    if (category === 'villas' || category === 'apartments') return [];

    let result = [...initialHotels];

    // Filter by stars
    if (selectedStars !== 'all') {
      const starNumber = parseInt(selectedStars, 10);
      result = result.filter((h) => Number(h.stars) === starNumber);
    }

    // Sort
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'stars_high') {
      result.sort((a, b) => b.stars - a.stars);
    } else if (sortBy === 'stars_low') {
      result.sort((a, b) => a.stars - b.stars);
    } else {
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return result;
  }, [initialHotels, category, selectedStars, sortBy]);

  // Filter & Sort Villas / Apartments
  const filteredVillas = useMemo(() => {
    if (category === 'hotels') return [];

    let list = [...initialVillas];
    if (category === 'villas') {
      list = list.filter((v) => v.property_type === 'villa');
    } else if (category === 'apartments') {
      list = list.filter((v) => v.property_type === 'apartment');
    }

    if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [initialVillas, category, sortBy]);

  const totalResults = filteredHotels.length + filteredVillas.length;

  return (
    <div className="space-y-6">
      {/* 1. ACCOMMODATION CATEGORY BUTTONS (User Explicit Request: دکمه هتل و ویلا) */}
      <div className="glass-panel-dark rounded-3xl p-4 sm:p-5 border border-white/10 shadow-2xl space-y-4">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-300 block">انتخاب نوع اقامتگاه مورد نظر:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => setCategory('all')}
              className={`py-3 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 border transition-all ${
                category === 'all'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/25 scale-[1.02]'
                  : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/[0.08]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>همه اقامتگاه‌ها ({initialHotels.length + initialVillas.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setCategory('hotels')}
              className={`py-3 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 border transition-all ${
                category === 'hotels'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/25 scale-[1.02]'
                  : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/[0.08]'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>هتل‌های برتر ({initialHotels.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setCategory('villas')}
              className={`py-3 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 border transition-all ${
                category === 'villas'
                  ? 'bg-sky-400 text-slate-950 border-sky-300 shadow-lg shadow-sky-500/25 scale-[1.02]'
                  : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/[0.08]'
              }`}
            >
              <Waves className="w-4 h-4" />
              <span>ویلاهای استخردار ({initialVillas.filter((v) => v.property_type === 'villa').length})</span>
            </button>

            <button
              type="button"
              onClick={() => setCategory('apartments')}
              className={`py-3 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 border transition-all ${
                category === 'apartments'
                  ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/25 scale-[1.02]'
                  : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/[0.08]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>آپارتمان‌های مبله ({initialVillas.filter((v) => v.property_type === 'apartment').length})</span>
            </button>
          </div>
        </div>

        {/* 2. SUB-FILTERS: HOTEL STARS & SORTING */}
        <div className="pt-3 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* STAR FILTER BUTTONS (Shown when hotels are included) */}
          {(category === 'all' || category === 'hotels') ? (
            <div className="space-y-1.5 flex-1">
              <span className="text-[11px] font-bold text-neutral-400 block">درجه ستاره هتل:</span>
              <div className="flex flex-wrap items-center gap-2">
                {starFilters.map((opt) => {
                  const isSelected = selectedStars === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedStars(opt.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20'
                          : 'bg-white/[0.04] text-neutral-300 hover:text-white border border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {opt.stars && (
                        <span className={isSelected ? 'text-slate-950' : 'text-amber-400'}>
                          {'★'.repeat(opt.stars)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-xs text-neutral-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>رزرو مستقیم ویلاها و آپارتمان‌ها با تضمین نظافت و سلامت فضا</span>
            </div>
          )}

          {/* SORTING SELECT */}
          <div className="w-full md:w-52 shrink-0">
            <span className="text-[11px] font-bold text-neutral-400 block mb-1">مرتب‌سازی:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full glass-input rounded-2xl px-3 py-2 text-xs font-bold text-white cursor-pointer bg-[#090e1a] border border-white/10"
            >
              <option value="recommended" className="bg-[#0b1120] text-white">
                پیشنهاد تهران‌روم
              </option>
              <option value="rating" className="bg-[#0b1120] text-white">
                بیشترین امتیاز مسافران
              </option>
              <option value="stars_high" className="bg-[#0b1120] text-white">
                بیشترین ستاره / قیمت
              </option>
              <option value="stars_low" className="bg-[#0b1120] text-white">
                کمترین ستاره / قیمت
              </option>
            </select>
          </div>
        </div>

        {/* 3. ACTIVE SUMMARY BAR */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              نمایش {toPersianDigits(totalResults)} اقامتگاه فعال در پلتفرم تهران‌روم
            </span>
          </div>

          {(category !== 'all' || selectedStars !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setSelectedStars('all');
              }}
              className="text-amber-400 hover:text-amber-300 font-bold underline text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>مشاهده همه اقامتگاه‌ها</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. LISTINGS SECTION */}
      <div className="space-y-6">
        {totalResults === 0 ? (
          <div className="glass-panel-dark rounded-3xl p-12 text-center border border-white/10 space-y-4">
            <Building className="w-14 h-14 text-neutral-600 mx-auto" />
            <h3 className="text-lg font-black text-white">
              در حال حاضر اقامتگاهی با این فیلتر موجود نیست
            </h3>
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setSelectedStars('all');
              }}
              className="gold-glow-btn px-6 py-2.5 rounded-xl text-xs font-black"
            >
              مشاهده تمامی اقامتگاه‌های فعال
            </button>
          </div>
        ) : (
          <>
            {/* Render Hotels */}
            {filteredHotels.map((hotel) => (
              <div key={hotel.id} className="transition-all">
                <HotelCard hotel={hotel} />
              </div>
            ))}

            {/* Render Villas and Furnished Apartments */}
            {filteredVillas.map((villa) => (
              <div key={villa.id} className="transition-all">
                <VillaApartmentCard item={villa} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
