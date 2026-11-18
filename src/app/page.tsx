import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Clock,
  Sparkles,
  MapPin,
  Star,
  ChevronLeft,
  CheckCircle2,
  Calendar,
  Building,
  PhoneCall,
  Send,
  HelpCircle,
  Award,
} from 'lucide-react';
import LuxuryHeroVisual from '@/components/home/LuxuryHeroVisual';
import SearchHeroBox from '@/components/home/SearchHeroBox';
import HotelCard from '@/components/hotels/HotelCard';
import { createServerClient } from '@/lib/supabase/server';
import { HotelWithDetails } from '@/types/hotel';
import { toPersianDigits } from '@/lib/currency/currency-utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const supabase = createServerClient();

  // Fetch published hotels
  const { data: hotelsData } = await supabase
    .from('hotels')
    .select(`
      *,
      province:provinces(*),
      city:cities(*)
    `)
    .eq('is_published', true)
    .order('is_featured', { ascending: false });

  const hotels: HotelWithDetails[] = (hotelsData as any) || [];

  // Fetch active and preview provinces
  const { data: provinces } = await supabase
    .from('provinces')
    .select('*')
    .order('display_order', { ascending: true })
    .limit(12);

  // Fetch verified reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(3);

  // Multi-engine SEO / GEO / AEO / XEO Structured Schema for Homepage
  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        itemListElement: hotels.map((h, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: h.name,
          url: `https://tehranroom.com/hotels/${h.slug}`,
          image: h.cover_image,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'آدرس و موقعیت مکانی هتل تابان تهران کجاست؟',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'هتل تابان در مرکز شهر تهران، خیابان انقلاب، ضلع غربی میدان فردوسی، کوچه شاهرود، پلاک ۱ واقع شده و کمتر از ۲ دقیقه پیاده با ایستگاه مترو فردوسی فاصله دارد.',
            },
          },
          {
            '@type': 'Question',
            name: 'شماره تلفن مستقیم مدیریت و پذیرش هتل تابان چیست؟',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'شماره مستقیم مدیریت و پذیرش هتل تابان ۰۹۳۵۷۱۲۲۹۷۸ (989357122978+) می‌باشد که به صورت شبانه‌روزی ۲۴ ساعته پاسخگوی میهمانان گرامی است.',
            },
          },
          {
            '@type': 'Question',
            name: 'آیا امکان رزرو ساعتی اتاق در هتل تابان تهران وجود دارد؟',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'بله، هتل تابان امکان رزرو منعطف ساعتی (۳ ساعته، ۶ ساعته و ۱۲ ساعته) را برای اقامت‌های کوتاه و استراحت مسافران با تخفیف ویژه و تایید فوری فراهم کرده است.',
            },
          },
          {
            '@type': 'Question',
            name: 'چگونه واچر قطعی رزرو خود را پیگیری و دریافت کنیم؟',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'پس از ثبت رزرو، با وارد کردن کد رهگیری و شماره موبایل در بخش پیگیری رزرو سایت تهران‌روم (tehranroom.com/booking/track)، واچر رسمی و نسخه چاپی PDF بلافاصله قابل دریافت است.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION WITH LUXURY VISUAL AMBIENCE */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#030712] text-white overflow-hidden">
        {/* Lightweight Ultra-Fast Luxury Visual from Database Hotel Image */}
        <LuxuryHeroVisual coverImage={hotels[0]?.cover_image} />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-amber-500/10">
            <div className="w-5 h-5 relative shrink-0">
              <Image src="/bg_logo.png" alt="لوگوی تهران‌روم" fill className="object-contain" />
            </div>
            <span>سامانه جامع رزرواسیون آنلاین لوکس‌ترین هتل‌های تهران و ایران</span>
          </div>

          {/* Luxury Main Title */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
              اقامت ایده‌آل شما، <br className="hidden sm:inline" />
              <span className="gold-gradient-text">فقط چند کلیک فاصله دارد</span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              رزرو مستقیم، مطمئن و بدون واسطه اتاق‌های هتل‌های برتر تهران (اسپیناس پالاس، پارسیان آزادی، تابان و اقامتگاه‌های منتخب) به صورت روزانه و ساعتی با نرخ مصوب، تایید فوری و پرداخت آسان کارت‌به‌کارت.
            </p>
          </div>

          {/* Quick Search & Province Box */}
          <div className="pt-4">
            <SearchHeroBox />
          </div>

          {/* Trust Metric Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>پوشش هتل‌های منتخب با کیفیت ۵ ستاره</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>تضمین کمترین نرخ و عدم دریافت کارمزد اضافی</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>پشتیبانی شبانه‌روزی ۲۴/۷</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED HOTELS SECTION */}
      <section className="py-24 dark-mesh-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase mb-1.5 tracking-wider">
                <Building className="w-4 h-4 text-amber-400" />
                <span>اقامتگاه‌های برگزیده</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                هتل‌های آماده رزرو در تهران‌روم
              </h2>
            </div>
            <Link
              href="/hotels"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-300 hover:text-white transition-all bg-white/[0.05] hover:bg-white/[0.1] px-5 py-2.5 rounded-2xl border border-white/10 shadow-sm"
            >
              <span>مشاهده همه اقامتگاه‌ها</span>
              <ChevronLeft className="w-4 h-4 text-amber-400" />
            </Link>
          </div>

          {/* Hotel Cards List */}
          <div className="space-y-8">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROVINCES GRID (31 Provinces: Tehran active, others preview) */}
      <section className="py-20 dark-mesh-bg border-t border-white/[0.06] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
              پوشش استانی تهران‌روم در سراسر ایران
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              در گام اول، استان تهران و هتل تابان به صورت کامل فعال است. به مرور زمان بهترین هتل‌های سایر استان‌های ایران به این سامانه افزوده می‌شوند.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {provinces?.map((prov) => {
              const isActive = prov.is_active;

              return (
                <div
                  key={prov.id}
                  className={`p-4 rounded-2xl transition-all text-center ${
                    isActive
                      ? 'glass-panel-gold border-amber-400/40 shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:scale-105'
                      : 'glass-panel opacity-40 hover:opacity-60'
                  }`}
                >
                  <div className="text-xs font-bold text-white mb-1.5">
                    {prov.name}
                  </div>
                  {isActive ? (
                    <span className="inline-block text-[10px] font-black text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                      هتل‌های برتر فعال است
                    </span>
                  ) : (
                    <span className="inline-block text-[10px] text-neutral-400 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/5">
                      به‌زودی
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. WHY TEHRANROOM PILLARS */}
      <section className="py-24 bg-gradient-to-b from-black via-slate-950 to-black text-white relative overflow-hidden border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-widest block mb-2">
              مزایای رزرواسیون با تهران‌روم
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              تجربه اقامتی بی‌دغدغه و لوکس
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel-dark rounded-3xl p-8 hover:border-amber-400/50 transition-all hover:-translate-y-1.5">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-6 shadow-[0_0_25px_rgba(234,179,8,0.2)]">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2.5">
                انعطاف در رزرو روزانه و ساعتی
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-justify">
                برای قرارهای کاری، استراحت چندساعته بین پروازها یا اقامت‌های طولانی؛ تهران‌روم امکان رزرو اتاق‌های تمیز و مجهز را برای ۳، ۶ یا ۱۲ ساعت و همچنین روزانه فراهم ساخته است.
              </p>
            </div>

            <div className="glass-panel-dark rounded-3xl p-8 hover:border-amber-400/50 transition-all hover:-translate-y-1.5">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-6 shadow-[0_0_25px_rgba(234,179,8,0.2)]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2.5">
                تضمین بهترین قیمت و بدون کارمزد
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-justify">
                قیمت‌های ثبت‌شده در سامانه مستقیماً با اتحادیه و هتل‌ها هماهنگ است و هیچ‌گونه هزینه یا کارمزد پنهانی از مسافر دریافت نمی‌گردد. صبحانه بوفه برای تمام رزروهای روزانه رایگان است.
              </p>
            </div>

            <div className="glass-panel-dark rounded-3xl p-8 hover:border-amber-400/50 transition-all hover:-translate-y-1.5">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-6 shadow-[0_0_25px_rgba(234,179,8,0.2)]">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2.5">
                پرداخت کارت‌به‌کارت و واچر هوشمند
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-justify">
                پرداخت آسان از کلیه بانک‌های شتاب، امکان بارگذاری فیش و صدور کد رهگیری آنی با QR Code جهت پذیرش فوری در لابی هتل بدون معطلی.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GUEST REVIEWS */}
      <section className="py-24 dark-mesh-bg border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-widest block mb-2">
              رضایت مسافران
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              نظرات مهمانان هتل تابان تهران
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews?.map((rev) => (
              <div
                key={rev.id}
                className="glass-panel-dark rounded-3xl p-7 flex flex-col justify-between hover:-translate-y-1.5 transition-all border border-white/[0.08]"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed mb-6 font-normal">
                    «{rev.comment}»
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{rev.customer_name}</span>
                  {rev.is_verified_stay && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold border border-emerald-500/20">
                      ✓ اقامت تایید شده
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER (Dark Luxury) */}
      <section className="py-20 relative overflow-hidden bg-black border-t border-white/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-right relative z-10">
          <div>
            <h3 className="text-2xl sm:text-4xl font-black text-white mb-3">
              سفری کاری یا تفریحی به تهران دارید؟
            </h3>
            <p className="text-sm font-normal text-neutral-300">
              هم‌اکنون اتاق خود را در هتل تابان با تضمین نرخ و بهترین امکانات رزرو کنید.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/hotels/hotel-taban"
              className="gold-glow-btn px-8 py-4 rounded-2xl text-xs sm:text-sm"
            >
              مشاهده و رزرو اتاق‌ها
            </Link>

            <a
              href="tel:+989357122978"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-4 rounded-2xl text-xs sm:text-sm border border-white/15 transition-all flex items-center gap-2"
              title="تماس مستقیم با مدیریت و پذیرش هتل تابان"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>تماس با مدیر و پذیرش (۰۹۳۵۷۱۲۲۹۷۸)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
