'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  FileCheck2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock4,
  Copy,
  Check,
  Upload,
  Printer,
  ShieldCheck,
  Hotel,
  BedDouble,
  User,
  Phone,
  Sparkles,
  ExternalLink,
  Compass,
  ArrowRight,
  MessageSquare,
  Send,
  ChevronLeft,
  XCircle,
} from 'lucide-react';
import QRCode from 'qrcode';
import { formatToJalaliString } from '@/lib/date-utils';
import { toPersianDigits } from '@/lib/currency/currency-utils';
import OfficialVoucher from '@/components/booking/OfficialVoucher';

function BookingTrackContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [bookingCode, setBookingCode] = useState(initialCode);
  const [phone, setPhone] = useState(initialPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [trackingData, setTrackingData] = useState<any>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Payment upload state inside tracking
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!bookingCode.trim()) {
      setErrorMessage('لطفاً کد رهگیری رزرو را وارد نمایید.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/bookings/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_code: bookingCode.trim(),
          phone: phone.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMessage(json.message || 'رزروی با این مشخصات یافت نشد.');
        setTrackingData(null);
        setIsLoading(false);
        return;
      }

      setTrackingData(json.data);

      // Generate QR Code with tracking link
      const qrTarget = `https://tehranroom.com/booking/track?code=${json.data.booking.booking_code}`;
      const url = await QRCode.toDataURL(qrTarget, {
        width: 220,
        margin: 1,
        color: { dark: '#030712', light: '#ffffff' },
      });
      setQrDataUrl(url);

      setIsLoading(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در برقراری ارتباط با سرور رزرواسیون.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      handleTrack();
    }
  }, [initialCode]);

  const handleUploadReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingData?.booking?.id) return;

    if (!receiptFile && !trackingNumber.trim()) {
      setErrorMessage('لطفاً تصویر فیش یا شماره پیگیری را وارد فرمایید.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('booking_id', trackingData.booking.id);
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
        setErrorMessage(resJson.message || 'خطا در ارسال رسید');
        setIsUploading(false);
        return;
      }

      setUploadSuccess(true);
      setIsUploading(false);
      // Refresh status
      handleTrack();
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ارسال فیش');
      setIsUploading(false);
    }
  };

  const copyText = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const getStatusBadge = (status: string, paymentStatus?: string) => {
    if (status === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 text-xs font-black px-3.5 py-1.5 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>تأیید قطعی پذیرش هتل</span>
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-rose-500/15 text-rose-400 text-xs font-black px-3.5 py-1.5 rounded-full border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
          <XCircle className="w-4 h-4 text-rose-400" />
          <span>درخواست رزرو رد شده است (ناموفق)</span>
        </span>
      );
    }
    if (status === 'cancellation_requested') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-300 text-xs font-black px-3.5 py-1.5 rounded-full border border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Clock4 className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>درخواست لغو و استرداد ۵۰٪ (در صف پردازش)</span>
        </span>
      );
    }
    if (status === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-rose-500/15 text-rose-300 text-xs font-black px-3.5 py-1.5 rounded-full border border-rose-500/30">
          <XCircle className="w-4 h-4 text-rose-400" />
          <span>رزرو لغو شده</span>
        </span>
      );
    }
    if (paymentStatus === 'awaiting_verification') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-sky-500/15 text-sky-300 text-xs font-black px-3.5 py-1.5 rounded-full border border-sky-400/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <Clock4 className="w-4 h-4 text-sky-400 animate-pulse" />
          <span>فیش واریزی در صف بررسی و تأیید</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-300 text-xs font-black px-3.5 py-1.5 rounded-full border border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
        <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>در انتظار واریز فیش (Pending)</span>
      </span>
    );
  };

  // Determine current timeline active step (1 to 4)
  const getTimelineStep = () => {
    if (!trackingData) return 1;
    if (trackingData.booking.status === 'confirmed') return 4;
    if (trackingData.booking.status === 'rejected') return 3; // Step 3 fails
    if (trackingData.payment?.status === 'awaiting_verification' || trackingData.payment?.receipt_url) return 3;
    if (trackingData.booking.status === 'reserved' || trackingData.booking.status === 'pending') return 2;
    return 1;
  };

  const activeStep = getTimelineStep();

  return (
    <div className="min-h-screen dark-mesh-bg pt-28 pb-20 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>سامانه هوشمند استعلام لحظه‌ای رزرواسیون</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            پیگیری و واچر دیجیتال <span className="text-amber-400">تهران‌روم</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            کد رهگیری اختصاصی رزرو خود را وارد نمایید تا آخرین وضعیت بررسی فیش بانکی، زمان‌بندی ورود و واچر معتبر با بارکد پذیرش سریع نمایش داده شود.
          </p>
        </div>

        {/* Search / Track Form Box */}
        <div className="glass-panel-dark rounded-3xl p-6 sm:p-7 border border-white/10 mb-8 shadow-2xl">
          <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                کد رهگیری رزرو (مثال: TR-A7X9K2) <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                dir="ltr"
                placeholder="TR-..."
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
                className="w-full glass-input rounded-2xl px-4 py-3 text-sm font-mono font-black text-left uppercase text-amber-300 tracking-wider"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full gold-glow-btn py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 font-black transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>استعلام و مشاهده واچر</span>
              </button>
            </div>
          </form>

          {errorMessage && (
            <div className="mt-4 p-3.5 bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* DIGITAL VOUCHER & TRACKING RESULT */}
        {trackingData && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* REJECTION ALERT BANNER IF REJECTED */}
            {trackingData.booking.status === 'rejected' && (
              <div className="glass-panel-dark rounded-3xl p-6 sm:p-7 border border-rose-500/40 bg-rose-950/20 text-right space-y-4 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                    <XCircle className="w-7 h-7 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-rose-300">
                      درخواست رزرواسیون توسط هتل رد شده است (عدم تأیید)
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                      متأسفانه به دلیل عدم تطابق فیش واریزی ارسالی یا تکمیل ظرفیت اتاق‌های {trackingData.hotel?.name || 'هتل'}، این رزرو مورد تایید قرار نگرفت.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-neutral-300">
                    در صورت کسر وجه از حساب شما، وجه واریزی مسترد خواهد شد. با پشتیبانی تماس بگیرید یا درخواست استرداد ثبت کنید:
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href="tel:+989357122978"
                      className="font-mono font-bold text-amber-300 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10"
                      dir="ltr"
                    >
                      +98 935 712 2978
                    </a>
                    <Link
                      href={`/booking/cancel?code=${trackingData.booking.booking_code}&phone=${trackingData.customer?.phone || phone}`}
                      className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-1.5 rounded-xl transition-all"
                    >
                      درخواست استرداد وجه
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 1. INTERACTIVE 4-STEP TIMELINE TRACKER */}
            <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>مراحل وضعیت رزرو در هتل</span>
                </h3>
                {getStatusBadge(trackingData.booking.status, trackingData.payment?.status)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                {/* Step 1 */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  activeStep >= 1 ? 'bg-amber-400/10 border-amber-400/40' : 'bg-white/[0.02] border-white/10 opacity-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center">
                      ۱
                    </div>
                    <span className="text-xs font-bold text-white">ثبت اولیه رزرو</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    کد پیگیری اختصاصی صادر شد و اتاق در وضعیت موقت قرار گرفت.
                  </p>
                </div>

                {/* Step 2 */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  activeStep >= 2 ? 'bg-amber-400/10 border-amber-400/40' : 'bg-white/[0.02] border-white/10 opacity-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                      activeStep >= 2 ? 'bg-amber-400 text-slate-950' : 'bg-white/20 text-white'
                    }`}>
                      ۲
                    </div>
                    <span className="text-xs font-bold text-white">واریز کارت‌به‌کارت</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    ارسال فیش بانکی توسط مسافر به ربات تلگرام و سیستم رزرواسیون.
                  </p>
                </div>

                {/* Step 3 */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  trackingData.booking.status === 'rejected'
                    ? 'bg-rose-500/15 border-rose-500/50'
                    : activeStep >= 3
                    ? 'bg-amber-400/10 border-amber-400/40'
                    : 'bg-white/[0.02] border-white/10 opacity-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                      trackingData.booking.status === 'rejected'
                        ? 'bg-rose-500 text-white'
                        : activeStep >= 3
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-white/20 text-white'
                    }`}>
                      {trackingData.booking.status === 'rejected' ? '✕' : '۳'}
                    </div>
                    <span className={`text-xs font-bold ${trackingData.booking.status === 'rejected' ? 'text-rose-300' : 'text-white'}`}>
                      {trackingData.booking.status === 'rejected' ? 'عدم تأیید توسط هتل' : 'تأیید مالی هتل'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    {trackingData.booking.status === 'rejected'
                      ? 'رد رزرو به علت عدم تطابق فیش یا تکمیل ظرفیت.'
                      : `بررسی شماره ارجاع تراکنش توسط حسابداری ${trackingData.hotel?.name || 'هتل'}.`}
                  </p>
                </div>

                {/* Step 4 */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  activeStep >= 4 ? 'bg-emerald-500/20 border-emerald-400/50' : 'bg-white/[0.02] border-white/10 opacity-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                      activeStep >= 4 ? 'bg-emerald-400 text-slate-950' : 'bg-white/20 text-white'
                    }`}>
                      ۴
                    </div>
                    <span className="text-xs font-bold text-white">واچر قطعی و پذیرش</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    تحویل آنی کلید اتاق در لابی هتل با ارائه بارکد واچر.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. WORLD-CLASS LUXURY OFFICIAL VOUCHER (Shown only if not rejected) */}
            {trackingData.booking.status !== 'rejected' && (
              <OfficialVoucher data={trackingData} />
            )}

            {/* Bank Account Info & Receipt Upload Section (only if pending/reserved) */}
            {['pending', 'reserved'].includes(trackingData.booking.status) && (
              <div className="glass-panel-dark p-6 rounded-2xl space-y-5 border border-amber-500/30">
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>اطلاعات کارت جهت واریز و تسریع در تأیید رزرو</span>
                  </h4>
                  <span className="text-[11px] text-neutral-400">تضمین نرخ مستقیم</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/60 p-4 rounded-xl border border-amber-400/20">
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-400">
                      بانک سامان — به نام رزرواسیون تهران‌روم / {trackingData.hotel?.name || 'هتل'}
                    </p>
                    <p className="text-lg font-mono font-bold tracking-widest text-amber-300" dir="ltr">
                      6219 - 8610 - 8888 - 9999
                    </p>
                    <p className="text-[10px] text-neutral-500 font-mono" dir="ltr">
                      IR12 0560 0861 0000 0088 8899 99
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText('6219861088889999', 'card')}
                    className="flex items-center gap-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-amber-400/30 self-start sm:self-center"
                  >
                    {copiedText === 'card' ? (
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

                {/* Upload / Update Receipt Form */}
                {!uploadSuccess ? (
                  <form onSubmit={handleUploadReceipt} className="pt-3 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>بارگذاری تصویر یا اسکرین‌شات فیش واریزی:</span>
                      </span>
                      <span className="text-[10px] text-neutral-400">ارسال مستقیم به تلگرام هتل</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          id="track_receipt_upload"
                          onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <label
                          htmlFor="track_receipt_upload"
                          className="w-full flex items-center justify-center gap-2 p-3 bg-white/[0.04] hover:bg-white/[0.08] border border-dashed border-white/20 rounded-xl cursor-pointer text-xs transition-all text-neutral-300"
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
                          placeholder="شماره پیگیری فیش (اختیاری)"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="w-full glass-input rounded-xl px-3 py-3 text-xs text-left"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-full gold-glow-btn py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 font-black transition-all disabled:opacity-50"
                    >
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>ارسال فیش واریزی جهت تایید نهایی</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-center text-xs text-emerald-300 space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                    <span className="font-bold block">فیش واریزی با موفقیت به هتل و تلگرام ارسال گردید!</span>
                    <span className="text-emerald-400/80 text-[11px] block">
                      واحد پذیرش {trackingData.hotel?.name || 'هتل'} پس از تطبیق حسابداری، واچر نهایی ورود را صادر خواهد کرد.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* DYNAMIC HOTEL RULES & POLICIES (Loaded from selected hotel) */}
            <div className="p-5 bg-white/[0.03] border border-white/10 rounded-3xl text-xs text-neutral-300 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    قوانین و ضوابط اختصاصی {trackingData.hotel?.name || 'اقامتگاه'} (ورود، خروج، کودکان و کنسلی):
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  {trackingData.hotel?.google_maps_url && (
                    <a
                      href={trackingData.hotel.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-3 py-1 rounded-xl font-bold transition-all"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>مسیریابی گوگل مپ</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {/* Cancellation Link */}
                  {trackingData.booking.status !== 'cancelled' && (
                    <Link
                      href={`/booking/cancel?code=${trackingData.booking.booking_code}&phone=${trackingData.customer?.phone || phone}`}
                      className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1 rounded-xl font-bold transition-all"
                    >
                      <span>درخواست لغو و استرداد وجه</span>
                      <ChevronLeft className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Check-in / Children / Cancellation Summary KPI boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-amber-400 font-bold block">🕒 زمان تحویل و تخلیه:</span>
                  <span className="text-neutral-200 block">
                    ورود: {trackingData.hotel?.check_in_time || '۱۴:۰۰'} | تخلیه قبل از: {trackingData.hotel?.check_out_time || '۱۲:۰۰'} ظهر
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-amber-400 font-bold block">👶 قوانین کودکان و اطفال:</span>
                  <span className="text-neutral-200 block">
                    زیر ۵ سال رایگان | ۵ تا ۱۰ سال نیم‌بها | بالای ۱۰ سال کامل
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-amber-400 font-bold block">🔄 شرایط بازپرداخت و لغو:</span>
                  <span className="text-neutral-200 block">
                    بیش از ۲۴ ساعت ۱۰۰٪ عودت کامل | در ۲۴ ساعت ۵۰٪ | روز ورود غیرقابل لغو
                  </span>
                </div>
              </div>

              {/* Specific Hotel Rules from Database */}
              {trackingData.hotel?.rules && Array.isArray(trackingData.hotel.rules) && trackingData.hotel.rules.length > 0 ? (
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="text-neutral-400 font-bold text-[11px] block">
                    مقررات ثبت‌شده {trackingData.hotel.name}:
                  </span>
                  <ul className="space-y-1.5 text-neutral-300 text-[11px] pr-1">
                    {trackingData.hotel.rules.map((rule: string, rIdx: number) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-1 pr-1 text-neutral-400 text-[11px] pt-1">
                  <li>همراه داشتن اصل کارت ملی هوشمند یا شناسنامه برای اتباع ایرانی و اصل گذرنامه معتبر برای اتباع خارجی الزامی است.</li>
                  <li>پذیرش زوجین محترم با ارائه مدارک شناسایی معتبر یا صیغه‌نامه دارای مهر برجسته صورت می‌پذیرد.</li>
                  <li>شماره تماس مدیر و پذیرش هتل تابان / تهران‌روم: <a href="tel:+989357122978" className="font-mono text-amber-300 hover:underline" dir="ltr">+98 935 712 2978</a></li>
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingTrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-white">در حال بارگذاری اطلاعات رزرو...</div>}>
      <BookingTrackContent />
    </Suspense>
  );
}
