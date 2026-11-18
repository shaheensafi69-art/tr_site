import React from 'react';
import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import { HotelWithDetails } from '@/types/hotel';
import { Filter, SlidersHorizontal, MapPin, Building, Sparkles } from 'lucide-react';
import Link from 'next/link';
import HotelsFilterView from './HotelsFilterView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'رزرو آنلاین هتل‌ها و اقامتگاه‌های برتر تهران و ایران | تهران‌روم',
  description: 'فهرست و مقایسه جامع هتل‌های برتر، هتل تابان تهران، ویلاهای استخردار و اقامتگاه‌های ویژه با تضمین کمترین نرخ، رزرو روزانه و ساعتی و تایید فوری واچر شرکتی.',
  keywords: [
    'رزرو هتل های تهران',
    'هتل تابان تهران',
    'هتل های میدان فردوسی',
    'رزرو هتل ارزان تهران',
    'رزرو ساعتی هتل در تهران',
    'ویلا استخردار تهران',
    'رزرو هتل با واچر رسمی',
  ],
  alternates: {
    canonical: 'https://tehranroom.com/hotels',
  },
  openGraph: {
    title: 'هتل‌ها و اقامتگاه‌های منتخب تهران و ایران | تهران‌روم',
    description: 'مقایسه و رزرو لحظه‌ای هتل‌های منتخب و هتل تابان تهران با نرخ مصوب شرکتی.',
    url: 'https://tehranroom.com/hotels',
  },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HotelsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const initialCity = typeof resolvedParams?.city === 'string' ? resolvedParams.city : 'all';
  const initialHotel = typeof resolvedParams?.hotel === 'string' ? resolvedParams.hotel : undefined;

  const supabase = createServerClient();

  // 1. Fetch hotels with province and city
  const { data: hotelsData } = await supabase
    .from('hotels')
    .select(`
      *,
      province:provinces(*),
      city:cities(*)
    `)
    .eq('is_published', true)
    .order('is_featured', { ascending: false });

  // 2. Fetch villas and furnished apartments with province and city
  const { data: villasData } = await supabase
    .from('villas_apartments')
    .select(`
      *,
      province:provinces(*),
      city:cities(*)
    `)
    .eq('is_published', true)
    .order('is_featured', { ascending: false });

  // 3. Fetch all active cities
  const { data: citiesData } = await supabase
    .from('cities')
    .select(`
      id,
      name,
      slug,
      province_id,
      display_order,
      province:provinces(id, name, slug)
    `)
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  const hotels: HotelWithDetails[] = (hotelsData as any) || [];
  const villas: any[] = (villasData as any) || [];
  const cities: any[] = (citiesData as any) || [];

  return (
    <div className="min-h-screen dark-mesh-bg pt-28 pb-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
            <Link href="/" className="hover:text-amber-400">
              صفحه اصلی
            </Link>
            <span>/</span>
            <span className="text-white font-bold">هتل‌ها، ویلاها و اقامتگاه‌های منتخب</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">
                رزرو آنلاین هتل‌ها، ویلاها و اقامتگاه‌های سراسر کشور
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1.5">
                فیلتر و مقایسه هوشمند هتل‌های برتر، ویلاهای استخردار و سوئیت‌های مبله با تضمین کمترین نرخ و تایید آنی
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-400/10 text-amber-300 font-bold px-3 py-1.5 rounded-full border border-amber-400/20 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>پوشش مقاصد برتر کشور</span>
              </span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter Info */}
          <div className="lg:col-span-1 space-y-5">
            <div className="glass-panel-dark rounded-3xl p-6 space-y-6 border border-white/10">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Filter className="w-4 h-4 text-amber-400" />
                  <span>راهنمای رزرواسیون</span>
                </div>
              </div>

              {/* Destination Coverage */}
              <div>
                <h4 className="text-xs font-bold text-neutral-300 mb-2">شهرهای فعال سامانه</h4>
                <div className="flex flex-wrap gap-1.5">
                  {cities.length > 0 ? (
                    cities.map((c) => (
                      <span
                        key={c.id}
                        className="text-[11px] bg-white/[0.05] border border-white/10 text-neutral-300 px-2.5 py-1 rounded-xl font-medium"
                      >
                        {c.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-400">تهران و حومه</span>
                  )}
                </div>
              </div>

              {/* Stay Type */}
              <div>
                <h4 className="text-xs font-bold text-neutral-300 mb-2">دسته‌بندی اقامتگاه‌ها</h4>
                <ul className="space-y-2 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>هتل‌های ۵، ۴ و ۳ ستاره برتر</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>ویلاهای استخردار لوکس و باغ‌های اختصاصی</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>آپارتمان‌های مبله و پنت‌هاوس‌های VIP</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>رزرو روزانه (شبانه) یا اقامت ساعتی</span>
                  </li>
                </ul>
              </div>

              {/* Currency Support */}
              <div>
                <h4 className="text-xs font-bold text-neutral-300 mb-2">پشتیبانی ارزی</h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  امکان پرداخت به تومان، ریال، دلار، یورو و افغانی با نرخ برابری روز.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="glass-panel-dark p-3.5 rounded-2xl text-[11px] space-y-1 border border-amber-500/30">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>تضمین کمترین نرخ</span>
                  </div>
                  <p className="text-neutral-400">
                    کلیه نرخ‌های نمایش‌داده‌شده با تخفیف مستقیم و بدون کارمزد واسطه هستند.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Star Filter & Hotel / Villa Listing Results */}
          <div className="lg:col-span-3">
            <HotelsFilterView
              initialHotels={hotels}
              initialVillas={villas}
              initialCities={cities}
              defaultCity={initialCity}
              defaultHotelId={initialHotel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

