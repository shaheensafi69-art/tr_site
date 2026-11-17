'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Search,
  ChevronDown,
  Sparkles,
  Check,
  Building,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Star,
} from 'lucide-react';
import { ProvinceRow } from '@/types/hotel';
import { supabase } from '@/lib/supabase/client';
import {
  getTodayIsoDate,
  getTomorrowIsoDate,
  formatToJalaliString,
  gregorianToJalali,
  jalaliToGregorian,
  PERSIAN_MONTHS,
} from '@/lib/date-utils';
import { toPersianDigits } from '@/lib/currency/currency-utils';

export default function SearchHeroBox() {
  const router = useRouter();

  // State
  const [stayType, setStayType] = useState<'daily' | 'hourly'>('daily');
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);

  // Check-in & Check-out in ISO (YYYY-MM-DD)
  const [checkInDate, setCheckInDate] = useState<string>(getTodayIsoDate());
  const [checkOutDate, setCheckOutDate] = useState<string>(getTomorrowIsoDate());

  // Jalali Calendar Modal State
  const [calendarTarget, setCalendarTarget] = useState<'checkIn' | 'checkOut' | null>(null);

  // Time & Duration for Hourly stay
  const [checkInTime, setCheckInTime] = useState<string>('14:00');
  const [durationHours, setDurationHours] = useState<number>(6);

  // Guests
  const [adults, setAdults] = useState<number>(2);
  const [guestsDropdownOpen, setGuestsDropdownOpen] = useState(false);

  // Published hotels and active cities from DB
  const [hotels, setHotels] = useState<{ id: string; name: string; stars: number; slug: string }[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    async function loadData() {
      const [hotelsRes, citiesRes] = await Promise.all([
        supabase
          .from('hotels')
          .select('id, name, stars, slug')
          .eq('is_published', true)
          .order('stars', { ascending: false }),
        supabase
          .from('cities')
          .select('id, name, slug')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('name', { ascending: true }),
      ]);

      if (hotelsRes.data && hotelsRes.data.length > 0) {
        setHotels(hotelsRes.data);
      }
      if (citiesRes.data && citiesRes.data.length > 0) {
        setCities(citiesRes.data);
      }
    }
    loadData();
  }, []);

  // Compute Jalali day/month/year for current checkIn and checkOut
  const jalaliCheckIn = useMemo(() => {
    const d = new Date(checkInDate);
    const [jy, jm, jd] = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const monthName = PERSIAN_MONTHS[jm - 1] || '';
    const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    const dayName = dayNames[d.getDay()] || '';
    return { jy, jm, jd, monthName, dayName, formatted: `${toPersianDigits(jd)} ${monthName} ${toPersianDigits(jy)}` };
  }, [checkInDate]);

  const jalaliCheckOut = useMemo(() => {
    const d = new Date(checkOutDate);
    const [jy, jm, jd] = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const monthName = PERSIAN_MONTHS[jm - 1] || '';
    const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    const dayName = dayNames[d.getDay()] || '';
    return { jy, jm, jd, monthName, dayName, formatted: `${toPersianDigits(jd)} ${monthName} ${toPersianDigits(jy)}` };
  }, [checkOutDate]);

  // Calendar View month/year state
  const [calJYear, setCalJYear] = useState<number>(jalaliCheckIn.jy);
  const [calJMonth, setCalJMonth] = useState<number>(jalaliCheckIn.jm);

  // Open calendar
  const openCalendar = (target: 'checkIn' | 'checkOut') => {
    setCalendarTarget(target);
    if (target === 'checkIn') {
      setCalJYear(jalaliCheckIn.jy);
      setCalJMonth(jalaliCheckIn.jm);
    } else {
      setCalJYear(jalaliCheckOut.jy);
      setCalJMonth(jalaliCheckOut.jm);
    }
  };

  const handleSelectJalaliDay = (day: number) => {
    const [gy, gm, gd] = jalaliToGregorian(calJYear, calJMonth, day);
    const isoString = `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;

    if (calendarTarget === 'checkIn') {
      setCheckInDate(isoString);
      // Auto-set checkOut to next day if checkOut <= new checkIn
      if (new Date(isoString) >= new Date(checkOutDate)) {
        const nextDay = new Date(new Date(isoString).getTime() + 24 * 60 * 60 * 1000);
        setCheckOutDate(nextDay.toISOString().split('T')[0]);
      }
      setCalendarTarget(null);
    } else if (calendarTarget === 'checkOut') {
      if (new Date(isoString) <= new Date(checkInDate)) {
        alert('تاریخ خروج باید بعد از تاریخ ورود باشد.');
        return;
      }
      setCheckOutDate(isoString);
      setCalendarTarget(null);
    }
  };

  const handlePrevMonth = () => {
    if (calJMonth === 1) {
      setCalJMonth(12);
      setCalJYear(calJYear - 1);
    } else {
      setCalJMonth(calJMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calJMonth === 12) {
      setCalJMonth(1);
      setCalJYear(calJYear + 1);
    } else {
      setCalJMonth(calJMonth + 1);
    }
  };

  // Month days count (months 1-6 have 31, 7-11 have 30, 12 has 29 or 30)
  const monthDaysCount = useMemo(() => {
    if (calJMonth <= 6) return 31;
    if (calJMonth <= 11) return 30;
    return 29;
  }, [calJMonth]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedDestination !== 'all') {
      if (selectedDestination.startsWith('city:')) {
        params.set('city', selectedDestination.replace('city:', ''));
      } else {
        params.set('hotel', selectedDestination);
      }
    }
    params.set('type', stayType);
    params.set('checkIn', checkInDate);
    if (stayType === 'daily') {
      params.set('checkOut', checkOutDate);
    } else {
      params.set('time', checkInTime);
      params.set('hours', durationHours.toString());
    }
    params.set('adults', adults.toString());

    router.push(`/hotels?${params.toString()}`);
  };

  const destinationLabel = useMemo(() => {
    if (selectedDestination === 'all') return 'همه مقاصد (کل کشور)';
    if (selectedDestination.startsWith('city:')) {
      const slug = selectedDestination.replace('city:', '');
      const foundCity = cities.find((c) => c.slug === slug || c.id === slug);
      return foundCity ? `شهر ${foundCity.name}` : 'انتخاب مقصد';
    }
    const found = hotels.find((h) => h.id === selectedDestination);
    return found ? `${found.name} (${toPersianDigits(found.stars)} ستاره)` : 'تهران';
  }, [selectedDestination, hotels, cities]);

  return (
    <div className="w-full max-w-5xl mx-auto glass-panel-dark rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-amber-400/20 text-slate-100 relative">
      {/* 1. STAY TYPE TABS (Daily vs Hourly) */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.08]">
        <button
          type="button"
          onClick={() => setStayType('daily')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            stayType === 'daily'
              ? 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(250,204,21,0.3)] font-black'
              : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>رزرو روزانه (شبانه)</span>
        </button>

        <button
          type="button"
          onClick={() => setStayType('hourly')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            stayType === 'hourly'
              ? 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(250,204,21,0.3)] font-black'
              : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>رزرو ساعتی (چند ساعته)</span>
          <span className="text-[10px] bg-slate-950 text-amber-400 px-2 py-0.5 rounded-full font-black border border-amber-400/30">
            جدید
          </span>
        </button>
      </div>

      {/* 2. SEARCH FORM */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 items-center">
        {/* Field 1: Destination / Hotel Selector */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-neutral-400 mb-1.5 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>مقصد یا اقامتگاه</span>
          </label>
          <button
            type="button"
            onClick={() => setDestDropdownOpen(!destDropdownOpen)}
            className="w-full flex items-center justify-between glass-input text-white rounded-2xl px-3.5 py-3 text-right transition-all hover:border-amber-400/50"
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 text-amber-400/80 shrink-0" />
              <span className="text-xs sm:text-sm font-bold truncate">
                {destinationLabel}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
          </button>

          {/* Destination Dropdown */}
          {destDropdownOpen && (
            <div className="absolute top-full mt-2 w-72 sm:w-80 glass-panel-dark rounded-2xl shadow-2xl z-50 p-2 max-h-96 overflow-y-auto border border-white/[0.15]">
              <div className="p-2 border-b border-white/[0.08] text-xs text-neutral-400 font-semibold flex items-center justify-between">
                <span>انتخاب مقصد یا هتل</span>
                <span className="text-[10px] text-amber-400">سراسر کشور</span>
              </div>
              <div className="py-1 space-y-1">
                {/* Option: All Destinations */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDestination('all');
                    setDestDropdownOpen(false);
                  }}
                  className={`w-full text-right p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    selectedDestination === 'all'
                      ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                      : 'text-neutral-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>همه مقاصد و اقامتگاه‌ها (کل کشور)</span>
                  </div>
                  {selectedDestination === 'all' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>

                {/* Cities Group */}
                {cities.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[10px] text-amber-300 font-bold px-2.5 py-1 bg-amber-400/10 rounded-lg mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>شهرهای فعال و مقاصد توریستی</span>
                    </div>
                    {cities.map((c) => {
                      const isSelected = selectedDestination === `city:${c.slug}`;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setSelectedDestination(`city:${c.slug}`);
                            setDestDropdownOpen(false);
                          }}
                          className={`w-full text-right p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                              : 'text-neutral-300 hover:bg-white/[0.06]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span className="font-bold text-white">شهر {c.name}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Hotels Group */}
                {hotels.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[10px] text-neutral-400 font-bold px-2.5 py-1 mb-1 flex items-center gap-1 border-t border-white/[0.06] pt-2">
                      <Building className="w-3 h-3 text-neutral-400" />
                      <span>هتل‌های شاخص</span>
                    </div>
                    {hotels.map((h) => {
                      const isSelected = selectedDestination === h.id;
                      return (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => {
                            setSelectedDestination(h.id);
                            setDestDropdownOpen(false);
                          }}
                          className={`w-full text-right p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                              : 'text-neutral-300 hover:bg-white/[0.06]'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-white">{h.name}</div>
                            <div className="text-[10px] text-amber-400 flex items-center gap-0.5">
                              {'★'.repeat(h.stars || 4)} {toPersianDigits(h.stars || 4)} ستاره
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Field 2: SHAMSI DATE PICKER - Check-in */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-400 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>تاریخ ورود (تقویم شمسی)</span>
          </label>
          <button
            type="button"
            onClick={() => openCalendar('checkIn')}
            className="w-full flex items-center justify-between glass-input text-white rounded-2xl px-3.5 py-2.5 text-right transition-all hover:border-amber-400/50 group"
          >
            <div>
              <div className="text-xs sm:text-sm font-black text-amber-300 group-hover:text-amber-200">
                {jalaliCheckIn.formatted}
              </div>
              <div className="text-[10px] text-neutral-400">
                {jalaliCheckIn.dayName}
              </div>
            </div>
            <Calendar className="w-4 h-4 text-amber-400/80 group-hover:scale-110 transition-transform shrink-0" />
          </button>
        </div>

        {/* Field 3: Check-out (Daily) OR Time/Hours (Hourly) */}
        {stayType === 'daily' ? (
          <div>
            <label className="block text-[11px] font-bold text-neutral-400 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>تاریخ خروج (تقویم شمسی)</span>
            </label>
            <button
              type="button"
              onClick={() => openCalendar('checkOut')}
              className="w-full flex items-center justify-between glass-input text-white rounded-2xl px-3.5 py-2.5 text-right transition-all hover:border-amber-400/50 group"
            >
              <div>
                <div className="text-xs sm:text-sm font-black text-amber-300 group-hover:text-amber-200">
                  {jalaliCheckOut.formatted}
                </div>
                <div className="text-[10px] text-neutral-400">
                  {jalaliCheckOut.dayName} (تخلیه ۱۲:۰۰ ظهر)
                </div>
              </div>
              <Calendar className="w-4 h-4 text-amber-400/80 group-hover:scale-110 transition-transform shrink-0" />
            </button>
          </div>
        ) : (
          <div>
            <label className="block text-[11px] font-bold text-neutral-400 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>ساعت و مدت اقامت</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <select
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full glass-input rounded-2xl px-2 py-3 text-xs font-semibold bg-[#0a0f1d] border border-white/10"
              >
                <option value="10:00">۱۰:۰۰ صبح</option>
                <option value="12:00">۱۲:۰۰ ظهر</option>
                <option value="14:00">۱۴:۰۰ بعدازظهر</option>
                <option value="16:00">۱۶:۰۰ عصر</option>
                <option value="18:00">۱۸:۰۰ غروب</option>
                <option value="20:00">۲۰:۰۰ شب</option>
              </select>

              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full glass-input rounded-2xl px-2 py-3 text-xs font-semibold bg-[#0a0f1d] border border-white/10"
              >
                <option value={3}>۳ ساعته</option>
                <option value={6}>۶ ساعته</option>
                <option value={12}>۱۲ ساعته</option>
              </select>
            </div>
          </div>
        )}

        {/* Field 4: Guests & Search Button */}
        <div className="flex items-center gap-2">
          {/* Guests Select */}
          <div className="relative flex-1">
            <label className="block text-[11px] font-bold text-neutral-400 mb-1.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>تعداد مسافران</span>
            </label>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full glass-input rounded-2xl px-3 py-3 text-xs sm:text-sm font-bold text-white bg-[#0a0f1d] border border-white/10 cursor-pointer"
            >
              <option value={1}>۱ نفر (سینگل)</option>
              <option value={2}>۲ نفر (دوتخته)</option>
              <option value={3}>۳ نفر (سه‌تخته)</option>
              <option value={4}>۴ نفر (سوئیت VIP)</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="self-end">
            <button
              type="submit"
              className="gold-glow-btn h-[48px] px-6 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>جستجو</span>
            </button>
          </div>
        </div>
      </form>

      {/* ====================================================================
          3. INTERACTIVE JALALI SHAMSI CALENDAR PICKER MODAL (User Request)
         ==================================================================== */}
      {calendarTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b101d] border-2 border-amber-400/40 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-black">
                  {calendarTarget === 'checkIn' ? 'انتخاب تاریخ ورود (شمسی)' : 'انتخاب تاریخ خروج (شمسی)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCalendarTarget(null)}
                className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Month & Year Navigator */}
            <div className="flex items-center justify-between bg-white/[0.04] p-2.5 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-neutral-300 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="text-sm font-black text-amber-300">
                {PERSIAN_MONTHS[calJMonth - 1]} {toPersianDigits(calJYear)}
              </span>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-neutral-300 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday Names Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-neutral-400 py-1 border-b border-white/5">
              <span>ش</span>
              <span>ی</span>
              <span>د</span>
              <span>س</span>
              <span>چ</span>
              <span>پ</span>
              <span className="text-rose-400">ج</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {Array.from({ length: monthDaysCount }).map((_, idx) => {
                const day = idx + 1;
                const isSelected =
                  calendarTarget === 'checkIn'
                    ? calJYear === jalaliCheckIn.jy && calJMonth === jalaliCheckIn.jm && day === jalaliCheckIn.jd
                    : calJYear === jalaliCheckOut.jy && calJMonth === jalaliCheckOut.jm && day === jalaliCheckOut.jd;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectJalaliDay(day)}
                    className={`h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/40 scale-105'
                        : 'bg-white/[0.03] hover:bg-amber-400/20 text-neutral-200 hover:text-white'
                    }`}
                  >
                    {toPersianDigits(day)}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  const todayIso = getTodayIsoDate();
                  if (calendarTarget === 'checkIn') setCheckInDate(todayIso);
                  else setCheckOutDate(getTomorrowIsoDate());
                  setCalendarTarget(null);
                }}
                className="text-amber-400 hover:underline font-bold text-[11px]"
              >
                انتخاب امروز
              </button>

              <button
                type="button"
                onClick={() => setCalendarTarget(null)}
                className="px-4 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/15 text-white font-bold text-[11px]"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
