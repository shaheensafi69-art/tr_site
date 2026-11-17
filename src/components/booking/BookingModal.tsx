'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
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
  FileCheck2,
  CreditCard,
} from 'lucide-react';
import { RoomWithPricing } from '@/types/room';
import { HotelRow } from '@/types/hotel';
import { useCurrency } from '@/lib/currency/currency-context';
import {
  getTodayIsoDate,
  getTomorrowIsoDate,
  calculateNights,
  formatToJalaliString,
} from '@/lib/date-utils';
import { toPersianDigits } from '@/lib/currency/currency-utils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: HotelRow;
  room: RoomWithPricing;
  initialBookingType?: 'daily' | 'hourly';
}

export default function BookingModal({
  isOpen,
  onClose,
  hotel,
  room,
  initialBookingType = 'daily',
}: BookingModalProps) {
  const router = useRouter();
  const { currency, format, rates } = useCurrency();

  // Booking details state
  const [bookingType, setBookingType] = useState<'daily' | 'hourly'>(initialBookingType);
  const [checkInDate, setCheckInDate] = useState<string>(getTodayIsoDate());
  const [checkOutDate, setCheckOutDate] = useState<string>(getTomorrowIsoDate());
  const [checkInTime, setCheckInTime] = useState<string>(hotel.hourly_start_time || '14:00');
  const [durationHours, setDurationHours] = useState<number>(hotel.min_hourly_duration || 3);
  const [totalGuests, setTotalGuests] = useState<number>(2);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [breakfastIncluded, setBreakfastIncluded] = useState<boolean>(true);

  // Customer contact & nationality info
  const [nationalityType, setNationalityType] = useState<'iranian' | 'foreigner'>('iranian');
  const [nationalityCountry, setNationalityCountry] = useState<string>('افغانستان');
  const [customerName, setCustomerName] = useState<string>('');
  const [nationalId, setNationalId] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // UI Flow & Submit State
  const [step, setStep] = useState<'form' | 'submitting' | 'payment_ready'>('form');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Payment upload state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [copiedCard, setCopiedCard] = useState<string | null>(null);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState<boolean>(false);
  const [receiptSuccess, setReceiptSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Price calculations
  const dailyRate = room.pricing?.special_price || room.pricing?.daily_price || 2000000;
  const hourlyRate = room.pricing?.hourly_price || 400000;
  const nights = calculateNights(checkInDate, checkOutDate);

  let estimatedTotalToman = 0;
  if (bookingType === 'daily') {
    estimatedTotalToman = dailyRate * nights;
  } else {
    estimatedTotalToman = hourlyRate * durationHours;
  }

  // Handle form submission to create booking
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || customerName.trim().length < 3) {
      setErrorMessage(nationalityType === 'foreigner' ? 'Please enter full passenger name / لطفاً نام و تخلص را وارد نمایید' : 'لطفاً نام و نام خانوادگی خود را کامل وارد نمایید.');
      return;
    }

    if (!nationalId.trim() || nationalId.trim().length < 5) {
      setErrorMessage(nationalityType === 'foreigner' ? 'لطفاً شماره گذرنامه معتبر (Passport No) را وارد فرمایید.' : 'لطفاً کد ملی ۱۰ رقمی را وارد نمایید.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setErrorMessage('شماره تلفن همراه معتبر وارد نمایید.');
      return;
    }

    setStep('submitting');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotel_id: hotel.id,
          room_id: room.id,
          booking_type: bookingType,
          check_in_date: checkInDate,
          check_out_date: bookingType === 'daily' ? checkOutDate : checkInDate,
          check_in_time: bookingType === 'hourly' ? checkInTime : null,
          duration_hours: bookingType === 'hourly' ? durationHours : null,
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

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        setErrorMessage(resData.message || 'ثبت رزرو با خطا مواجه شد.');
        setStep('form');
        return;
      }

      setBookingResult(resData);

      // If user uploaded a receipt file or tracking number directly in the initial form, send it now!
      if (receiptFile || trackingNumber.trim()) {
        try {
          const formData = new FormData();
          formData.append('booking_id', resData.booking_id);
          formData.append('tracking_number', trackingNumber.trim());
          if (receiptFile) formData.append('receipt_file', receiptFile);
          await fetch('/api/payments/upload-receipt', { method: 'POST', body: formData });
          setReceiptSuccess(true);
        } catch (uploadErr) {
          console.error('Initial receipt upload error:', uploadErr);
        }
      }

      setStep('payment_ready');
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ارتباط با سرور رزرواسیون.');
      setStep('form');
    }
  };

  // Handle receipt upload
  const handleUploadReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingResult?.booking_id) return;
    if (!receiptFile && !trackingNumber) {
      setErrorMessage('لطفاً تصویر فیش واریزی یا شماره پیگیری تراکنش را وارد نمایید.');
      return;
    }

    setIsUploadingReceipt(true);
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

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'خطا در بارگذاری رسید.');
        setIsUploadingReceipt(false);
        return;
      }

      setReceiptSuccess(true);
      setIsUploadingReceipt(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در بارگذاری فیش واریزی.');
      setIsUploadingReceipt(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCard(label);
    setTimeout(() => setCopiedCard(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl glass-panel-dark rounded-3xl shadow-2xl border border-white/10 overflow-hidden my-8 text-white">
        {/* Modal Header */}
        <div className="bg-white/[0.03] text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
          <div>
            <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
              سامانه رزرواسیون تهران‌روم
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {hotel.name} — {room.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-950/50 border border-rose-500/30 text-rose-300 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleSubmitBooking} className="space-y-5">
              {/* TOP CARD-TO-CARD INSTRUCTION BOX */}
              <div className="glass-panel-gold rounded-2xl p-4 sm:p-5 border border-amber-400/40 shadow-[0_10px_30px_rgba(234,179,8,0.15)] space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
                  <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>واریز کارت‌به‌کارت و ثبت آنی رزرو (وضعیت Pending)</span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed">
                  مهمان گرامی، لطفاً مبلغ رزرو را به شماره کارت رسمی رزرواسیون هتل تابان کارت‌به‌کارت فرمایید. پس از واریز، فیش واریزی را در همین فرم بارگذاری کنید تا مشخصات کامل شما همراه با تصویر فیش فوراً به ربات تلگرام هتل ارسال شده و رزرو در حالت «در انتظار تأیید» ثبت گردد:
                </p>

                <div className="bg-black/70 rounded-xl p-3.5 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-[11px] text-neutral-400">بانک سامان — به نام رزرواسیون تهران‌روم / هتل تابان</div>
                    <div className="text-base sm:text-lg font-mono font-black text-amber-300 tracking-widest" dir="ltr">
                      6219 - 8610 - 8888 - 9999
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono" dir="ltr">
                      IR12 0560 0861 0000 0088 8899 99
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard('6219861088889999', 'top_modal_card')}
                    className="flex items-center gap-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 px-3 py-2 rounded-xl text-xs font-bold transition-all border border-amber-400/30 self-start sm:self-center"
                  >
                    {copiedCard === 'top_modal_card' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>کپی شماره کارت</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-amber-400/15 text-xs">
                  <span className="text-neutral-400">مبلغ واریزی مورد نیاز:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-black text-white text-base">
                      {estimatedTotalToman.toLocaleString()} تومان
                    </span>
                    <span className="text-[11px] text-amber-300 font-bold">
                      ({(estimatedTotalToman * 10).toLocaleString()} ریال)
                    </span>
                  </div>
                </div>
              </div>

              {/* Stay Type Switch */}
              <div className="flex items-center gap-2 bg-white/[0.04] p-1.5 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setBookingType('daily')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    bookingType === 'daily'
                      ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  رزرو روزانه (شبانه)
                </button>
                {room.is_hourly_available && (
                  <button
                    type="button"
                    onClick={() => setBookingType('hourly')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      bookingType === 'hourly'
                        ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    رزرو ساعتی (اقامت موقت)
                  </button>
                )}
              </div>

              {/* Dates & Times */}
              {bookingType === 'daily' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">تاریخ ورود</label>
                    <input
                      type="date"
                      min={getTodayIsoDate()}
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-semibold"
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
                      className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-semibold"
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
                      <option value="20:00">۲۰:۰۰ شب</option>
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

              {/* Guests Count Selector (1 to 5) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-300">
                    تعداد کل مسافران (ظرفیت: ۱ تا ۵ نفر)
                  </label>
                  <span className="text-[11px] text-amber-400 font-bold">
                    {toPersianDigits(totalGuests)} نفر
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
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
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        totalGuests === num
                          ? 'bg-amber-400 text-slate-950 font-black border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {toPersianDigits(num)} نفر
                    </button>
                  ))}
                </div>

                {/* If more than 1 guest selected, show adults/children breakdown */}
                {totalGuests > 1 && (
                  <div className="p-3 bg-white/[0.02] rounded-2xl border border-white/10 mt-2 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                          بزرگسال (۱۰ سال به بالا - نرخ کامل)
                        </label>
                        <select
                          value={adults}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setAdults(val);
                            setChildren(totalGuests - val);
                          }}
                          className="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold"
                        >
                          {Array.from({ length: totalGuests }).map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {toPersianDigits(i + 1)} نفر
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                          کودک (۵ الی ۱۰ سال - نیم‌بها ۵۰٪)
                        </label>
                        <select
                          value={children}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setChildren(val);
                            setAdults(totalGuests - val);
                          }}
                          className="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold"
                        >
                          {Array.from({ length: totalGuests }).map((_, i) => (
                            <option key={i} value={i}>
                              {i === 0 ? 'بدون کودک' : `${toPersianDigits(i)} کودک`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="text-[10px] text-amber-300/80 bg-amber-400/[0.05] p-2 rounded-xl border border-amber-400/20">
                      💡 <b>قوانین اطفال:</b> اقامت کودکان تا ۵ سال تمام کاملاً رایگان است. کودکان ۵ تا ۱۰ سال نیم‌بها محاسبه می‌شوند و افراد بالای ۱۰ سال به عنوان مسافر کامل محسوب می‌گردند.
                    </div>
                  </div>
                )}
              </div>

              {/* Breakfast Option */}
              <div className="p-3 bg-white/[0.04] border border-white/10 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">صبحانه بوفه سلف‌سرویس هتل</h4>
                  <p className="text-[11px] text-neutral-400">سرو گرم و سرد در رستوران هتل تابان</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>رایگان (روی اتاق)</span>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-amber-400">مشخصات مسافر اصلی</h3>
                  <span className="text-[10px] text-neutral-400">ثبت رسمی جهت پذیرش هتل</span>
                </div>

                {/* Nationality Switcher */}
                <div className="grid grid-cols-2 gap-2 bg-white/[0.04] p-1 rounded-2xl border border-white/10">
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
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      کشور تابعیت (Nationality) <span className="text-amber-400">*</span>
                    </label>
                    <select
                      value={nationalityCountry}
                      onChange={(e) => setNationalityCountry(e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold"
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      اسم و تخلص مسافر <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={nationalityType === 'foreigner' ? 'نام و تخلص لاتین / فارسی' : 'مثال: علی رضایی'}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      {nationalityType === 'foreigner' ? (
                        <>شماره گذرنامه (Passport No) <span className="text-amber-400">*</span></>
                      ) : (
                        <>کد ملی ۱۰ رقمی <span className="text-amber-400">*</span></>
                      )}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder={nationalityType === 'foreigner' ? 'e.g. P12345678' : '0012345678'}
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-semibold text-left font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      شماره تماس همراه <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder="09120000000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-semibold text-left"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      ایمیل مسافر (اختیاری جهت واچر PDF)
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      placeholder="email@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-semibold text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      توضیحات و درخواست خاص (اختیاری)
                    </label>
                    <input
                      type="text"
                      placeholder="طبقه بالا، ترانسفر فرودگاهی و ..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Receipt Upload & Tracking Number (Directly in form) */}
              <div className="p-4 rounded-2xl glass-panel-dark border border-amber-400/25 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Upload className="w-4 h-4" />
                    <span>بارگذاری فیش واریز کارت‌به‌کارت (رسید پرداخت)</span>
                  </label>
                  <span className="text-[10px] text-neutral-400">جهت تایید فوری</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="modal_receipt_file"
                      onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label
                      htmlFor="modal_receipt_file"
                      className="w-full flex items-center justify-center gap-2 p-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-dashed border-white/20 rounded-xl cursor-pointer text-xs transition-all text-neutral-300"
                    >
                      <Upload className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate">
                        {receiptFile ? receiptFile.name : 'انتخاب تصویر فیش بانکی...'}
                      </span>
                    </label>
                  </div>

                  <div>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="شماره پیگیری فیش (اختیاری)"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2.5 text-xs text-left"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-neutral-400">
                  فیش بارگذاری‌شده همراه با اطلاعات رزرو فوراً به ربات تلگرام هتل ارسال و رزرو در حالت Pending قرار می‌گیرد.
                </p>
              </div>

              {/* Price Calculation Summary & Submit */}
              <div className="p-4 bg-white/[0.04] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-neutral-400 block">
                    {bookingType === 'daily'
                      ? `مجموع برای ${toPersianDigits(nights)} شب اقامت:`
                      : `مجموع برای ${toPersianDigits(durationHours)} ساعت اقامت:`}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-amber-400">
                      {format(estimatedTotalToman)}
                    </span>
                    <span className="text-xs text-neutral-400">
                      ({(estimatedTotalToman * 10).toLocaleString()} ریال)
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="gold-glow-btn w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ثبت رزرو و ارسال فیش (وضعیت Pending)</span>
                </button>
              </div>
            </form>
          )}

          {step === 'submitting' && (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-base font-bold text-white">
                در حال بررسی ظرفیت و ثبت قطعی در سیستم رزرواسیون هتل...
              </h3>
              <p className="text-xs text-neutral-400">
                قفل موقت اتاق به مدت ۳۰ دقیقه فعال خواهد شد.
              </p>
            </div>
          )}

          {step === 'payment_ready' && bookingResult && (
            <div className="space-y-6">
              {/* Prominent Tracking Code with Save Alert */}
              <div className="glass-panel-gold border border-amber-400/40 p-5 rounded-3xl text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  <span>رزرو با موفقیت در وضعیت «در انتظار تأیید» (Pending) ثبت شد</span>
                </div>

                <div className="py-2">
                  <span className="text-[11px] text-neutral-400 block mb-1">کد پیگیری اختصاصی رزرو شما:</span>
                  <div className="inline-flex items-center gap-3 bg-black/80 border-2 border-amber-400 px-5 py-2.5 rounded-2xl">
                    <span className="text-xl sm:text-2xl font-mono font-black text-amber-300 tracking-widest">
                      {bookingResult.booking_code}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(bookingResult.booking_code, 'modal_booking_code')}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-amber-400 transition-colors"
                      title="کپی شماره پیگیری"
                    >
                      {copiedCard === 'modal_booking_code' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Important Save Warning */}
                <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-3.5 text-right">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>مهم: لطفاً این شماره پیگیری را حتماً ذخیره و یادداشت فرمایید!</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    با داشتن این شماره می‌توانید در هر لحظه وضعیت تأیید رسید واریزی، زمان دقیق تحویل اتاق و واچر رسمی ورود به هتل را در <b>سامانه پیگیری رزرو</b> مشاهده فرمایید.
                  </p>
                </div>
              </div>

              {/* Bank Account Info for Card-to-Card */}
              <div className="glass-panel-dark p-5 rounded-2xl space-y-4 border border-amber-500/30">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-amber-400">اطلاعات حساب واریز کارت‌به‌کارت</span>
                  <span className="text-xs text-neutral-400">مبلغ قابل پرداخت:</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-neutral-400">بانک سامان — به نام رزرواسیون تهران‌روم</p>
                    <p className="text-lg font-mono font-bold tracking-widest text-amber-300 mt-1" dir="ltr">
                      6219 - 8610 - 8888 - 9999
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('6219861088889999', 'saman')}
                    className="self-start sm:self-center flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-neutral-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-white/10"
                  >
                    {copiedCard === 'saman' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>کپی شماره کارت</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">مبلغ نهایی پرداختی:</span>
                  <span className="text-xl font-black text-amber-400">
                    {bookingResult.total_amount_currency.toLocaleString()} {bookingResult.currency}
                    {bookingResult.currency !== 'TOMAN' && (
                      <span className="text-xs text-neutral-400 block text-left">
                        ({bookingResult.total_amount.toLocaleString()} تومان)
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Receipt Upload Form */}
              {!receiptSuccess ? (
                <form onSubmit={handleUploadReceipt} className="space-y-4 bg-white/[0.04] p-5 rounded-2xl border border-white/10">
                  <h4 className="text-xs font-black text-white">
                    ثبت رسید پرداخت واریز شده:
                  </h4>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      شماره پیگیری تراکنش / کد ارجاع
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="مثال: 94827103"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      تصویر یا عکس رسید فیش بانکی
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-400/20 file:text-amber-300"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUploadingReceipt}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 border border-white/10"
                  >
                    {isUploadingReceipt ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 text-amber-400" />
                    )}
                    <span>ارسال فیش واریزی جهت تایید نهایی</span>
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-emerald-950/40 border border-emerald-400/30 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-300">
                    رسید پرداخت با موفقیت ارسال شد!
                  </h4>
                  <p className="text-xs text-emerald-400/80">
                    اطلاعات برای واحد پذیرش و مدیریت ارسال شد و به محض تایید بانکی، وضعیت در بخش پیگیری رزرو به «تایید شده» تغییر می‌کند.
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push(`/booking/track?code=${bookingResult.booking_code}&phone=${customerPhone}`)}
                  className="flex-1 gold-glow-btn py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 font-black"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>مشاهده واچر دیجیتال و پیگیری</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-neutral-300 font-bold rounded-2xl text-xs border border-white/10"
                >
                  بستن پنجره
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

