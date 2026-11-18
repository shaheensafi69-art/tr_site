import React from 'react';
import Link from 'next/link';
import {
  Lock,
  ShieldCheck,
  EyeOff,
  Server,
  KeyRound,
  FileCheck2,
  Database,
  CheckCircle2,
} from 'lucide-react';

export const metadata = {
  title: 'حریم خصوصی، امنیت اطلاعات مسافران و پروتکل‌های محرمانگی | تهران‌روم',
  description:
    'سیاست رسمی حفظ حریم خصوصی، امنیت اطلاعات هویتی و اسناد پرداختی مسافران در پلتفرم تهران‌روم و رزرواسیون هتل تابان تهران.',
  alternates: {
    canonical: 'https://tehranroom.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen dark-mesh-bg pt-28 pb-20 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">صفحه اصلی</Link>
          <span>/</span>
          <span className="text-white font-bold">حریم خصوصی مسافران</span>
        </div>

        {/* Hero Card */}
        <div className="glass-panel-dark rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>منشور رسمی صیانت از داده‌های هویتی و مالی کاربران</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">
              سیاست حفظ حریم خصوصی و امنیت داده‌ها
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-justify">
              در تهران‌روم، حفظ محرمانگی و اعتماد شما بالاترین دارایی ماست. ما متعهدیم داده‌های شخصی، هویتی و اسناد پرداختی شما را با به‌کارگیری بالاترین استانداردهای رمزنگاری روز و پروتکل‌های امنیتی محافظت نماییم.
            </p>
          </div>
        </div>

        {/* Privacy Articles */}
        <div className="glass-panel-dark rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl space-y-10 text-justify">
          {/* Article 1 */}
          <section className="space-y-3 border-b border-white/[0.08] pb-8">
            <div className="flex items-center gap-2.5 text-amber-400 font-black text-base sm:text-lg">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <h2>۱. داده‌هایی که از شما دریافت می‌کنیم</h2>
            </div>
            <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-2">
              <p>
                جهت ثبت قطعی رزرواسیون و صدور واچر معتبر اقامتی، اطلاعات زیر جمع‌آوری می‌شود:
              </p>
              <ul className="list-disc list-inside space-y-1 pr-2 text-neutral-400">
                <li><strong className="text-white">مشخصات هویتی:</strong> نام و نام‌خانوادگی، کد ملی هوشمند (برای مسافران ایرانی) یا شماره گذرنامه و کشور تابعیت (برای مسافران خارجی).</li>
                <li><strong className="text-white">راه‌های ارتباطی:</strong> شماره تلفن همراه (جهت ارسال کد پیگیری، وضعیت واچر و هماهنگی اضطراری) و آدرس ایمیل (اختیاری).</li>
                <li><strong className="text-white">اسناد مالی:</strong> تصویر رسید واریز کارت‌به‌کارت و کد پیگیری تراکنش بانکی.</li>
                <li><strong className="text-white">جزئیات اقامت:</strong> تاریخ و ساعات ورود و خروج، تعداد نفرات، و درخواست‌های ویژه ثبت‌شده.</li>
              </ul>
            </div>
          </section>

          {/* Article 2 */}
          <section className="space-y-3 border-b border-white/[0.08] pb-8">
            <div className="flex items-center gap-2.5 text-amber-400 font-black text-base sm:text-lg">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <h2>۲. اهداف مشروع و انحصاری پردازش اطلاعات</h2>
            </div>
            <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-2">
              <p>
                اطلاعات دریافتی منحصراً در چارچوب موارد زیر مورد استفاده قرار می‌گیرد و هرگونه استفاده تجاری یا بازاریابی ثانویه اکیداً ممنوع است:
              </p>
              <ul className="list-disc list-inside space-y-1 pr-2 text-neutral-400">
                <li>تطبیق پذیرش و تخصیص قطعی اتاق در سیستم رزرواسیون هتل تابان تهران.</li>
                <li>تایید صحت تراکنش مالی توسط واحد حسابداری هتل و صدور واچر الکترونیکی.</li>
                <li>ارسال نوتیفیکیشن وضعیت رزرو از طریق ربات رسمی تلگرام (@tehranroom_bot) و پیامک به مسافر و مدیر پذیرش.</li>
                <li>ارائه استعلام وضعیت رزرو در سامانه پیگیری با استفاده از کد یکتای ره‌گیری.</li>
              </ul>
            </div>
          </section>

          {/* Article 3 */}
          <section className="space-y-3 border-b border-white/[0.08] pb-8">
            <div className="flex items-center gap-2.5 text-amber-400 font-black text-base sm:text-lg">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <h2>۳. تدابیر امنیت سایبری و رمزنگاری</h2>
            </div>
            <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-2">
              <p>
                زیرساخت فنی تهران‌روم بر پایه‌بهترین الگوهای امنیتی مهندسی شده است:
              </p>
              <ul className="list-disc list-inside space-y-1 pr-2 text-neutral-400">
                <li><strong className="text-white">رمزنگاری داده‌ها در انتقال:</strong> کلیه تبادلات تحت پروتکل HTTPS با گواهینامه امنیتی SSL/TLS ۲۵۶ بیتی کدگذاری می‌شوند.</li>
                <li><strong className="text-white">ایزولاسیون دیتابیس (Row Level Security):</strong> پایگاه‌داده Supabase مجهز به قوانین تفکیک دسترسی سطحی است؛ به‌گونه‌ای که هیچ کاربر خارجی امکان خواندن اطلاعات مسافر دیگری را ندارد.</li>
                <li><strong className="text-white">ذخیره‌سازی ایمن فیش‌های مالی:</strong> تصاویر رسیدها در فضای ذخیره‌سازی ابری حفاظت‌شده با دسترسی محدود و زمان‌دار (Presigned URL) نگهداری می‌شوند.</li>
              </ul>
            </div>
          </section>

          {/* Article 4 */}
          <section className="space-y-3 border-b border-white/[0.08] pb-8">
            <div className="flex items-center gap-2.5 text-amber-400 font-black text-base sm:text-lg">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                <EyeOff className="w-4 h-4" />
              </div>
              <h2>۴. عدم افشا و حفظ اسرار میهمانان</h2>
            </div>
            <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-2">
              <p>
                تهران‌روم تعهد می‌سپارد که مشخصات هویتی، مدت اقامت و اسناد مالی هیچ مسافری به اشخاص ثالث، شرکت‌های تجاری، یا موسسات تبلیغاتی فروخته، اجاره داده یا منتقل نگردد.
              </p>
              <p>
                افشای اطلاعات صرفاً در موارد الزام قانونی و بنا به دستور کتبی و رسمی مراجع ذی‌صلاح قضایی و انتظامی جمهوری اسلامی ایران امکان‌پذیر خواهد بود.
              </p>
            </div>
          </section>

          {/* Article 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-amber-400 font-black text-base sm:text-lg">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h2>۵. حقوق مسافران و ارتباط با مسئول امنیت</h2>
            </div>
            <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-2">
              <p>
                مسافران محترم در هر زمان می‌توانند با ارائه کد ره‌گیری، نسبت به بازبینی اطلاعات واچر اقدام نمایند. همچنین پس از پایان اقامت و تسویه حساب کامل، در صورت تقاضای مسافر، تصویر رسیدهای مالی طبق پروتکل‌های دوره‌ای امحاء خواهد گردید.
              </p>
              <p className="text-neutral-400 pt-2">
                برای هرگونه پرسش درباره امنیت داده‌ها، با ایمیل <span className="text-amber-400 font-mono">privacy@tehranroom.com</span> یا پشتیبانی تهران‌روم تماس حاصل فرمایید.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
