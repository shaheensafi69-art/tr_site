'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Clock,
  Sparkles,
  Headphones,
  CheckCircle2,
  Send,
  MessageCircle,
  ExternalLink,
  CreditCard,
  QrCode,
  Globe2,
  Lock,
  ChevronLeft,
  Star,
  Award,
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#020510] text-neutral-300 border-t border-white/10 mt-auto overflow-hidden">
      {/* Ambient Lighting Background Accents */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-amber-500/[0.04] blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/[0.03] blur-[180px] pointer-events-none rounded-full" />

      {/* ====================================================================
          1. TOP VALUE BANNER (4 LUXURY PILLARS OF TEHRANROOM)
         ==================================================================== */}
      <div className="border-b border-white/[0.08] bg-white/[0.015] relative z-10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-5 rounded-2xl glass-panel-dark border border-white/10 flex items-start gap-4 transition-all hover:border-amber-400/40 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">تضمین بهترین نرخ مصوب</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  رزرو بدون واسطه و بدون هیچ‌گونه کارمزد پنهان از مسافر
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-2xl glass-panel-dark border border-white/10 flex items-start gap-4 transition-all hover:border-amber-400/40 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10">
                <Clock className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">رزرو روزانه و ساعتی</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  انعطاف کامل زمانی برای اقامت‌های کاری ۳، ۶ و ۱۲ ساعته
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-2xl glass-panel-dark border border-white/10 flex items-start gap-4 transition-all hover:border-amber-400/40 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
                <CreditCard className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">پرداخت آسان و ارزی</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  کارت‌به‌کارت آنی با پشتیبانی از تومان، ریال، دلار، یورو و افغانی
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 rounded-2xl glass-panel-dark border border-white/10 flex items-start gap-4 transition-all hover:border-amber-400/40 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
                <Headphones className="w-6 h-6 text-amber-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">پشتیبانی تشریفات ۲۴/۷</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  پاسخگویی سریع شبانه‌روزی تلفنی، واتساپ و تلگرام
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. MAIN FOOTER CONTENT COLUMNS
         ==================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand & Platform Mission (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3 w-fit group">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-xl shadow-amber-500/20 bg-black/70 border border-amber-400/40 p-1 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Image
                  src="/bg_logo.png"
                  alt="لوگوی تهران‌روم"
                  width={42}
                  height={42}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                  تهران<span className="text-amber-400">روم</span>
                </span>
                <span className="text-[11px] text-amber-300 font-bold tracking-wide -mt-0.5">
                  سامانه رسمی رزرواسیون هتل‌های برتر
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed text-justify">
              تهران‌روم سامانه جامع و اختصاصی رزرواسیون لوکس‌ترین هتل‌های ۵ ستاره و ۴ ستاره پایتخت (هتل اسپیناس پالاس، هتل پارسیان آزادی، هتل تابان و اقامتگاه‌های برتر) است. این سامانه با هدف تضمین کمترین نرخ مصوب، حذف واسطه‌های متفرقه، تایید فوری واچر الکترونیکی و پشتیبانی از اقامت‌های روزانه و ساعتی طراحی گردیده است.
            </p>

            {/* Direct Instant Channels */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://t.me/tehranroom_bot"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 text-xs font-bold transition-all shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>ربات تلگرام: @tehranroom_bot</span>
              </a>

              <a
                href="https://wa.me/989120000000"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-bold transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساپ رزرواسیون</span>
              </a>
            </div>

            {/* Live Exchange Transparency Badge */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-300 font-bold flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>پشتیبانی چندارزی (نرخ روز گوگل):</span>
                </span>
                <span className="text-emerald-400 font-mono text-[10px] font-bold">زنده</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-bold text-neutral-300">
                <span className="bg-white/5 px-2 py-0.5 rounded-md border border-white/10">تومان</span>
                <span className="bg-white/5 px-2 py-0.5 rounded-md border border-white/10">ریال ایران</span>
                <span className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/20">USD ($)</span>
                <span className="bg-sky-500/10 text-sky-300 px-2 py-0.5 rounded-md border border-sky-500/20">EUR (€)</span>
                <span className="bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded-md border border-amber-400/20">AFN (؋)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Featured Hotels (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>هتل‌های منتخب تهران‌روم</span>
            </h3>
            <ul className="space-y-3 text-xs">
              <li>
                <Link
                  href="/hotels/hotel-espinas-palace"
                  className="group flex items-center justify-between text-neutral-300 hover:text-amber-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                    <span className="font-bold">هتل اسپیناس پالاس</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono">★★★★★</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/hotels/hotel-parsian-azadi"
                  className="group flex items-center justify-between text-neutral-300 hover:text-amber-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                    <span className="font-bold">هتل پارسیان آزادی</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono">★★★★★</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/hotels/hotel-taban"
                  className="group flex items-center justify-between text-neutral-300 hover:text-amber-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                    <span className="font-bold">هتل تابان تهران</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono">★★★★</span>
                </Link>
              </li>
              <li className="pt-2 border-t border-white/5">
                <Link
                  href="/hotels"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>مشاهده همه اقامتگاه‌ها و هتل‌ها</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>

            <div className="pt-3">
              <h4 className="text-xs font-black text-neutral-300 mb-2">دسته‌بندی هتل‌ها بر اساس ستاره:</h4>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
                <Link href="/hotels" className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 border border-white/10">
                  هتل‌های ۵ ستاره
                </Link>
                <Link href="/hotels" className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 border border-white/10">
                  هتل‌های ۴ ستاره
                </Link>
                <Link href="/hotels" className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 border border-white/10">
                  هتل‌های ۳ ستاره
                </Link>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Navigation & Services (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>دسترسی و خدمات</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li>
                <Link href="/booking/track" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>پیگیری وضعیت رزرو و واچر</span>
                </Link>
              </li>
              <li>
                <Link href="/booking/cancel" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span className="text-rose-300 font-bold">لغو رزرو و استرداد وجه (قانون ۲۴ ساعت)</span>
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>رزرو ساعتی (Day Stay)</span>
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>نظرات مسافران تایید شده</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>پرسش‌های متداول (FAQ)</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>قوانین رزرو و کنسلی</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>حریم خصوصی مسافران</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>درباره تهران‌روم</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & VIP Support (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>تماس و پشتیبانی ۲۴ ساعته</span>
            </h3>

            <div className="space-y-3.5 text-xs text-neutral-300">
              {/* Phone English with country code */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                <span className="text-[11px] text-neutral-400 block font-medium">خط مستقیم مدیر و پذیرش هتل تابان:</span>
                <a
                  href="tel:+989357122978"
                  className="text-base font-black text-amber-400 font-mono tracking-wider block hover:text-amber-300 transition-colors"
                  dir="ltr"
                >
                  +98 935 712 2978
                </a>
                <span className="text-[10px] text-emerald-400 block font-bold">پاسخگویی شبانه‌روزی و هماهنگی رزرو</span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono text-neutral-300" dir="ltr">support@tehranroom.com</span>
              </div>

              {/* Central Office Address */}
              <a
                href="https://maps.app.goo.gl/hmhZz2Xv6CSnqX3x8"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2.5 leading-relaxed hover:text-amber-400 transition-colors group cursor-pointer"
                title="مشاهده موقعیت مکانی در گوگل مپ (Google Maps)"
              >
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] text-neutral-300 group-hover:text-amber-300">
                  تهران، خیابان انقلاب، ضلع غربی میدان فردوسی، کوچه شاهرود، پلاک ۱ (ساختمان تهران‌روم / هتل تابان)
                </span>
              </a>

              {/* Direct Maps Link Badge */}
              <div>
                <a
                  href="https://maps.app.goo.gl/hmhZz2Xv6CSnqX3x8"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/20 transition-all"
                >
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>مسیریابی در نقشه گوگل (Google Maps)</span>
                </a>
              </div>

              {/* Trust & Guarantee Box */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/20 text-[11px] text-neutral-300 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>تضمین رسمی واچر و رزرو قطعی</span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  تمامی رزرواسیون‌های انجام‌شده در تهران‌روم دارای ضمانت رسمی ورود و واچر معتبر شرکتی می‌باشند.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          3. ELECTRONIC TRUST & CERTIFICATIONS STRIP
         ==================================================================== */}
      <div className="border-t border-white/[0.08] bg-[#01040d]/80 py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-neutral-400">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-neutral-300">رمزنگاری SSL ۲۵۶ بیتی</span>
              </div>

              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-neutral-300">پذیرش کلیه کارت‌های عضو شتاب</span>
              </div>

              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-neutral-300">واچر الکترونیکی فوری مجهز به QR Code</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-400 bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/10 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>وضعیت سرورها: فعال و پایدار (۹۹.۹٪)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          4. BOTTOM COPYRIGHT & LEGAL BAR
         ==================================================================== */}
      <div className="border-t border-white/5 bg-[#010207] py-5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p className="text-center sm:text-right">
            © {currentYear} کلیه حقوق مادی و معنوی این وب‌سایت متعلق به <strong>سامانه رزرواسیون هتل‌های برتر تهران‌روم (TehranRoom.com)</strong> است.
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/terms" className="hover:text-amber-400 transition-colors">
              قوانین و مقررات
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">
              حفظ حریم خصوصی
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-amber-400 transition-colors">
              تماس با مدیران
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
