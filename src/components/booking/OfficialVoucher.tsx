'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Printer,
  Copy,
  Check,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Share2,
  RotateCcw,
  Sparkles,
  Building2,
  CalendarCheck2,
  UserCheck,
} from 'lucide-react';
import QRCode from 'qrcode';
import { toPersianDigits, convertPrice } from '@/lib/currency/currency-utils';
import { formatToJalaliString } from '@/lib/date-utils';
import { useCurrency } from '@/lib/currency/currency-context';

export interface OfficialVoucherData {
  booking: {
    id: string;
    booking_code: string;
    booking_type: 'daily' | 'hourly';
    check_in_date: string;
    check_out_date: string;
    check_in_time?: string | null;
    duration_hours?: number | null;
    adults_count: number;
    children_count?: number;
    breakfast_included: boolean;
    currency: string;
    total_amount: number;
    total_amount_currency?: number;
    status: string;
    payment_status?: string;
    created_at: string;
    special_requests?: string | null;
    qr_data?: string | null;
    customer?: {
      full_name: string;
      phone: string;
      email?: string | null;
      national_id?: string | null;
      nationality_type?: 'iranian' | 'foreigner';
      nationality_country?: string | null;
    };
  };
  hotel: {
    id: string;
    name: string;
    stars: number;
    address: string;
    phone: string;
    google_maps_url?: string;
    check_in_time?: string;
    check_out_time?: string;
    cover_image?: string;
  };
  room: {
    id: string;
    name: string;
    room_number?: string;
    bed_type: string;
    size_sqm: number;
    cover_image?: string;
  };
  payment?: {
    id?: string;
    status: string;
    amount?: number;
    tracking_number?: string;
    verified_at?: string;
  };
}

interface OfficialVoucherProps {
  data: OfficialVoucherData;
  isPrintOnly?: boolean;
}

export default function OfficialVoucher({ data, isPrintOnly = false }: OfficialVoucherProps) {
  const { rates } = useCurrency();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const { booking, hotel, room, payment } = data;
  const isConfirmed = booking.status === 'confirmed' || booking.payment_status === 'verified';
  const totalAmountToman = Number(booking.total_amount) || 0;
  const totalAmountRial = totalAmountToman * 10;

  useEffect(() => {
    const rawQrText =
      booking.qr_data ||
      (typeof window !== 'undefined'
        ? `${window.location.origin}/booking/track?code=${booking.booking_code}&phone=${booking.customer?.phone || ''}`
        : `https://tehranroom.com/voucher/${booking.booking_code}`);

    QRCode.toDataURL(rawQrText, {
      width: 250,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR Gen error:', err));
  }, [booking.booking_code, booking.qr_data, booking.customer?.phone]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.booking_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/voucher/${booking.booking_code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const cancelUrl = `/booking/cancel?code=${booking.booking_code}&phone=${booking.customer?.phone || ''}`;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* 1. INTERACTIVE ACTION TOOLBAR (Hidden in Print) */}
      {!isPrintOnly && (
        <div className="print:hidden bg-slate-900/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-3 h-3 rounded-full ${
                isConfirmed ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span
              className={`text-xs sm:text-sm font-black ${
                isConfirmed ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {isConfirmed
                ? 'واچر قطعی اقامت صادر گردید (آماده پذیرش)'
                : 'در انتظار بررسی و تأیید نهایی پذیرش'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={cancelUrl}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>لغو رزرو و استرداد ۵۰٪</span>
            </Link>

            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-neutral-300 border border-white/10 flex items-center gap-1.5 transition-all"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{copiedLink ? 'کپی شد' : 'اشتراک لینک'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCode}
              className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-neutral-300 border border-white/10 flex items-center gap-1.5 transition-all font-mono"
            >
              {copiedCode ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{booking.booking_code}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ واچر رسمی A4 (کاغذ سفید)</span>
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          2. STRICT SINGLE-PAGE A4 LUXURY VOUCHER (PURE WHITE BACKGROUND, DEEP BOLD BLACK TEXT)
          Designed to be 100% printer-friendly, saving ink/toner with crisp black lines.
         ==================================================================== */}
      <div
        id="official-voucher-document"
        className="voucher-printable bg-white text-slate-950 rounded-2xl border-2 border-slate-900 shadow-2xl p-6 sm:p-8 space-y-4 print:p-0 print:border-none print:shadow-none print:m-0"
      >
        {/* PRINT CSS STYLES TO ENSURE 100% WHITE & DEEP BLACK WITHOUT TONER DAMAGE */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            html, body {
              background: #ffffff !important;
              background-color: #ffffff !important;
              color: #000000 !important;
              font-family: inherit !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            header, footer, nav, aside, .print\\:hidden, [class*="print:hidden"], button, .dark-mesh-bg {
              display: none !important;
              visibility: hidden !important;
            }
            body * {
              visibility: hidden;
            }
            #official-voucher-document,
            #official-voucher-document * {
              visibility: visible !important;
            }
            #official-voucher-document {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              border: 2px solid #000000 !important;
              padding: 16px !important;
              margin: 0 !important;
              box-shadow: none !important;
              background-color: #ffffff !important;
              color: #000000 !important;
              page-break-inside: avoid !important;
            }
            .print-border-black {
              border-color: #000000 !important;
            }
            .print-text-black {
              color: #000000 !important;
            }
            .print-bg-white {
              background-color: #ffffff !important;
            }
            .print-bg-gray {
              background-color: #f3f4f6 !important;
            }
          }
        ` }} />

        {/* 2.1 HEADER: LOGO, REF, OFFICIAL TITLE */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl bg-slate-900 p-1 flex items-center justify-center shrink-0 border border-slate-900">
              <Image
                src="/bg_logo.png"
                alt="TehranRoom"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  تهران<span className="text-amber-600">روم</span>
                </span>
                <span className="text-[10px] font-black uppercase bg-slate-900 text-white px-2.5 py-0.5 rounded-md border border-slate-900">
                  OFFICIAL HOTEL VOUCHER
                </span>
              </div>
              <p className="text-xs text-slate-800 font-extrabold mt-0.5">
                واچر رسمی و قطعی پذیرش اقامتگاه — سامانه رزرواسیون لوکس تهران‌روم
              </p>
            </div>
          </div>

          <div className="text-left" dir="ltr">
            <div className="text-[11px] text-slate-700 uppercase font-mono font-bold">
              VOUCHER CODE
            </div>
            <div className="text-lg sm:text-xl font-mono font-black text-slate-950 tracking-wider">
              {booking.booking_code}
            </div>
            <div className="text-[11px] text-slate-700 font-bold mt-0.5">
              تاریخ صدور: {formatToJalaliString(booking.created_at || new Date().toISOString())}
            </div>
          </div>
        </div>

        {/* 2.2 PROMINENT MANDATORY TIMINGS STRIP (WHITE WITH BOLD BLACK BORDER) */}
        <div className="bg-slate-50 border-2 border-slate-900 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-950 font-black">
            <Clock className="w-4 h-4 shrink-0 text-slate-950" />
            <span className="text-sm">ساعات دقیق تحویل و تخلیه واحد (الزامی):</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-black">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-900 text-slate-950">
              <span className="text-slate-700">تحویل اتاق (Check-in):</span>
              <span className="text-emerald-700 font-black text-sm">
                {booking.booking_type === 'hourly' && booking.check_in_time
                  ? `ساعت ${toPersianDigits(booking.check_in_time)}`
                  : 'ساعت ۱۴:۰۰ (۲ بعدازظهر)'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-900 text-slate-950">
              <span className="text-slate-700">تخلیه واحد (Check-out):</span>
              <span className="text-rose-700 font-black text-sm">
                {booking.booking_type === 'hourly'
                  ? `پس از ${toPersianDigits(booking.duration_hours || 3)} ساعت`
                  : 'حداکثر تا ساعت ۱۲:۰۰ ظهر'}
              </span>
            </div>
          </div>
        </div>

        {/* 2.3 STRUCTURED DATA: 3 ELEGANT COMPACT CARDS (WHITE BG + DEEP BLACK BORDERS) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: مسافر */}
          <div className="p-4 rounded-xl bg-white border-2 border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
              <span className="font-black text-slate-950 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-950" />
                <span>مشخصات مسافر اصلی</span>
              </span>
              <span className="text-[10px] text-slate-700 font-bold">مهمان پذیرش</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-700 font-bold">نام و نام خانوادگی:</span>
                <span className="font-black text-slate-950">
                  {booking.customer?.full_name || 'مسافر گرامی'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 font-bold">
                  {booking.customer?.nationality_type === 'foreigner' ? 'شماره پاسپورت:' : 'کد ملی:'}
                </span>
                <span className="font-mono font-black text-slate-950" dir="ltr">
                  {booking.customer?.national_id || '---'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 font-bold">تابعیت و کشور:</span>
                <span className="text-slate-950 font-black">
                  {booking.customer?.nationality_type === 'foreigner'
                    ? `اتباع خارجی (${booking.customer?.nationality_country || 'خارجی'})`
                    : 'ایرانی'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 font-bold">تلفن مسافر:</span>
                <span className="font-mono font-black text-slate-950" dir="ltr">
                  {booking.customer?.phone}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-300">
                <span className="text-slate-700 font-bold">تعداد نفرات:</span>
                <span className="font-black text-slate-950">
                  {toPersianDigits(booking.adults_count)} بزرگسال
                  {booking.children_count ? ` + ${toPersianDigits(booking.children_count)} کودک` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: اقامتگاه و اتاق */}
          <div className="p-4 rounded-xl bg-white border-2 border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
              <span className="font-black text-slate-950 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-950" />
                <span>اطلاعات هتل و اتاق</span>
              </span>
              <span className="text-[10px] text-amber-700 font-black">
                {'★'.repeat(hotel.stars || 4)} {toPersianDigits(hotel.stars || 4)} ستاره
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-700 font-bold">نام اقامتگاه:</span>
                <span className="font-black text-slate-950">{hotel.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 font-bold">نوع واحد:</span>
                <span className="font-black text-slate-950">{room.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 font-bold">چیدمان تخت:</span>
                <span className="text-slate-950 font-bold">{room.bed_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 font-bold">صبحانه بوفه:</span>
                <span className="font-black text-emerald-800">
                  {booking.breakfast_included ? 'رایگان (سلف‌سرویس)' : 'بدون صبحانه'}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-300">
                <span className="text-slate-700 font-bold">بازه اقامت:</span>
                <span className="font-black text-slate-950 text-[11px]">
                  {booking.booking_type === 'hourly'
                    ? `ساعتی (${toPersianDigits(booking.duration_hours || 3)} ساعت)`
                    : `${formatToJalaliString(booking.check_in_date)} تا ${formatToJalaliString(booking.check_out_date)}`}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: مالی و تسویه */}
          <div className="p-4 rounded-xl bg-white border-2 border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
              <span className="font-black text-slate-950 flex items-center gap-1">
                <CalendarCheck2 className="w-3.5 h-3.5 text-slate-950" />
                <span>وضعیت مالی و تسویه</span>
              </span>
              <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-800">
                {isConfirmed ? 'تسویه و قطعی' : 'در صف تایید'}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-700 font-bold">مبلغ کل فاکتور:</span>
                <span className="font-black text-base text-slate-950 font-mono">
                  {totalAmountToman.toLocaleString('fa-IR')} <span className="text-xs font-sans">تومان</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 font-bold">معادل ریال:</span>
                <span className="font-mono text-slate-900 font-bold text-[11px]">
                  {totalAmountRial.toLocaleString('fa-IR')} ریال
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 font-bold">معادل ارزی:</span>
                <span className="font-mono text-[11px] font-black text-slate-950" dir="ltr">
                  ${convertPrice(totalAmountToman, 'USD', rates)} USD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 font-bold">روش و درگاه:</span>
                <span className="text-slate-950 font-bold">کارت‌به‌کارت مستقیم شتاب</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-300">
                <span className="text-slate-700 font-bold">رهگیری فیش:</span>
                <span className="font-mono text-slate-950 font-black text-[11px]" dir="ltr">
                  {payment?.tracking_number || 'تایید رسمی مدیریت'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2.4 GOLDEN RULES STRIP: CHILDREN & CANCELLATION POLICIES (CRISP BLACK BOX) */}
        <div className="p-3.5 rounded-xl bg-slate-50 border-2 border-slate-900 text-xs leading-relaxed space-y-1.5">
          <div className="flex items-center gap-1.5 font-black text-slate-950 text-sm">
            <ShieldCheck className="w-4 h-4 shrink-0 text-slate-950" />
            <span>ضوابط و قوانین رسمی اقامتگاه (مطابق بخشنامه سراسری هتلداری):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-950 font-bold text-[11px]">
            <div>
              • <b>قوانین اطفال و کودکان:</b> اقامت کودک تا ۵ سال تمام <b>کاملاً رایگان</b>، کودکان ۵ تا ۱۰ سال <b>نیم‌بها (۵۰٪)</b>، و بالای ۱۰ سال نفر کامل محاسبه می‌گردد.
            </div>
            <div>
              • <b>شرایط لغو و کنسلی:</b> بیش از ۲۴ ساعت مانده به ساعت ورود، <b>استرداد ۱۰۰٪ کامل وجه</b> انجام می‌شود. در بازه ۲۴ ساعت مانده به ورود ۵۰٪ عودت داده می‌شود. در روز ورود و پس از تحویل اتاق، غیرقابل کنسلی و استرداد است.
            </div>
            <div>
              • <b>تخلیه به موقع اتاق:</b> مهمان گرامی ملزم است حداکثر تا پیش از ساعت ۱۲:۰۰ ظهر روز خروج واحد را تخلیه فرماید.
            </div>
            <div>
              • <b>مدارک شناسایی معتبر:</b> ارائه اصل شناسنامه / کارت ملی برای اتباع ایرانی و اصل گذرنامه معتبر برای اتباع خارجی در بدو ورود به هتل الزامی است.
            </div>
          </div>
        </div>

        {/* 2.5 VERIFICATION FOOTER: ADDRESS + QR + OFFICIAL STAMP */}
        <div className="pt-2 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {/* Hotel Location & Reception Phone */}
          <div className="space-y-1 text-center sm:text-right flex-1">
            <div className="flex items-center gap-1.5 text-slate-950 font-black">
              <MapPin className="w-4 h-4 text-slate-950 shrink-0" />
              <span>{hotel.address}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-800 font-extrabold text-[11px]">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-950" />
                <span dir="ltr" className="font-mono">{hotel.phone || '+98 935 712 2978'}</span>
              </span>
              <span>پشتیبانی شبانه‌روزی ۲۴ ساعته</span>
            </div>
          </div>

          {/* Security Seal & QR Code Block */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center border-l sm:border-l-0 sm:border-r-2 border-slate-900 px-3">
              <div className="text-[10px] font-black text-slate-950 uppercase tracking-wider">
                AUTHENTIC VOUCHER
              </div>
              <div className="text-[9px] text-slate-800 font-mono font-bold" dir="ltr">
                STAMP: TR-{booking.booking_code}
              </div>
              <div className="text-[9px] text-emerald-900 font-black mt-0.5">
                تأییدیه رسمی سامانه تهران‌روم
              </div>
            </div>

            {/* QR Code with sharp black border */}
            {qrDataUrl && (
              <div className="bg-white p-1 rounded-lg border-2 border-slate-900 shadow-sm shrink-0 text-center">
                <img
                  src={qrDataUrl}
                  alt={`QR ${booking.booking_code}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-auto"
                />
                <span className="text-[8px] font-black text-slate-950 block mt-0.5 font-mono">
                  SCAN TO VERIFY
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2.6 BOTTOM COPYRIGHT & LEGAL NOTICE */}
        <div className="pt-2 border-t border-slate-400 text-center text-[10px] text-slate-800 font-bold flex justify-between items-center">
          <span>این برگه واچر رسمی و الکترونیکی است و بدون نیاز به مهر فیزیکی دارای اعتبار کامل قانونی می‌باشد.</span>
          <span className="font-mono font-black text-slate-950" dir="ltr">tehranroom.com © 2026</span>
        </div>
      </div>
    </div>
  );
}
