'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { gregorianToJalali, jalaliToGregorian, PERSIAN_MONTHS } from '@/lib/date-utils';
import { toPersianDigits } from '@/lib/currency/currency-utils';

interface RoomAvailabilityCalendarProps {
  roomId: string;
  roomName: string;
  onSelectDate?: (dateIso: string) => void;
}

export default function RoomAvailabilityCalendar({
  roomId,
  roomName,
  onSelectDate,
}: RoomAvailabilityCalendarProps) {
  const [busyRanges, setBusyRanges] = useState<{ start: string; end: string; type: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Current Shamsi date
  const now = new Date();
  const [currentJalaliYear, currentJalaliMonth] = gregorianToJalali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );

  const [viewYear, setViewYear] = useState<number>(currentJalaliYear);
  const [viewMonth, setViewMonth] = useState<number>(currentJalaliMonth);

  useEffect(() => {
    async function loadAvailability() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/rooms/${roomId}/availability`);
        const json = await res.json();
        if (json.success && json.busyRanges) {
          setBusyRanges(json.busyRanges);
        }
      } catch (err) {
        console.error('Failed to load room calendar availability', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAvailability();
  }, [roomId]);

  // Next / Prev Month navigation
  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewYear(viewYear + 1);
      setViewMonth(1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewYear(viewYear - 1);
      setViewMonth(12);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  // Determine days in current Jalali month
  const daysInMonth = viewMonth <= 6 ? 31 : viewMonth <= 11 ? 30 : 29;

  // Check if a day is booked or in the past
  const checkDayStatus = (day: number) => {
    const [gy, gm, gd] = jalaliToGregorian(viewYear, viewMonth, day);
    const dateStr = `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
    const checkDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkDate < today) {
      return { status: 'past', iso: dateStr };
    }

    const isBooked = busyRanges.some((range) => {
      return dateStr >= range.start && dateStr <= range.end;
    });

    if (isBooked) {
      return { status: 'booked', iso: dateStr };
    }

    return { status: 'available', iso: dateStr };
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="glass-panel-dark rounded-3xl p-5 sm:p-6 border border-white/10 space-y-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs sm:text-sm font-black text-white">
            تقویم هوشمند موجودی: {roomName}
          </h4>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>آزاد</span>
          </div>
          <div className="flex items-center gap-1 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>رزرو شده</span>
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-white/[0.04] px-3 py-2 rounded-2xl border border-white/10">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <span className="text-xs font-bold text-amber-400">
          {PERSIAN_MONTHS[viewMonth - 1]} {toPersianDigits(viewYear)}
        </span>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar Grid */}
      {isLoading ? (
        <div className="py-10 text-center text-xs text-neutral-400">
          در حال بارگذاری وضعیت تقویم هتل...
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs">
          {days.map((d) => {
            const { status, iso } = checkDayStatus(d);
            const isClickable = status === 'available' && onSelectDate;

            let bgClass = 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/50 hover:border-emerald-400';
            if (status === 'past') {
              bgClass = 'bg-white/[0.02] text-neutral-600 border-white/5 cursor-not-allowed opacity-40';
            } else if (status === 'booked') {
              bgClass = 'bg-rose-950/40 text-rose-300 border-rose-500/30 cursor-not-allowed';
            }

            return (
              <button
                key={d}
                type="button"
                disabled={status !== 'available'}
                onClick={() => {
                  if (isClickable) onSelectDate(iso);
                }}
                className={`p-2 sm:p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition-all ${bgClass}`}
                title={
                  status === 'available'
                    ? 'اتاق در این روز آزاد و قابل رزرو است'
                    : status === 'booked'
                    ? 'این روز قبلاً رزرو شده است'
                    : 'تاریخ گذشته'
                }
              >
                <span>{toPersianDigits(d)}</span>
                <span className="text-[9px] mt-0.5">
                  {status === 'available' ? 'آزاد' : status === 'booked' ? 'پر' : '-'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

