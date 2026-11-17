'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Coins,
  CreditCard,
  Building,
  User,
  Calendar,
  ChevronLeft,
  XCircle,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { toPersianDigits } from '@/lib/currency/currency-utils';
import { formatToJalaliString } from '@/lib/date-utils';

function CancelBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [bookingCode, setBookingCode] = useState(searchParams.get('code') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [eligibility, setEligibility] = useState<{
    eligible: boolean;
    diffHours: number;
    refundAmount: number;
    reason?: string;
  } | null>(null);

  // Refund Form Inputs
  const [refundMethod, setRefundMethod] = useState<'card' | 'cash'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [cashReceiverName, setCashReceiverName] = useState('');
  const [cashReceiverId, setCashReceiverId] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-search if query params present
  useEffect(() => {
    if (searchParams.get('code') && searchParams.get('phone')) {
      handleCheckEligibility();
    }
  }, []);

  const handleCheckEligibility = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!bookingCode.trim() || !phone.trim()) {
      setErrorMessage('لطفاً کد رهگیری و شماره تماس را وارد نمایید.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setBooking(null);
    setEligibility(null);
    setSuccessResult(null);

    try {
      // 1. Fetch booking via tracking endpoint
      const res = await fetch(
        `/api/bookings/track?code=${encodeURIComponent(bookingCode.trim())}&phone=${encodeURIComponent(phone.trim())}`
      );
      const data = await res.json();
      const b = data.booking || (data.data ? { ...data.data.booking, hotel: data.data.hotel, room: data.data.room, payment: data.data.payment } : null);

      if (!res.ok || !b) {
        setErrorMessage(data.error || data.message || 'اطلاعات رزروی با این مشخصات یافت نشد.');
        setLoading(false);
        return;
      }
      setBooking(b);

      // Check if already cancelled
      if (b.status === 'cancellation_requested' || b.status === 'cancelled') {
        setSuccessResult({
          alreadyCancelled: true,
          status: b.status,
          refundAmount: b.refund_amount,
          cardNumber: b.refund_card_number,
          accountHolder: b.refund_account_holder,
        });
        setLoading(false);
        return;
      }

      // 2. Evaluate 24-hour condition
      let checkInDateTime: Date;
      if (b.booking_type === 'hourly' && b.check_in_time) {
        const [h, m] = b.check_in_time.split(':').map(Number);
        checkInDateTime = new Date(`${b.check_in_date}T${String(h || 14).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}:00`);
      } else {
        const checkInHour = b.hotel?.check_in_time ? parseInt(b.hotel.check_in_time.split(':')[0]) : 14;
        checkInDateTime = new Date(`${b.check_in_date}T${String(checkInHour).padStart(2, '0')}:00:00`);
      }

      const now = new Date();
      const diffHours = (checkInDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      const totalAmount = Number(b.total_amount) || 0;

      if (diffHours > 24) {
        // Tier 1: Over 24 hours -> 100% Full Refund (پول مکمل عودت می‌شود)
        setEligibility({
          eligible: true,
          diffHours: Math.round(diffHours),
          refundAmount: totalAmount,
        });
      } else if (diffHours > 0) {
        // Tier 2: Within 24 hours -> 50% Refund (۵۰٪ جریمه کنسلی)
        setEligibility({
          eligible: true,
          diffHours: Math.round(diffHours),
          refundAmount: Math.round(totalAmount * 0.5),
        });
      } else {
        // Tier 3: Zero or negative hours -> Non-refundable (روز ورود و بعد از آن)
        setEligibility({
          eligible: false,
          diffHours: Math.round(diffHours),
          refundAmount: 0,
          reason:
            'طبق قوانین رسمی رزرواسیون تهران‌روم، در روز ورود و پس از موعد تحویل اتاق (ساعت ورود)، به دلیل مسدود ماندن ظرفیت اقامتگاه و عدم امکان پذیرش مجدد، رزرو غیرقابل استرداد و کنسلی می‌باشد.',
        });
      }
    } catch (err: any) {
      console.error('Cancel check error:', err);
      setErrorMessage(err.message || 'خطا در برقراری ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCancellation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (refundMethod === 'card' && (!cardNumber.trim() || !accountHolder.trim())) {
      setErrorMessage('لطفاً شماره کارت ۱۶ رقمی و نام صاحب حساب را وارد نمایید.');
      return;
    }
    if (refundMethod === 'cash' && !cashReceiverName.trim()) {
      setErrorMessage('لطفاً نام شخص تحویل‌گیرنده وجه نقدی در هتل را وارد فرمایید.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_code: bookingCode.trim(),
          phone: phone.trim(),
          refund_method: refundMethod,
          refund_card_number: refundMethod === 'card' ? cardNumber.trim() : 'دریافت نقدی در باجه پذیرش هتل',
          refund_account_holder: refundMethod === 'card' ? accountHolder.trim() : (cashReceiverName.trim() || booking.customer?.full_name),
          cancellation_reason: cancellationReason.trim() + (refundMethod === 'cash' && cashReceiverId ? ` (کد ملی دریافت‌کننده: ${cashReceiverId})` : ''),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'خطا در ثبت درخواست لغو رزرو.');
      } else {
        setSuccessResult({
          alreadyCancelled: false,
          refundMethod,
          refundAmount: data.refund_amount,
          cardNumber: refundMethod === 'card' ? cardNumber.trim() : 'دریافت نقدی در باجه پذیرش هتل',
          accountHolder: refundMethod === 'card' ? accountHolder.trim() : cashReceiverName.trim(),
        });
      }
    } catch (err: any) {
      setErrorMessage('خطای غیرمنتظره در ارسال درخواست.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>بازگشت به صفحه اصلی</span>
          </Link>

          <Link
            href={`/booking/track?code=${bookingCode}&phone=${phone}`}
            className="text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>پیگیری وضعیت رزرو</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/10">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            سامانه لغو رزرو و استرداد وجه
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            بررسی خودکار واجد شرایط بودن استرداد وجه مطابق با قانون لغو ۲۴ ساعت قبل از ورود و واریز ۵۰٪ به حساب مسافر
          </p>
        </div>

        {/* Official Policy Reminder Card */}
        <div className="glass-panel p-5 rounded-3xl border border-amber-400/20 space-y-3 bg-amber-500/[0.03]">
          <div className="flex items-center gap-2 text-xs font-black text-amber-400">
            <Clock className="w-4 h-4 shrink-0" />
            <span>مقررات رسمی استرداد وجه در تهران‌روم (بر اساس بخشنامه سراسری هتلداری):</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-1">
              <span className="font-bold text-emerald-400 block">✓ بیش از ۲۴ ساعت مانده به ورود:</span>
              <p className="text-neutral-300 text-[11px]">
                استرداد <b>۱۰۰٪ کامل وجه (پول مکمل)</b> بدون کسر هیچ‌گونه جریمه کنسلی به شماره کارت یا نقدی.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 space-y-1">
              <span className="font-bold text-amber-400 block">⚡ ورود به بازه ۲۴ ساعت قبل از اقامت:</span>
              <p className="text-neutral-300 text-[11px]">
                کسر ۵۰٪ جریمه کنسلی و <b>استرداد ۵۰٪ باقی‌مانده وجه</b> به شماره کارت یا نقدی در هتل.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-500/[0.04] border border-rose-500/20 space-y-1">
              <span className="font-bold text-rose-400 block">✕ در روز ورود و پس از ساعت تحویل:</span>
              <p className="text-neutral-300 text-[11px]">
                به دلیل مسدودسازی ظرفیت اتاق، این رزرو <b>غیرقابل استرداد و کنسلی</b> می‌باشد.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Verification Box */}
        {!booking && !successResult && (
          <form
            onSubmit={handleCheckEligibility}
            className="glass-panel-dark p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5 shadow-2xl"
          >
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>ورود مشخصات رزرو جهت استعلام وضعیت کنسلی</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">کد رهگیری رزرو (مانند TR-XXXXXX):</label>
                <input
                  type="text"
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                  placeholder="TR-..."
                  className="w-full glass-input px-4 py-3 rounded-2xl text-xs font-mono font-bold text-amber-300 uppercase tracking-widest text-left"
                  dir="ltr"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">شماره موبایل مسافر:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+98..."
                  className="w-full glass-input px-4 py-3 rounded-2xl text-xs font-mono font-bold text-left"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-glow-btn py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <span>در حال استعلام و محاسبه شرایط...</span>
              ) : (
                <>
                  <span>بررسی واجد شرایط بودن استرداد</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ALREADY CANCELLED OR SUCCESSFULLY SUBMITTED VIEW */}
        {successResult && (
          <div className="glass-panel-dark p-6 sm:p-8 rounded-3xl border border-emerald-500/40 space-y-6 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">
                {successResult.alreadyCancelled
                  ? 'درخواست لغو این رزرو قبلاً ثبت شده است'
                  : 'درخواست لغو رزرو با موفقیت در سامانه ثبت گردید'}
              </h2>
              <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                طبق مقررات اقامتگاه، ۵۰٪ از مبلغ کل پرداختی پس از تأیید حسابداری به حساب اعلامی شما واریز خواهد شد.
              </p>
            </div>

            {/* Refund Details Box */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-right space-y-3 max-w-lg mx-auto text-xs">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-neutral-400">مبلغ بازپرداخت (۵۰٪):</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  {Number(successResult.refundAmount || 0).toLocaleString('fa-IR')} تومان
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-neutral-400">نحوه استرداد وجه:</span>
                <span className="font-bold text-amber-300">
                  {successResult.cardNumber?.includes('نقدی') ? '💵 دریافت نقدی در باجه پذیرش هتل' : '💳 واریز به کارت شتاب'}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-neutral-400">
                  {successResult.cardNumber?.includes('نقدی') ? 'محل و نحوه تحویل:' : 'شماره کارت / شبا:'}
                </span>
                <span className="font-mono text-amber-300 font-bold" dir="ltr">
                  {successResult.cardNumber}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">
                  {successResult.cardNumber?.includes('نقدی') ? 'شخص تحویل‌گیرنده وجه:' : 'نام صاحب حساب:'}
                </span>
                <span className="font-bold text-white">{successResult.accountHolder}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/booking/track?code=${bookingCode}&phone=${phone}`}
                className="px-6 py-3 rounded-2xl glass-panel text-xs font-bold text-neutral-300 hover:text-white"
              >
                مشاهده در صفحه پیگیری
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-2xl bg-amber-400 text-slate-950 text-xs font-black hover:bg-amber-300"
              >
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>
        )}

        {/* BOOKING DETAILS & ELIGIBILITY RESULT */}
        {booking && !successResult && eligibility && (
          <div className="space-y-6">
            {/* Booking Summary Card */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-400" />
                  <span className="font-black text-white text-sm">
                    {booking.hotel?.name || 'هتل تابان'} — {booking.room?.name}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-amber-300">
                  {booking.booking_code}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px]">نام مسافر:</span>
                  <span className="font-bold text-white">{booking.customer?.full_name}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">تاریخ ورود (ساعت ۱۴:۰۰):</span>
                  <span className="font-bold text-white">{formatToJalaliString(booking.check_in_date)}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">مبلغ کل پرداختی:</span>
                  <span className="font-black text-amber-300">
                    {Number(booking.total_amount).toLocaleString('fa-IR')} تومان
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">فاصله تا ساعت ورود:</span>
                  <span className="font-bold text-white font-mono">
                    {eligibility.diffHours > 0 ? `${toPersianDigits(eligibility.diffHours)} ساعت` : 'گذشته'}
                  </span>
                </div>
              </div>
            </div>

            {/* IF NOT ELIGIBLE (< 24 HOURS) */}
            {!eligibility.eligible && (
              <div className="glass-panel-dark p-6 sm:p-8 rounded-3xl border border-rose-500/40 space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
                  <XCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-rose-400">
                  رزرو غیرقابل لغو و استرداد وجه می‌باشد
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed text-justify">
                  {eligibility.reason}
                </p>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-neutral-400 max-w-md mx-auto">
                  در صورت وجود شرایط اضطراری پزشکی یا فورس ماژور، می‌توانید با واحد پشتیبانی و مدیر هتل تابان به شماره <a href="tel:+989357122978" className="font-mono text-amber-300 hover:underline" dir="ltr">+98 935 712 2978</a> تماس حاصل فرمایید.
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBooking(null);
                      setEligibility(null);
                    }}
                    className="px-6 py-2.5 rounded-xl glass-panel text-xs font-bold text-neutral-300 hover:text-white"
                  >
                    استعلام کد دیگر
                  </button>
                </div>
              </div>
            )}

            {/* IF ELIGIBLE (> 24 HOURS) -> SHOW REFUND FORM */}
            {eligibility.eligible && (
              <form
                onSubmit={handleSubmitCancellation}
                className="glass-panel-dark p-6 sm:p-8 rounded-3xl border border-amber-400/40 space-y-6 shadow-2xl"
              >
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-black block">
                      {eligibility.diffHours > 24
                        ? 'واجد شرایط استرداد ۱۰۰٪ کامل وجه (بیش از ۲۴ ساعت مانده به ورود)'
                        : 'واجد شرایط استرداد ۵۰٪ وجه (ورود به بازه ۲۴ ساعت قبل از اقامت)'}
                    </span>
                    <span className="text-[11px] text-neutral-300">
                      مبلغ کل: {Number(booking.total_amount).toLocaleString('fa-IR')} تومان — {eligibility.diffHours > 24 ? 'بدون کسر جریمه و استرداد ۱۰۰٪ پول مکمل' : '۵۰٪ جریمه کنسلی کسر و ۵۰٪ مابقی'} (<b>{eligibility.refundAmount.toLocaleString('fa-IR')} تومان</b>) عودت داده می‌شود.
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>انتخاب نحوه دریافت وجه استرداد:</span>
                  </h3>

                  {/* Refund Method Toggle: Card vs Cash Pickup */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRefundMethod('card')}
                      className={`p-4 rounded-2xl border text-right transition-all flex items-start gap-3 ${
                        refundMethod === 'card'
                          ? 'bg-amber-400/15 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                          : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:bg-white/[0.05]'
                      }`}
                    >
                      <CreditCard className={`w-5 h-5 shrink-0 mt-0.5 ${refundMethod === 'card' ? 'text-amber-400' : 'text-neutral-500'}`} />
                      <div className="space-y-1">
                        <span className="text-xs font-black text-white block">
                          واریز به کارت بانکی (کارت‌به‌کارت)
                        </span>
                        <span className="text-[11px] text-neutral-400 block leading-relaxed">
                          استرداد آنی به شماره کارت شتاب اعلام‌شده توسط مسافر
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRefundMethod('cash');
                        if (!cashReceiverName && booking?.customer?.full_name) {
                          setCashReceiverName(booking.customer.full_name);
                        }
                      }}
                      className={`p-4 rounded-2xl border text-right transition-all flex items-start gap-3 ${
                        refundMethod === 'cash'
                          ? 'bg-emerald-400/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                          : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:bg-white/[0.05]'
                      }`}
                    >
                      <Building className={`w-5 h-5 shrink-0 mt-0.5 ${refundMethod === 'cash' ? 'text-emerald-400' : 'text-neutral-500'}`} />
                      <div className="space-y-1">
                        <span className="text-xs font-black text-white block">
                          دریافت نقدی در باجه پذیرش هتل
                        </span>
                        <span className="text-[11px] text-neutral-400 block leading-relaxed">
                          تحویل نقدی ۵۰٪ وجه در صندوق پذیرش هتل با ارائه مدارک شناسایی
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Inputs for Card Refund */}
                  {refundMethod === 'card' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300">
                          شماره کارت ۱۶ رقمی یا شماره شبا (IR...):
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="۶۰۳۷... یا IR..."
                          className="w-full glass-input px-4 py-3 rounded-2xl text-xs font-mono font-bold text-left"
                          dir="ltr"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300">
                          نام و نام خانوادگی دارنده حساب / کارت:
                        </label>
                        <input
                          type="text"
                          value={accountHolder}
                          onChange={(e) => setAccountHolder(e.target.value)}
                          placeholder="نام مسافر یا صاحب کارت..."
                          className="w-full glass-input px-4 py-3 rounded-2xl text-xs"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    /* Inputs for Cash Pickup */
                    <div className="p-4 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>تحویل نقدی در صندوق پذیرش هتل {booking?.hotel?.name || ''}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-300">
                            نام و نام خانوادگی شخص تحویل‌گیرنده وجه:
                          </label>
                          <input
                            type="text"
                            value={cashReceiverName}
                            onChange={(e) => setCashReceiverName(e.target.value)}
                            placeholder="نام شخص تحویل‌گیرنده در لابی هتل..."
                            className="w-full glass-input px-4 py-3 rounded-2xl text-xs"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-300">
                            کد ملی یا شماره پاسپورت دریافت‌کننده:
                          </label>
                          <input
                            type="text"
                            value={cashReceiverId}
                            onChange={(e) => setCashReceiverId(e.target.value)}
                            placeholder="جهت احراز هویت در باجه هتل..."
                            className="w-full glass-input px-4 py-3 rounded-2xl text-xs font-mono text-left"
                            dir="ltr"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        مسافر یا نماینده ایشان می‌تواند با در دست داشتن اصل مدارک شناسایی معتبر، ۵۰٪ وجه استردادی به مبلغ <strong className="text-emerald-400 font-mono">{eligibility.refundAmount.toLocaleString('fa-IR')} تومان</strong> را نقداً از صندوق پذیرش دریافت نماید.
                      </p>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">
                      علت انصراف و لغو رزرو (اختیاری):
                    </label>
                    <textarea
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      placeholder="توضیح مختصر در خصوص دلیل انصراف..."
                      rows={2}
                      className="w-full glass-input px-4 py-2.5 rounded-2xl text-xs"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                    {errorMessage}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setBooking(null);
                      setEligibility(null);
                    }}
                    className="px-5 py-2.5 rounded-xl glass-panel text-xs text-neutral-300 hover:text-white"
                  >
                    انصراف
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-lg shadow-rose-500/20 flex items-center gap-2"
                  >
                    {submitting ? (
                      <span>در حال ثبت و ارسال به امور مالی...</span>
                    ) : (
                      <>
                        <span>تأیید قطعی لغو رزرو و دریافت بازپرداخت ۵۰٪</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CancelBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030712] flex items-center justify-center text-xs text-neutral-400">
          در حال بارگذاری سامانه کنسلی و استرداد وجه...
        </div>
      }
    >
      <CancelBookingContent />
    </Suspense>
  );
}
