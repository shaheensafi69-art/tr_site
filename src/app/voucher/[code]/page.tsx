import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import OfficialVoucher, { OfficialVoucherData } from '@/components/booking/OfficialVoucher';
import { ArrowRight, Search, FileQuestion, Sparkles } from 'lucide-react';

interface VoucherPageProps {
  params: Promise<{
    code: string;
  }>;
}

export async function generateMetadata({ params }: VoucherPageProps): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `واچر رسمی رزرواسیون ${code.toUpperCase()} | TehranRoom`,
    description: `مشاهده و چاپ واچر معتبر رزرواسیون هتل با کد پیگیری ${code.toUpperCase()} در سامانه تهران‌روم.`,
  };
}

export default async function VoucherPage({ params }: VoucherPageProps) {
  const { code } = await params;
  const cleanCode = (code || '').trim().toUpperCase();

  const supabase = createServerClient();

  // 1. Fetch booking
  const { data: booking, error: bError } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_code', cleanCode)
    .maybeSingle();

  if (bError || !booking) {
    return (
      <div className="min-h-screen dark-mesh-bg pt-32 pb-20 text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full glass-panel-dark p-8 rounded-3xl border border-white/10 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
            <FileQuestion className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-white">واچر رزرواسیون یافت نشد</h1>
            <p className="text-xs text-neutral-400 leading-relaxed">
              هیچ رزرواسیونی با کد پیگیری <span className="font-mono font-bold text-amber-300">{cleanCode}</span> در سامانه تهران‌روم ثبت نشده است. لطفاً کد را مجدداً بررسی فرمایید.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/booking/track"
              className="gold-glow-btn py-3 px-5 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>جستجو در سامانه پیگیری رزرو</span>
            </Link>

            <Link
              href="/"
              className="py-2.5 px-5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-neutral-300 transition-colors"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Fetch customer, hotel, room, payment in parallel
  const [
    { data: customer },
    { data: hotel },
    { data: room },
    { data: payment },
  ] = await Promise.all([
    supabase.from('customers').select('*').eq('id', booking.customer_id).single(),
    supabase.from('hotels').select('*').eq('id', booking.hotel_id).single(),
    supabase.from('rooms').select('*').eq('id', booking.room_id).single(),
    supabase.from('payments').select('*').eq('booking_id', booking.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ]);

  const voucherData: OfficialVoucherData = {
    booking: {
      ...booking,
      customer: customer || undefined,
    },
    hotel: hotel || {
      id: booking.hotel_id,
      name: 'هتل تابان تهران',
      stars: 4,
      address: 'تهران، خیابان انقلاب، ضلع غربی میدان فردوسی، کوچه شاهرود، پلاک ۱',
      phone: '+98 21 9100 8899',
    },
    room: room || {
      id: booking.room_id,
      name: 'اتاق اختصاصی',
      bed_type: 'تخت استاندارد',
      size_sqm: 25,
    },
    payment: payment || undefined,
  };

  return (
    <div className="min-h-screen dark-mesh-bg pt-28 pb-20 text-white print:p-0 print:bg-white print:text-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb (Hidden when printing) */}
        <div className="print:hidden flex items-center justify-between pb-2">
          <Link
            href="/booking/track"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-amber-400 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به سامانه پیگیری رزرو</span>
          </Link>

          <span className="text-xs font-bold text-amber-400/80 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            واچر معتبر الکترونیکی تهران‌روم
          </span>
        </div>

        {/* Master Voucher Component */}
        <OfficialVoucher data={voucherData} />
      </div>
    </div>
  );
}
