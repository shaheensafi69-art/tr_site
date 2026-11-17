import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Hotel,
  ShieldCheck,
  Award,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
  ChevronLeft,
  Clock,
  HeartHandshake,
  Building2,
  MapPin,
  FileCheck2,
  BadgeCheck,
  PhoneCall,
  Globe2,
} from 'lucide-react';
import { toPersianDigits } from '@/lib/currency/currency-utils';
import { createServerClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'درباره ما | TehranRoom پلتفرم پیشرو رزرواسیون لوکس هتل',
  description:
    'آشنایی با تاریخچه، ماموریت و استانداردهای پلتفرم رزرواسیون لوکس تهران‌روم و همکاری انحصاری با هتل ۴ ستاره تابان تهران.',
};

export default async function AboutPage() {
  const supabase = createServerClient();
  const { data: hotel } = await supabase
    .from('hotels')
    .select('name, cover_image, address, phone')
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .limit(1)
    .single();

  const hotelCoverImage = hotel?.cover_image || '/bg_logo.png';
  return (
    <div className="min-h-screen dark-mesh-bg pt-28 pb-20 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">صفحه اصلی</Link>
          <span>/</span>
          <span className="text-white font-bold">درباره تهران‌روم</span>
        </div>

        {/* Hero Section */}
        <div className="relative glass-panel-dark rounded-3xl p-8 sm:p-14 overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>بازتعریف استانداردهای هتلداری لوکس در پایتخت</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight">
              تهران‌روم؛ پیوند اصالت <span className="gold-gradient-text">مهمان‌نوازی ایرانی</span> با فناوری روز
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed text-justify">
              پلتفرم <strong className="text-white font-bold">TehranRoom</strong> با هدف خلق تجربه‌ای شایسته، شفاف و بی‌دغدغه در اقامت‌های پایتخت راه‌اندازی شده است. ما معتقدیم رزرو هتل نباید فرآیندی پیچیده با نرخ‌های ناپیدا و کارمزدهای مبهم باشد؛ بلکه باید آرامش سفر از نخستین ثانیه انتخاب اتاق آغاز گردد.
            </p>
          </div>
        </div>

        {/* Statistical Milestones */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-2">
            <span className="text-3xl sm:text-4xl font-black gold-gradient-text block">
              {toPersianDigits('98.7')}%
            </span>
            <span className="text-xs sm:text-sm text-neutral-300 font-bold block">
              رضایت میهمانان مقیم
            </span>
            <span className="text-[11px] text-neutral-400 block">
              بر اساس نظرسنجی‌های ثبت‌شده
            </span>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-2">
            <span className="text-3xl sm:text-4xl font-black text-amber-400 block">
              {toPersianDigits('100')}%
            </span>
            <span className="text-xs sm:text-sm text-neutral-300 font-bold block">
              تضمین اصالت نرخ مصوب
            </span>
            <span className="text-[11px] text-neutral-400 block">
              بدون کمیسیون مازاد از مسافر
            </span>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-2">
            <span className="text-3xl sm:text-4xl font-black gold-gradient-text block">
              {toPersianDigits('15')} دقیقه
            </span>
            <span className="text-xs sm:text-sm text-neutral-300 font-bold block">
              میانگین تایید و صدور واچر
            </span>
            <span className="text-[11px] text-neutral-400 block">
              بررسی سریع فیش‌های بانکی
            </span>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-2">
            <span className="text-3xl sm:text-4xl font-black text-amber-400 block">
              {toPersianDigits('24/7')}
            </span>
            <span className="text-xs sm:text-sm text-neutral-300 font-bold block">
              پشتیبانی شبانه‌روزی
            </span>
            <span className="text-[11px] text-neutral-400 block">
              همراهی از رزرو تا پایان اقامت
            </span>
          </div>
        </div>

        {/* Partnership Showcase: Taban Hotel */}
        <div className="glass-panel-dark rounded-3xl p-8 sm:p-12 border border-amber-500/20 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5 text-justify">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>همکاری راهبردی و اختصاصی</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                هتل ۴ ستاره تابان تهران؛ نگین اقامتی مرکز پایتخت
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                هتل تابان تهران واقع در قلب منطقه تجاری و تاریخی پایتخت (خیابان انقلاب، ضلع غربی میدان فردوسی، کوچه شاهرود، پلاک ۱) با دسترسی استثنایی و مستقیم به ایستگاه مترو فردوسی، سفارت‌خانه‌ها، مراکز اداری، تجاری و راه‌های مواصلاتی اصلی، انتخابی بی‌نظیر برای مسافران کاری و گردشگران به شمار می‌رود.
              </p>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                تهران‌روم به عنوان سامانه مستقیم رزرواسیون این هتل، دسترسی بی‌واسطه به انواع اتاق‌های سینگل، دبل، توئین، تریپل و سوئیت‌های رویال را با هر دو گزینه <strong className="text-amber-300">اقامت روزانه</strong> و <strong className="text-amber-300">اقامت منعطف ساعتی (۳، ۶ و ۱۲ ساعته)</strong> فراهم آورده است.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold">
                <a
                  href="https://maps.app.goo.gl/hmhZz2Xv6CSnqX3x8"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-neutral-300 hover:text-amber-400 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>تهران، میدان فردوسی، کوچه شاهرود، پلاک ۱</span>
                </a>
                <a
                  href="tel:+989357122978"
                  className="flex items-center gap-2 text-neutral-300 hover:text-amber-400 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span dir="ltr">۰۹۳۵ ۷۱۲ ۲۹۷۸</span>
                </a>
              </div>
            </div>

            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <Image
                src={hotelCoverImage}
                alt={hotel?.name || 'نمای لوکس هتل تابان تهران'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-right">
                  <span className="text-xs font-black text-amber-400 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
                    هتل ۴ ستاره لوکس منتخب
                  </span>
                  <h4 className="text-lg font-black text-white mt-2">اتاق‌ها و سوئیت‌های مجهز تابان تهران</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars of Excellence */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              اصول معماری خدمات ما
            </span>
            <h2 className="text-2xl sm:text-4xl font-black">
              چرا مسافران حرفه‌ای تهران‌روم را برمی‌گزینند؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel-dark p-8 rounded-3xl border border-white/10 hover:border-amber-400/40 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-white">انعطاف بی‌نظیر ساعتی و روزانه</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-justify">
                چه برای اقامت چندروزه اداری در تهران باشید و چه برای توقف چندساعته بین پروازها، نیاز به پرداخت هزینه کامل یک شب ندارید. سیستم رزرواسیون ساعتی تهران‌روم به شما امکان استراحت ۳، ۶ یا ۱۲ ساعته با نرخ اقتصادی را می‌دهد.
              </p>
            </div>

            <div className="glass-panel-dark p-8 rounded-3xl border border-white/10 hover:border-amber-400/40 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-white">امنیت و اصالت قطعی رزرو</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-justify">
                به محض ثبت فرم و بارگذاری رسید کارت‌به‌کارت، اتاق در سیستم مرکزی هتل قفل شده و واچر رسمی دیجیتال با QR Code احراز هویت صادر می‌گردد. بدون دغدغه لغو یا Overbooking، پذیرش شما تضمین‌شده است.
              </p>
            </div>

            <div className="glass-panel-dark p-8 rounded-3xl border border-white/10 hover:border-amber-400/40 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <Globe2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-white">میزبانی از اتباع ایرانی و خارجی</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-justify">
                سیستم با پشتیبانی کامل از احراز هویت کد ملی هوشمند ایرانیان و ثبت گذرنامه گردشگران خارجی، همراه با نمایش دوعنوانه قیمت‌ها به تومان و ریال، تجربه‌ای استاندارد در کلاس بین‌المللی پدید آورده است.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-amber-400/40 shadow-[0_0_50px_rgba(234,179,8,0.15)]">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            آماده تجربه اقامتی متمایز در هتل تابان تهران هستید؟
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
            تنها در چند دقیقه اتاق مورد نظر خود را انتخاب فرمایید و واچر قطعی پذیرش را دریافت کنید.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/hotels/hotel-taban"
              className="gold-glow-btn px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2"
            >
              <span>مشاهده و رزرو اتاق‌های هتل تابان</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/booking/track"
              className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>سامانه پیگیری و استعلام واچر</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
