'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Hotel,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Upload,
  ArrowRight,
  Sparkles,
  CreditCard,
  FileCheck2,
} from 'lucide-react';
import { HotelWithDetails } from '@/types/hotel';
import { RoomWithPricing } from '@/types/room';
import { useCurrency } from '@/lib/currency/currency-context';
import {
  getTodayIsoDate,
  getTomorrowIsoDate,
  calculateNights,
  formatToJalaliString,
} from '@/lib/date-utils';
import { toPersianDigits, convertPrice } from '@/lib/currency/currency-utils';
import RoomAvailabilityCalendar from '@/components/rooms/RoomAvailabilityCalendar';

interface BookingClientPageProps {
  hotel: HotelWithDetails;
  rooms: RoomWithPricing[];
  initialRoomId?: string;
  initialStayType?: 'daily' | 'hourly';
}

export default function BookingClientPage({
  hotel,
  rooms,
  initialRoomId,
  initialStayType = 'daily',
}: BookingClientPageProps) {
  const router = useRouter();
  const { currency, format, rates } = useCurrency();

  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    initialRoomId || (rooms.length > 0 ? rooms[0].id : '')
  );
  const [stayType, setStayType] = useState<'daily' | 'hourly'>(initialStayType);

  const [checkInDate, setCheckInDate] = useState<string>(getTodayIsoDate());
  const [checkOutDate, setCheckOutDate] = useState<string>(getTomorrowIsoDate());
  const [checkInTime, setCheckInTime] = useState<string>(hotel.hourly_start_time || '14:00');
  const [durationHours, setDurationHours] = useState<number>(hotel.min_hourly_duration || 3);

  const [totalGuests, setTotalGuests] = useState<number>(2);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [breakfastIncluded, setBreakfastIncluded] = useState<boolean>(true);

  // Customer contact info
  const [nationalityType, setNationalityType] = useState<'iranian' | 'foreigner'>('iranian');
  const [nationalityCountry, setNationalityCountry] = useState<string>('افغانستان');
  const [customerName, setCustomerName] = useState<string>('');
  const [nationalId, setNationalId] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Status & Submit
  const [step, setStep] = useState<'form' | 'submitting' | 'payment_ready'>('form');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Payment upload
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [copiedCard, setCopiedCard] = useState<string | null>(null);

  const activeRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  const dailyPrice = activeRoom?.pricing?.special_price || activeRoom?.pricing?.daily_price || 2000000;
  const hourlyPrice = activeRoom?.pricing?.hourly_price || 400000;
  const nights = calculateNights(checkInDate, checkOutDate);

  const totalToman = stayType === 'daily' ? dailyPrice * nights : hourlyPrice * durationHours;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || customerName.trim().length < 3) {
      setErrorMessage(nationalityType === 'foreigner' ? 'Please enter full passenger name / لطفاً نام و تخلص را وارد فرمایید.' : 'لطفاً نام و نام خانوادگی خود را کامل وارد فرمایید.');
      return;
    }

    if (!nationalId.trim() || nationalId.trim().length < 5) {
      setErrorMessage(nationalityType === 'foreigner' ? 'لطفاً شماره گذرنامه معتبر (Passport No) را وارد فرمایید.' : 'لطفاً کد ملی ۱۰ رقمی را وارد فرمایید.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setErrorMessage('شماره موبایل معتبر وارد نمایید.');
      return;
    }

    setStep('submitting');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotel_id: hotel.id,
          room_id: activeRoom.id,
          booking_type: stayType,
          check_in_date: checkInDate,
          check_out_date: stayType === 'daily' ? checkOutDate : checkInDate,
          check_in_time: stayType === 'hourly' ? checkInTime : null,
          duration_hours: stayType === 'hourly' ? durationHours : null,
          adults_count: adults,
          children_count: children,
          breakfast_included: breakfastIncluded,
          currency: currency,
          customer_name: customerName.trim(),
          national_id: nationalId.trim(),
          nationality_type: nationalityType,
          nationality_country: nationalityType === 'foreigner' ? nationalityCountry : 'ایران',
          customer_phone: customerPhone.trim(),
          customer_country_code: '+98',
          customer_email: customerEmail.trim() || undefined,
          special_requests: specialRequests.trim() || undefined,
        }),
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        setErrorMessage(resJson.message || 'ثبت رزرو با خطا مواجه شد.');
        setStep('form');
        return;
      }

      setBookingResult(resJson);

      // If user uploaded a receipt in the form, immediately send it to backend and telegram!
      if (receiptFile || trackingNumber.trim()) {
        try {
          const formData = new FormData();
          formData.append('booking_id', resJson.booking_id);
          formData.append('tracking_number', trackingNumber.trim());
          if (receiptFile) formData.append('receipt_file', receiptFile);
          await fetch('/api/payments/upload-receipt', { method: 'POST', body: formData });
          setUploadSuccess(true);
        } catch (uploadErr) {
          console.error('Initial receipt upload error:', uploadErr);
        }
      }

      setStep('payment_ready');
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ارتباط با سرور.');
      setStep('form');
    }
  };

  const handleUploadReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingResult?.booking_id) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('booking_id', bookingResult.booking_id);
      formData.append('tracking_number', trackingNumber);
      if (receiptFile) {
        formData.append('receipt_file', receiptFile);
      }

      const res = await fetch('/api/payments/upload-receipt', {
        method: 'POST',
        body: formData,
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        setErrorMessage(resJson.message || 'خطا در بارگذاری فیش');
        setIsUploading(false);
        return;
      }

      setUploadSuccess(true);
      setIsUploading(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در بارگذاری');
      setIsUploading(false);
    }
  };

  const copyCard = (num: string, label: string) => {
    navigator.clipboard.writeText(num);
    setCopiedCard(label);
    setTimeout(() => setCopiedCard(null), 2500);
  };

  return (
    <div className="min-h-screen dark-mesh-bg pt-28 pb-20 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
          <Link href="/" className="hover:text-amber-400">صفحه اصلی</Link>
          <span>/</span>
          <Link href={`/hotels/${hotel?.slug}`} className="hover:text-amber-400">{hotel?.name}</Link>
          <span>/</span>
          <span className="text-white font-bold">رزرو آنلاین اتاق</span>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Form Options */}
            <div className="lg:col-span-2 space-y-8">
              {/* TOP CARD-TO-CARD INSTRUCTION BANNER */}
              <div className="glass-panel-gold rounded-3xl p-6 sm:p-7 border border-amber-400/40 shadow-[0_15px_40px_rgba(234,179,8,0.15)] space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
                  <CreditCard className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>واریز کارت‌به‌کارت و ثبت آنی رزرو (وضعیت در انتظار تایید / Pending)</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  مهمان گرامی، جهت قطعی شدن رزرو اتاق، لطفاً مبلغ محاسبه‌شده را به شماره کارت رسمی رزرواسیون هتل تابان / تهران‌روم کارت‌به‌کارت فرمایید. پس از واریز، تصویر فیش را در انتهای همین فرم پیوست نمایید تا مشخصات شما فوراً به ربات تلگرام رزرواسیون ارسال شود:
                </p>

                <div className="bg-black/70 rounded-2xl p-4 sm:p-5 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="text-xs text-neutral-400">بانک سامان — به نام رزرواسیون هتل تابان / تهران‌روم</div>
                    <div className="text-xl sm:text-2xl font-mono font-black text-amber-300 tracking-widest" dir="ltr">
                      6219 - 8610 - 8888 - 9999
                    </div>
                    <div className="text-xs text-neutral-500 font-mono" dir="ltr">
                      IR12 0560 0861 0000 0088 8899 99
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('6219861088889999');
                      setCopiedCard('page_saman');
                      setTimeout(() => setCopiedCard(null), 2500);
                    }}
                    className="flex items-center gap-2 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-amber-400/30 self-start sm:self-center"
                  >
                    {copiedCard === 'page_saman' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>کپی شماره کارت</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-amber-400/15 text-xs sm:text-sm">
                  <span className="text-neutral-400">مبلغ واریزی برآورد شده:</span>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-black text-white text-lg">
                      {totalToman.toLocaleString()} تومان
                    </span>
                    <span className="text-xs text-amber-300 font-bold">
                      ({(totalToman * 10).toLocaleString()} ریال)
                    </span>
                    <span className="text-xs text-emerald-400 font-mono" dir="ltr">
                      ${convertPrice(totalToman, 'USD', rates)} USD
                    </span>
                    <span className="text-xs text-sky-400 font-mono" dir="ltr">
                      €{convertPrice(totalToman, 'EUR', rates)} EUR
                    </span>
                  </div>
                </div>
              </div>

              {/* 1. Room Selection */}
              <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
                <h2 className="text-base font-black text-white">
                  ۱. انتخاب نوع اتاق در {hotel?.name}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rooms.map((r) => {
                    const isSelected = r.id === selectedRoomId;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRoomId(r.id)}
                        className={`text-right p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-500/10'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white">{r.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                          </div>
                          <span className="text-[11px] text-neutral-400 block mb-2">{r.bed_type}</span>
                        </div>
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[10px] text-neutral-400">قیمت هر شب:</span>
                          <span className="text-xs font-black text-amber-400">
                            {format(r.pricing?.special_price || r.pricing?.daily_price || 2000000)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Stay Type & Dates */}
              <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-white">
                    ۲. نوع اقامت و تاریخ ورود
                  </h2>
                  <div className="flex items-center bg-white/[0.04] p-1 rounded-xl text-xs font-bold border border-white/10">
                    <button
                      type="button"
                      onClick={() => setStayType('daily')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        stayType === 'daily' ? 'bg-amber-400 text-slate-950 font-black shadow-md' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      رزرو روزانه
                    </button>
                    <button
                      type="button"
                      onClick={() => setStayType('hourly')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        stayType === 'hourly' ? 'bg-amber-400 text-slate-950 font-black shadow-md' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      رزرو ساعتی
                    </button>
                  </div>
                </div>

                {stayType === 'daily' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1">تاریخ ورود</label>
                      <input
                        type="date"
                        min={getTodayIsoDate()}
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full glass-input rounded-xl px-3.5 py-3 text-xs font-semibold"
                        required
                      />
                      <span className="text-[10px] text-neutral-400 block mt-1">
                        {formatToJalaliString(checkInDate)} (تحویل از ۱۴:۰۰)
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1">تاریخ خروج</label>
                      <input
                        type="date"
                        min={checkInDate}
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full glass-input rounded-xl px-3.5 py-3 text-xs font-semibold"
                        required
                      />
                      <span className="text-[10px] text-neutral-400 block mt-1">
                        {formatToJalaliString(checkOutDate)} (تخلیه تا ۱۲:۰۰)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1">تاریخ اقامت</label>
                      <input
                        type="date"
                        min={getTodayIsoDate()}
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1">ساعت ورود</label>
                      <select
                        value={checkInTime}
                        onChange={(e) => setCheckInTime(e.target.value)}
                        className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-semibold"
                      >
                        <option value="10:00">۱۰:۰۰ صبح</option>
                        <option value="12:00">۱۲:۰۰ ظهر</option>
                        <option value="14:00">۱۴:۰۰ بعدازظهر</option>
                        <option value="16:00">۱۶:۰۰ عصر</option>
                        <option value="18:00">۱۸:۰۰ عصر</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1">مدت زمان</label>
                      <select
                        value={durationHours}
                        onChange={(e) => setDurationHours(Number(e.target.value))}
                        className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-semibold"
                      >
                        <option value={3}>۳ ساعت</option>
                        <option value={6}>۶ ساعت</option>
                        <option value={12}>۱۲ ساعت</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Embedded Smart Calendar for Active Room */}
                {activeRoom && (
                  <div className="pt-2">
                    <RoomAvailabilityCalendar
                      roomId={activeRoom.id}
                      roomName={activeRoom.name}
                      onSelectDate={(iso) => setCheckInDate(iso)}
                    />
                  </div>
                )}
              </div>

              {/* 3. Guests Count (1 to 5) */}
              <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-white">
                    ۳. تعداد کل مسافران
                  </h2>
                  <span className="text-xs text-amber-400 font-bold">
                    {toPersianDigits(totalGuests)} نفر
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2.5">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setTotalGuests(num);
                        if (num === 1) {
                          setAdults(1);
                          setChildren(0);
                        } else {
                          setAdults(num);
                          setChildren(0);
                        }
                      }}
                      className={`py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
                        totalGuests === num
                          ? 'bg-amber-400 text-slate-950 font-black border-amber-400 shadow-lg shadow-amber-500/20'
                          : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {toPersianDigits(num)} نفر
                    </button>
                  ))}
                </div>

                {/* If more than 1 guest, show adults/children breakdown */}
                {totalGuests > 1 && (
                  <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/10 mt-3 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-1">
                          تعداد بزرگسالان (۱۰ سال به بالا - نرخ کامل)
                        </label>
                        <select
                          value={adults}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setAdults(val);
                            setChildren(totalGuests - val);
                          }}
                          className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-semibold"
                        >
                          {Array.from({ length: totalGuests }).map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {toPersianDigits(i + 1)} نفر
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-1">
                          تعداد کودکان (۵ الی ۱۰ سال - نیم‌بها ۵۰٪)
                        </label>
                        <select
                          value={children}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setChildren(val);
                            setAdults(totalGuests - val);
                          }}
                          className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-semibold"
                        >
                          {Array.from({ length: totalGuests }).map((_, i) => (
                            <option key={i} value={i}>
                              {i === 0 ? 'بدون کودک' : `${toPersianDigits(i)} کودک`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="text-[11px] text-amber-300/80 bg-amber-400/[0.05] p-2.5 rounded-xl border border-amber-400/20">
                      💡 <b>قوانین اطفال هتل:</b> اقامت کودکان تا ۵ سال تمام کاملاً رایگان است. کودکان ۵ تا ۱۰ سال نیم‌بها محاسبه می‌شوند و افراد بالای ۱۰ سال نفر کامل در نظر گرفته می‌شوند.
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Passenger Details */}
              <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-white">
                    ۴. مشخصات مسافر اصلی
                  </h2>
                  <span className="text-xs text-neutral-400">ثبت رسمی برای پذیرش هتل</span>
                </div>

                {/* Nationality Switcher */}
                <div className="grid grid-cols-2 gap-3 bg-white/[0.04] p-1.5 rounded-2xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setNationalityType('iranian')}
                    className={`py-2 text-xs font-bold rounded-xl transition-all ${
                      nationalityType === 'iranian'
                        ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    مسافر ایرانی (کد ملی)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNationalityType('foreigner')}
                    className={`py-2 text-xs font-bold rounded-xl transition-all ${
                      nationalityType === 'foreigner'
                        ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    اتباع و توریست خارجی (پاسپورت)
                  </button>
                </div>

                {nationalityType === 'foreigner' && (
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      کشور تابعیت (Nationality) <span className="text-amber-400">*</span>
                    </label>
                    <select
                      value={nationalityCountry}
                      onChange={(e) => setNationalityCountry(e.target.value)}
                      className="w-full glass-input rounded-xl px-3.5 py-3 text-xs font-semibold"
                    >
                      <option value="افغانستان">افغانستان (Afghanistan)</option>
                      <option value="عراق">عراق (Iraq)</option>
                      <option value="ترکیه">ترکیه (Turkey)</option>
                      <option value="امارات متحده عربی">امارات متحده عربی (UAE)</option>
                      <option value="سایر کشورهای خلیج فارس">سایر کشورهای عربی / حوزه خلیج فارس</option>
                      <option value="کشورهای اروپایی">کشورهای اروپایی (Europe)</option>
                      <option value="سایر کشورها">سایر کشورها (Other Countries)</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      اسم و تخلص مسافر <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={nationalityType === 'foreigner' ? 'Full Latin / Persian Name' : 'علی رضایی'}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full glass-input rounded-xl px-3.5 py-3 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      {nationalityType === 'foreigner' ? (
                        <>شماره گذرنامه (Passport No) <span className="text-amber-400">*</span></>
                      ) : (
                        <>کد ملی ۱۰ رقمی <span className="text-amber-400">*</span></>
                      )}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      placeholder={nationalityType === 'foreigner' ? 'e.g. P12345678' : '0012345678'}
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      className="w-full glass-input rounded-xl px-3.5 py-3 text-xs font-semibold text-left font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      شماره موبایل <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      required
                      placeholder="09120000000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full glass-input rounded-xl px-3.5 py-3 text-xs font-semibold text-left"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      ایمیل مسافر (اختیاری جهت دریافت واچر PDF)
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      placeholder="email@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full glass-input rounded-xl px-3.5 py-3 text-xs font-semibold text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      توضیحات و درخواست‌های خاص (اختیاری)
                    </label>
                    <input
                      type="text"
                      placeholder="طبقه بالا، ترانسفر فرودگاهی و ..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full glass-input rounded-xl px-3.5 py-3 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Payment Receipt Upload Section */}
              <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 border border-amber-400/25 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-amber-400" />
                    <span>۴. بارگذاری فیش واریز کارت‌به‌کارت</span>
                  </h2>
                  <span className="text-xs text-neutral-400">تأیید فوری رزرواسیون</span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  در صورت انجام انتقال وجه، تصویر رسید یا اسکرین‌شات انتقال را در کادر زیر انتخاب نمایید. پس از ثبت رزرو، اطلاعات مستقیماً به تلگرام فرستاده می‌شود و رزرو در وضعیت «در انتظار تأیید» قرار می‌گیرد.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="page_receipt_upload"
                      onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label
                      htmlFor="page_receipt_upload"
                      className="w-full flex items-center justify-center gap-2 p-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-dashed border-white/20 rounded-2xl cursor-pointer text-xs transition-all text-neutral-300"
                    >
                      <Upload className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate">
                        {receiptFile ? receiptFile.name : 'انتخاب تصویر فیش واریزی...'}
                      </span>
                    </label>
                  </div>

                  <div>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="شماره پیگیری فیش بانکی (اختیاری)"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full glass-input rounded-2xl px-3.5 py-3 text-xs text-left"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Price Summary Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-panel-dark rounded-3xl p-6 border border-white/10 sticky top-28 space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <span className="text-[11px] text-neutral-400 block mb-1">اقامتگاه انتخابی:</span>
                  <h3 className="text-base font-black text-white">{hotel?.name}</h3>
                  <span className="text-xs text-amber-400 font-bold block mt-0.5">
                    {activeRoom?.name}
                  </span>
                </div>

                <div className="space-y-3 text-xs text-neutral-300">
                  <div className="flex justify-between">
                    <span>مدت اقامت:</span>
                    <span className="font-bold text-white">
                      {stayType === 'daily'
                        ? `${toPersianDigits(nights)} شب`
                        : `${toPersianDigits(durationHours)} ساعت`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>بوفه صبحانه:</span>
                    <span className="font-bold text-emerald-400">رایگان (روی اتاق)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>کارمزد رزرواسیون:</span>
                    <span className="font-bold text-emerald-400">۰ تومان (رایگان)</span>
                  </div>
                </div>

                <div className="p-4 bg-white/[0.04] border border-white/10 rounded-2xl">
                  <span className="text-[11px] text-neutral-400 block mb-0.5">مبلغ نهایی:</span>
                  <span className="text-2xl font-black text-amber-400">
                    {format(totalToman)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full gold-glow-btn py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 font-black"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ثبت قطعی رزرو و دریافت کد</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {step === 'submitting' && (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-base font-bold text-white">
              در حال ثبت در سیستم رزرواسیون هتل تابان...
            </h3>
          </div>
        )}

        {step === 'payment_ready' && bookingResult && (
          <div className="max-w-2xl mx-auto glass-panel-dark rounded-3xl p-8 border border-white/10 space-y-6">
            {/* Prominent Tracking Code Display & Urgent Warning */}
            <div className="glass-panel-gold border border-amber-400/40 p-6 rounded-3xl text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
                <span>رزرو با موفقیت در وضعیت «در انتظار تأیید» (Pending) ثبت شد</span>
              </div>

              <div className="py-2">
                <span className="text-xs text-neutral-400 block mb-1.5">شماره پیگیری اختصاصی رزرو شما:</span>
                <div className="inline-flex items-center gap-3 bg-black/80 border-2 border-amber-400 px-6 py-3 rounded-2xl">
                  <span className="text-2xl sm:text-3xl font-mono font-black text-amber-300 tracking-widest">
                    {bookingResult.booking_code}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(bookingResult.booking_code);
                      setCopiedCard('page_booking_code');
                      setTimeout(() => setCopiedCard(null), 2500);
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-amber-400 transition-colors"
                    title="کپی شماره پیگیری"
                  >
                    {copiedCard === 'page_booking_code' ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Urgent Save Warning */}
              <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-4 text-right">
                <div className="flex items-center gap-2 text-amber-300 font-black text-xs sm:text-sm mb-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>مهم: لطفاً این شماره پیگیری را حتماً یادداشت و ذخیره کنید!</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  جهت استعلام لحظه‌ای وضعیت تأیید رسید پرداخت، هماهنگی ساعت ورود یا تحویل کلید در لابی هتل، به این شماره نیاز خواهید داشت. همچنین می‌توانید در هر لحظه وضعیت رزرو را در <b>سامانه پیگیری رزرو</b> بررسی فرمایید.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => router.push(`/booking/track?code=${bookingResult.booking_code}&phone=${customerPhone}`)}
                  className="flex-1 gold-glow-btn py-3.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>مشاهده و استعلام در سامانه پیگیری رزرو</span>
                </button>
              </div>
            </div>

            {/* Bank Card Info */}
            <div className="glass-panel-dark p-6 rounded-2xl space-y-4 border border-amber-500/30">
              <span className="text-xs font-bold text-amber-400 block">
                اطلاعات حساب بانکی جهت واریز کارت‌به‌کارت:
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-neutral-400">بانک سامان — به نام رزرواسیون تهران‌روم</p>
                  <p className="text-xl font-mono font-bold tracking-widest text-amber-300 mt-1" dir="ltr">
                    6219 - 8610 - 8888 - 9999
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyCard('6219861088889999', 'saman')}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/10"
                >
                  {copiedCard === 'saman' ? 'کپی شد!' : 'کپی شماره کارت'}
                </button>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between">
                <span className="text-xs text-neutral-400">مبلغ واریزی:</span>
                <span className="text-lg font-bold text-amber-400">
                  {bookingResult.total_amount_currency.toLocaleString()} {bookingResult.currency}
                </span>
              </div>
            </div>

            {/* Receipt Upload Form */}
            {!uploadSuccess ? (
              <form onSubmit={handleUploadReceipt} className="space-y-4 bg-white/[0.04] p-6 rounded-2xl border border-white/10">
                <h4 className="text-xs font-bold text-white">
                  بارگذاری فیش یا کد رهگیری واریز:
                </h4>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="شماره پیگیری تراکنش"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                  className="w-full glass-input rounded-xl px-3 py-1.5 text-xs file:py-1 file:px-2 file:bg-amber-400/20 file:border-0 file:rounded file:text-xs file:text-amber-300"
                />
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 border border-white/10"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>ارسال فیش واریزی</span>
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-950/40 text-emerald-300 border border-emerald-400/30 rounded-2xl text-center text-xs">
                ✓ رسید پرداخت با موفقیت ثبت شد و در صف تایید قرار گرفت.
              </div>
            )}

            <button
              type="button"
              onClick={() => router.push(`/booking/track?code=${bookingResult.booking_code}&phone=${customerPhone}`)}
              className="w-full gold-glow-btn py-3.5 rounded-2xl text-xs sm:text-sm font-black"
            >
              مشاهده واچر هوشمند دیجیتال
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

