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
  MapPin,
} from 'lucide-react';
import { HotelWithDetails } from '@/types/hotel';
import HotelCard from '@/components/hotels/HotelCard';
import VillaApartmentCard, { VillaApartmentItem } from '@/components/hotels/VillaApartmentCard';
import { toPersianDigits } from '@/lib/currency/currency-utils';

export interface CityItem {
  id: string;
  name: string;
  slug: string;
  province_id: string;
  display_order?: number;
  province?: { id: string; name: string; slug: string };
}

interface HotelsFilterViewProps {
  initialHotels: HotelWithDetails[];
  initialVillas?: VillaApartmentItem[];
  initialCities?: CityItem[];
  defaultCity?: string;
  defaultHotelId?: string;
}

export default function HotelsFilterView({
  initialHotels,
  initialVillas = [],
  initialCities = [],
  defaultCity = 'all',
  defaultHotelId,
}: HotelsFilterViewProps) {
  // Category Tab: 'all' | 'hotels' | 'villas' | 'apartments'
  const [category, setCategory] = useState<'all' | 'hotels' | 'villas' | 'apartments'>('all');
  const [selectedCitySlug, setSelectedCitySlug] = useState<string>(defaultCity || 'all');
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

  // Helper to get selected city object
  const currentCityObj = useMemo(() => {
    if (selectedCitySlug === 'all') return null;
    return initialCities.find(
      (c) => c.slug === selectedCitySlug || c.id === selectedCitySlug || c.name === selectedCitySlug
    );
  }, [selectedCitySlug, initialCities]);

  // Filter & Sort Hotels
  const filteredHotels = useMemo(() => {
    if (category === 'villas' || category === 'apartments') return [];

    let result = [...initialHotels];

    // Filter by specific hotel ID if requested
    if (defaultHotelId && defaultHotelId !== 'all') {
      result = result.filter((h) => h.id === defaultHotelId);
    }

    // Filter by city
    if (selectedCitySlug !== 'all') {
      result = result.filter((h) => {
        const matchesSlug = h.city?.slug === selectedCitySlug;
        const matchesId = h.city?.id === selectedCitySlug || h.city_id === selectedCitySlug;
        const matchesName = currentCityObj && (h.city?.name === currentCityObj.name || h.address?.includes(currentCityObj.name));
        return matchesSlug || matchesId || matchesName;
      });
    }

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
  }, [initialHotels, category, selectedCitySlug, selectedStars, sortBy, defaultHotelId, currentCityObj]);

  // Filter & Sort Villas / Apartments
  const filteredVillas = useMemo(() => {
    if (category === 'hotels') return [];

    let list = [...initialVillas];

    // Filter by city
    if (selectedCitySlug !== 'all') {
      list = list.filter((v) => {
        const matchesCityId = currentCityObj && (v.city_id === currentCityObj.id || v.city?.id === currentCityObj.id);
        const matchesSlug = v.city?.slug === selectedCitySlug;
        const matchesName = currentCityObj && (
          v.location_area?.includes(currentCityObj.name) ||
          v.address?.includes(currentCityObj.name) ||
          v.name?.includes(currentCityObj.name)
        );
        return matchesCityId || matchesSlug || matchesName;
      });
    }

    if (category === 'villas') {
      list = list.filter((v) => v.property_type === 'villa');
    } else if (category === 'apartments') {
      list = list.filter((v) => v.property_type === 'apartment');
    }

    if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [initialVillas, category, selectedCitySlug, sortBy, currentCityObj]);

  const totalResults = filteredHotels.length + filteredVillas.length;

  return (
    <div className="space-y-6">
      {/* 1. CITY DESTINATION FILTER (User Explicit Request: فیلتر هتل‌ها نظر به شهر) */}
      <div className="glass-panel-dark rounded-3xl p-4 sm:p-5 border border-white/10 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>انتخاب شهر و مقصد سفر:</span>
          </span>
          {selectedCitySlug !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedCitySlug('all')}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>نمایش همه شهرها</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* All Cities Button */}
          <button
            type="button"
            onClick={() => setSelectedCitySlug('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 border ${
              selectedCitySlug === 'all'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/30 scale-[1.02]'
                : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/[0.08]'
            }`}
          >
            <span>همه مقاصد (کل کشور)</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${selectedCitySlug === 'all' ? 'bg-black/20 text-slate-950 font-bold' : 'bg-white/10 text-neutral-400'}`}>
              {initialHotels.length + initialVillas.length}
            </span>
          </button>

          {/* Individual Active Cities */}
          {initialCities.map((city) => {
            const isSelected = selectedCitySlug === city.slug || selectedCitySlug === city.id;
            // Count accommodations in this city
            const cityHotelsCount = initialHotels.filter(
              (h) => h.city?.slug === city.slug || h.city_id === city.id || h.city?.name === city.name
            ).length;
            const cityVillasCount = initialVillas.filter(
              (v) =>
                v.city_id === city.id ||
                v.city?.slug === city.slug ||
                v.location_area?.includes(city.name) ||
                v.address?.includes(city.name)
            ).length;
            const cityTotal = cityHotelsCount + cityVillasCount;

            return (
              <button
                key={city.id}
                type="button"
                onClick={() => setSelectedCitySlug(city.slug)}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/30 scale-[1.02]'
                    : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/[0.08]'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{city.name}</span>
                {cityTotal > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-black/20 text-slate-950 font-bold' : 'bg-white/10 text-neutral-400'}`}>
                    {cityTotal}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ACCOMMODATION CATEGORY BUTTONS (User Explicit Request: دکمه هتل و ویلا) */}
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

        {/* 3. SUB-FILTERS: HOTEL STARS & SORTING */}
        <div className="pt-3 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* STAR FILTER BUTTONS (Shown when hotels are included) */}
          {category === 'all' || category === 'hotels' ? (
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

        {/* 4. ACTIVE SUMMARY BAR */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              نمایش {toPersianDigits(totalResults)} اقامتگاه فعال {currentCityObj ? `در شهر ${currentCityObj.name}` : 'در سامانه'}
            </span>
          </div>

          {(category !== 'all' || selectedStars !== 'all' || selectedCitySlug !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setSelectedStars('all');
                setSelectedCitySlug('all');
              }}
              className="text-amber-400 hover:text-amber-300 font-bold underline text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>تنظیم مجدد همه فیلترها</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. LISTINGS SECTION */}
      <div className="space-y-6">
        {totalResults === 0 ? (
          <div className="glass-panel-dark rounded-3xl p-12 text-center border border-white/10 space-y-4">
            <Building className="w-14 h-14 text-neutral-600 mx-auto" />
            <h3 className="text-lg font-black text-white">
              {currentCityObj
                ? `در حال حاضر اقامتگاهی در شهر «${currentCityObj.name}» ثبت نشده است.`
                : 'در حال حاضر اقامتگاهی با این فیلتر موجود نیست.'}
            </h3>
            <p className="text-xs text-neutral-400">
              می‌توانید با انتخاب گزینه «همه مقاصد»، اقامتگاه‌های موجود در سایر مناطق را مشاهده بفرمایید.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setSelectedStars('all');
                setSelectedCitySlug('all');
              }}
              className="gold-glow-btn px-6 py-2.5 rounded-xl text-xs font-black"
            >
              مشاهده تمامی اقامتگاه‌های فعال کشور
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
