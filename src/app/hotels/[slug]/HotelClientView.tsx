'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Star,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  Utensils,
  Coffee,
  Car,
  Bell,
  Plane,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Building,
  Navigation,
  HelpCircle,
} from 'lucide-react';
import { HotelWithDetails } from '@/types/hotel';
import { RoomWithPricing } from '@/types/room';
import RoomCard from '@/components/rooms/RoomCard';
import BookingModal from '@/components/booking/BookingModal';
import { toPersianDigits, convertPrice } from '@/lib/currency/currency-utils';
import { useCurrency } from '@/lib/currency/currency-context';

interface HotelClientViewProps {
  hotel: HotelWithDetails;
  rooms: RoomWithPricing[];
  reviews: any[];
}

export default function HotelClientView({ hotel, rooms }: HotelClientViewProps) {
  const { format, rates } = useCurrency();

  // Gallery state
  const images = (hotel.images as string[]) || [hotel.cover_image];
  const [selectedImage, setSelectedImage] = useState<string>(images[0] || hotel.cover_image);

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomWithPricing | null>(rooms[0] || null);
  const [bookingType, setBookingType] = useState<'daily' | 'hourly'>('daily');

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleOpenBooking = (room: RoomWithPricing, type: 'daily' | 'hourly' = 'daily') => {
    setSelectedRoom(room);
    setBookingType(type);
    setIsModalOpen(true);
  };

  const rules = (hotel.rules as string[]) || [];
  const faqs = (hotel.faq as { question: string; answer: string }[]) || [];

  const startingPriceToman = hotel.min_price || 1950000;
  const startingPriceRial = startingPriceToman * 10;

  return (
    <div className="min-h-screen dark-mesh-bg pt-28 pb-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* ====================================================================
            1. HOTEL HEADER: NAME, STARS, RATING, CALL CTA
           ==================================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-neutral-300 font-bold">
                هتل {toPersianDigits(hotel.stars)} ستاره لوکس
              </span>
              <span className="text-xs bg-amber-400/20 text-amber-300 font-black px-2.5 py-0.5 rounded-full border border-amber-400/30">
                تایید شده توسط تهران‌روم
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {hotel.name}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{hotel.address}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="glass-panel-dark px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-white/10 shadow-lg">
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block font-medium">امتیاز مهمانان</span>
                <span className="text-base font-black text-white">
                  {toPersianDigits(hotel.rating)} از ۵
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                ★
              </div>
            </div>

            <a
              href="tel:+982191008899"
              className="gold-glow-btn px-5 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2"
              dir="ltr"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span className="font-mono tracking-wider">+98 21 9100 8899</span>
            </a>
          </div>
        </div>

        {/* ====================================================================
            2. LUXURY PHOTO GALLERY
           ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* Main Large Image */}
          <div className="relative lg:col-span-3 h-80 sm:h-[440px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <Image
              src={selectedImage}
              alt={hotel.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 75vw"
              className="object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 lg:grid-cols-1 gap-3 h-auto lg:h-[440px]">
            {images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative w-full h-20 sm:h-24 lg:h-[100px] rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedImage === img
                    ? 'border-amber-400 scale-[0.98] shadow-lg shadow-amber-400/20'
                    : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`${hotel.name} - ${idx}`} fill sizes="25vw" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ====================================================================
            3. MAIN CONTENT (RIGHT) + STICKY SIDEBAR WITH PRICE & LOCATION (LEFT)
           ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================================================================
              MAIN CONTENT COLUMN (lg:col-span-8)
             ================================================================ */}
          <div className="lg:col-span-8 space-y-10">
            {/* 3.1 ABOUT HOTEL SECTION */}
            <section className="glass-panel-dark rounded-3xl p-6 sm:p-9 border border-white/10 shadow-2xl space-y-7">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
                  <Building className="w-3.5 h-3.5" />
                  <span>معرفی و ویژگی‌های اقامتگاه</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  درباره {hotel.name}
                </h2>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed text-justify">
                  {hotel.description}
                </p>
              </div>

              {/* Key Timings & Policies Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10">
                <div className="bg-amber-400/[0.05] p-4 rounded-2xl border border-amber-400/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <Clock className="w-4 h-4" />
                    <span>ساعت ورود و خروج قطعی:</span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-white block">
                    ورود از ۱۴:۰۰ | تخلیه تا ۱۲:۰۰ ظهر
                  </span>
                  <p className="text-[11px] text-neutral-400">
                    مسافر محترم موظف به تخلیه واحد پیش از ساعت ۱۲:۰۰ ظهر می‌باشد.
                  </p>
                </div>

                <div className="bg-emerald-500/[0.05] p-4 rounded-2xl border border-emerald-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>قوانین پذیرش کودکان:</span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-white block">
                    تا ۵ سال رایگان | ۵ تا ۱۰ سال ۵۰٪
                  </span>
                  <p className="text-[11px] text-neutral-400">
                    کودکان زیر ۵ سال رایگان، ۵ تا ۱۰ سال نیم‌بها، و بالای ۱۰ سال کامل محاسبه می‌گردد.
                  </p>
                </div>

                <div className="bg-cyan-500/[0.05] p-4 rounded-2xl border border-cyan-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>شرایط کنسلی و استرداد:</span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-white block">
                    بیش از ۲۴ ساعت عودت ۱۰۰٪ | بازه ۲۴ ساعت ۵۰٪
                  </span>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    بیش از ۲۴ ساعت مانده به تحویل اتاق پول مکمل (۱۰۰٪) عودت داده می‌شود؛ در بازه ۲۴ ساعت قبل از ورود ۵۰٪ عودت؛ در روز ورود و پس از آن غیرقابل کنسلی است.
                  </p>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-3.5 pt-2 border-t border-white/10">
                <h3 className="text-sm font-black text-white">امکانات و خدمات هتل تابان:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-bold text-neutral-200">
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                    <Wifi className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>وای‌فای رایگان پرسرعت</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                    <Utensils className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>رستوران سنتی و فرنگی</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                    <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>کافی‌شاپ ۲۴ ساعته</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                    <Car className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>پارکینگ اختصاصی هتل</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                    <Bell className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>خدمات روم‌سرویس ۲۴ ساعته</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                    <Plane className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>ترانسفر فرودگاهی</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 3.2 ROOMS SECTION */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>رزرو آنلاین و آنی</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    اتاق‌های قابل رزرو در {hotel.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                    برای رزرو هر اتاق، کافیست روی دکمه «رزرو این اتاق» کلیک فرمایید تا فرم اطلاعات مسافران باز شود.
                  </p>
                </div>

                <span className="text-xs font-black text-amber-300 bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 shrink-0">
                  {toPersianDigits(rooms.length)} نوع اتاق آماده پذیرش
                </span>
              </div>

              {/* Spacious Room Cards */}
              <div className="space-y-6">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onSelectRoom={(r, type) => handleOpenBooking(r, type)}
                  />
                ))}
              </div>
            </section>

            {/* 3.3 HOTEL RULES & FAQS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Rules */}
              <div className="glass-panel-dark rounded-3xl p-6 border border-white/10 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>قوانین اقامت در هتل تابان</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-neutral-300">
                  {rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQs */}
              <div className="glass-panel-dark rounded-3xl p-6 border border-white/10 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>پرسش‌های متداول</span>
                </h3>
                <div className="space-y-2.5">
                  {faqs.map((faq, idx) => {
                    const isExpanded = expandedFaq === idx;
                    return (
                      <div
                        key={idx}
                        className="border border-white/10 bg-white/[0.03] rounded-2xl overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                          className="w-full text-right p-3.5 font-bold text-xs text-neutral-200 flex items-center justify-between hover:bg-white/[0.06] transition-colors"
                        >
                          <span>{faq.question}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="p-3.5 pt-0 text-xs text-neutral-300 leading-relaxed border-t border-white/10 bg-white/[0.02]">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================
              STICKY SIDEBAR (lg:col-span-4): PRICE BOX + LOCATION BOX
              (هر دو باکس کاملاً ثابت و استیک هستند و همراه با اسکرول صفحه تکان نمی‌خورند)
             ================================================================ */}
          <div className="lg:col-span-4 lg:self-start lg:sticky lg:top-24 space-y-4 z-20">
            {/* 1. STARTING PRICE & BOOKING SUMMARY BOX */}
            <div className="glass-panel-dark rounded-3xl p-5 border border-white/10 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-neutral-400">شروع قیمت از هر شب:</span>
                <div className="text-left space-y-1">
                  <div className="text-xl font-black text-amber-400">
                    {startingPriceToman.toLocaleString('fa-IR')} <span className="text-xs">تومان</span>
                  </div>
                  <div className="text-[11px] text-neutral-300 font-mono" dir="ltr">
                    {startingPriceRial.toLocaleString('fa-IR')} ریال
                  </div>
                  <div className="flex items-center justify-end gap-1.5 pt-0.5 text-[10px] font-bold">
                    <span className="bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/25 font-mono" dir="ltr">
                      ${convertPrice(startingPriceToman, 'USD', rates)} USD
                    </span>
                    <span className="bg-sky-500/15 text-sky-300 px-1.5 py-0.5 rounded border border-sky-500/25 font-mono" dir="ltr">
                      €{convertPrice(startingPriceToman, 'EUR', rates)} EUR
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-neutral-300">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">وضعیت پذیرش:</span>
                  <span className="font-bold text-emerald-400">۲۴ ساعته فعال</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">نوع پرداخت:</span>
                  <span className="font-bold text-white">کارت‌به‌کارت با تایید فوری</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">صبحانه بوفه:</span>
                  <span className="font-bold text-emerald-400">رایگان برای رزرو روزانه</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">امکان رزرو ساعتی:</span>
                  <span className="font-bold text-amber-400">۳، ۶ و ۱۲ ساعته</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (rooms.length > 0) {
                    handleOpenBooking(rooms[0], 'daily');
                  }
                }}
                className="w-full gold-glow-btn py-3.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4" />
                <span>رزرو آنلاین اتاق در هتل تابان</span>
              </button>

              <div className="text-center pt-1 border-t border-white/5">
                <a
                  href="tel:+982191008899"
                  className="text-xs font-bold text-neutral-400 hover:text-amber-400 flex items-center justify-center gap-1.5 transition-colors"
                  dir="ltr"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono">+98 21 9100 8899</span>
                </a>
              </div>
            </div>

            {/* 2. LOCATION & MAP BOX (ثابت با اسکرول صفحه) */}
            <div className="glass-panel-dark rounded-3xl p-5 border border-white/10 space-y-3.5 shadow-2xl">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <h3 className="text-xs sm:text-sm font-black text-white">
                  موقعیت مکانی و نشانی هتل تابان
                </h3>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed text-justify">
                {hotel.address}
              </p>

              {/* Map Graphic Preview Compact */}
              <div className="h-24 w-full rounded-2xl bg-neutral-950 border border-white/10 overflow-hidden relative flex items-center justify-center text-center p-2">
                <div className="space-y-1">
                  <MapPin className="w-5 h-5 text-rose-500 mx-auto animate-bounce" />
                  <span className="text-[11px] font-bold text-white block">هتل ۴ ستاره تابان تهران</span>
                  <span className="text-[10px] text-neutral-400 block">دسترسی سریع به مترو و مرکز شهر</span>
                </div>
              </div>

              <a
                href={
                  hotel.google_maps_url ||
                  `https://www.google.com/maps/dir//Taban+Hotel,+PC29%2BV56+District+6,+Tehran,+Iran/@35.7021541,51.417652,17z?entry=ttu`
                }
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-4 rounded-xl text-xs border border-white/15 transition-all text-center"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span>مسیریابی در نقشه گوگل (Google Maps)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          4. INTERACTIVE BOOKING MODAL (Opens cleanly on room selection)
         ==================================================================== */}
      {selectedRoom && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          hotel={hotel}
          room={selectedRoom}
          initialBookingType={bookingType}
        />
      )}
    </div>
  );
}
