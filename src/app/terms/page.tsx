import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileText,
  Clock,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Users,
  Ban,
  Scale,
  Sparkles,
} from 'lucide-react';
import { toPersianDigits } from '@/lib/currency/currency-utils';

export const metadata = {
  title: 'قوانین و مقررات رزرواسیون | TehranRoom',
  description:
    'شرایط و ضوابط رسمی رزرواسیون، احراز هویت مسافران ایرانی و خارجی، مقررات اقامت روزانه و ساعتی و استرداد وجه در تهران‌روم.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen dark-mesh-bg pt-28 pb-20 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">صفحه اصلی</Link>
          <span>/</span>
          <span className="text-white font-bold">قوانین و ضوابط رزرواسیون</span>
        </div>

        {/* Page Header */}
        <div className="glass-panel-dark rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Scale className="w-3.5 h-3.5" />
              <span>مقررات رسمی پلتفرم رزرواسیون تهران‌روم و هتل تابان تهران</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">
              شرایط و ضوابط اقامت و رزرواسیون
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-justify">
              ثبت هرگونه درخواست رزرو در سامانه تهران‌روم به منزله مطالعه دقیق، آگاهی کامل و پذیرش بدون قید و شرط کلیه مفاد و بندهای این سند رسمی است. کلیه عملیات طبق قوانین جمهوری اسلامی ایران و ضوابط اداره نظارت بر اماکن عمومی فراجا و سازمان گردشگری اجرا می‌گردد.
            </p>
          </div>
        </div>

        {/* Legal Articles */}
        <div className="glass-panel-dark rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl space-y-10 text-justify">
          {/* Article 1 */}
          <section className="space-y-3 border-b border-white/[0.08] pb-8">
            <div className="flex items-center gap-2.5 text-amber-400 font-black text-base sm:text-lg">
              <span className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-xs">
                ۱
              </span>
              <h2>مدارک شناسایی و احراز هویت قانونی</h2>
            </div>
            <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-2">
              <p>
                <strong>اتباع جمهوری اسلامی ایران:</strong> ارائه اصل کارت هوشمند ملی یا شناسنامه عکس‌دار جدید برای کلیه افراد مسافر در بدو ورود به هتل الزامی است. پذیرش افراد زیر ۱۸ سال منوط به حضور ولی قانونی یا سرپرست همراه می‌باشد.
              </p>
              <p>
                <strong>گردشگران و اتباع غیرایرانی:</strong> ارائه اصل گذرنامه معتبر (Passport) با حداقل ۶ ماه اعتبار به همراه روادید یا مهر ورود قانونی به کشور ایران در هنگام Check-in الزامی می‌باشد.
              </p>
              <p className="text-amber-300/90 font-medium bg-amber-400/5 p-3 rounded-xl border border-amber-400/20">
                <strong>پذیرش زوجین:</strong> پذیرش زوج‌های محترم با شناسنامه یا صیغه‌نامه معتبر شرعی با مهر برجسته قضایی و محضری به همراه مدارک شناسایی طرفین بلامانع است.
              </p>
            </div>
          </section>

          {/* Article 2 */}
          <section className="space-y-3 border-b border-white/[0.08] pb-8">
            <div className="flex items-center gap-2.5 text-amber-400 font-black text-base sm:text-lg">
              <span className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-xs">
                ۲
              </span>
              <h2>ساعات ورود و خروج اقامت روزانه (Daily Stay)</h2>
            </div>
            <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-2">
              <p>
                ساعت تحویل رسمی اتاق (Check-in) در اقامت‌های روزانه از ساعت <strong>۱۴:۰۰ بعدازظهر</strong> و ساعت تخلیه و تحویل کلید (Check-out) حداکثر تا ساعت <strong>۱۲:۰۰ ظهر</strong> تاریخ خروج می‌باشد.
              </p>
              <p>
                در صورت ورود زودهنگام (Early Check-in) بین ساعات ۰۸:۰۰ صبح تا ۱۴:۰۰، یا خروج دیرهنگام (Late Check-out) بین ساعات ۱۲:۰۰ تا ۱۸:۰۰، منوط به موافقت هتل و خالی بودن اتاق، معادل ۵۰٪ هزینه یک شب (نیم‌شارژ) اخذ خواهد شد. خروج پس از ساعت ۱۸:۰۰ مشمول شارژ کامل یک شب خواهد بود.
              </p>
            </div>
          </section>

          {/* Article 3 */}
          <section className="space-y-3 border-b border-white/[0.08] pb-8">
            <div className="flex items-center gap-2.5 text-amber-400 font-black text-base sm:text-lg">
              <span className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-xs">
                ۳
              </span>
              <h2>مقررات اختصاصی رزرو ساعتی (Hourly Stay)</h2>
            </div>
            <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-2">
              <p>
                رزروهای ساعتی صرفاً در بازه زمانی بین <strong>۰۸:۰۰ صبح تا ۲۲:۰۰ شب</strong> امکان‌پذیر است.
              </p>
              <p>
                حداقل مدت زمان اقامت ساعتی ۳ ساعت و حداکثر ۱۲ ساعت می‌باشد. ساعت ورود انتخابی توسط مسافر قطعی بوده و تاخیر در ورود به هتل موجب تمدید ساعت خروج نخواهد شد.
              </p>
              <p>
                خدمات صبحانه بوفه صرفاً شامل اقامت‌های روزانه است و در صورت تمایل میهمان ساعتی به صرف صبحانه، هزینه آن به صورت جداگانه در هتل تسویه خواهد شد.
              </p>
            </div>
          </section>

          {/* Article 4 */}
          <section className="space-y-3 border-b border-white/[0.08] pb-8">
            <div className="flex items-center gap-2.5 text-amber-400 font-black text-base sm:text-lg">
              <span className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-xs">
                ۴
              </span>
              <h2>فرآیند پرداخت کارت‌به‌کارت و قفل موقت اتاق</h2>
            </div>
            <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-2">
              <p>
                پس از تکمیل فرم رزرو، اتاق مورد نظر به مدت <strong>۳۰ دقیقه</strong> به صورت اختصاصی برای مسافر رزرو موقت می‌گردد.
              </p>
              <p>
                مسافر موظف است طی مهلت مذکور، مبلغ اعلام‌شده در فاکتور را به شماره کارت رسمی بانک سامان مندرج در سایت واریز فرموده و تصویر فیش یا شناسه پیگیری بانکی را در سامانه یا ربات تلگرام تهران‌روم بارگذاری نماید.
              </p>
              <p>
                در صورت انقضای مهلت ۳۰ دقیقه‌ای و عدم آپلود رسید معتبر، رزرو خودکار لغو گردیده و اتاق برای متقاضیان دیگر آزاد خواهد شد. تهران‌روم مسئولیتی در قبال واریزهای خارج از مهلت بدون هماهنگی ندارد.
              </p>
            </div>
          </section>

          {/* Article 5 */}
          <section className="space-y-3 border-b border-white/[0.08] pb-8">
            <div className="flex items-center gap-2.5 text-amber-400 font-black text-base sm:text-lg">
              <span className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-xs">
                ۵
              </span>
              <h2>شرایط لغو، کنسلی و استرداد وجه (Cancellation & Refund)</h2>
            </div>
            <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-2">
              <p>
                <strong>کنسلی بیش از ۲۴ ساعت مانده به ورود:</strong> بدون هیچ‌گونه کسر جریمه انجام شده و ۱۰۰٪ وجه واریزی (پول مکمل) به شماره کارت شتاب یا به صورت نقدی در هتل مسترد می‌گردد.
              </p>
              <p>
                <strong>کنسلی در بازه ۲۴ ساعت مانده به زمان تحویل:</strong> با کسر ۵۰٪ جریمه کنسلی، ۵۰٪ مابقی مبلغ به شماره کارت اعلامی مسافر یا به صورت نقدی در هتل مسترد خواهد شد.
              </p>
              <p>
                <strong>در روز ورود یا پس از موعد تحویل اتاق:</strong> به دلیل مسدود ماندن قطعی ظرفیت اقامتگاه، رزرو غیرقابل استرداد و ابطال می‌باشد.
              </p>
              <p>
                <strong>رزروهای ساعتی:</strong> به دلیل تخصیص مقطعی و مسدود شدن فوری اتاق در همان روز، پس از تایید نهایی غیرقابل استرداد و ابطال می‌باشند.
              </p>
            </div>
          </section>

          {/* Article 6 */}
          <section className="space-y-3 border-b border-white/[0.08] pb-8">
            <div className="flex items-center gap-2.5 text-amber-400 font-black text-base sm:text-lg">
              <span className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-xs">
                ۶
              </span>
              <h2>قوانین کودکان و ظرفیت اتاق‌ها</h2>
            </div>
            <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-2">
              <p>
                اقامت کودکان زیر ۶ سال تمام در صورت عدم استفاده از سرویس خواب اضافه، کاملاً رایگان محاسبه می‌شود.
              </p>
              <p>
                برای کودکان بالای ۶ سال تمام، هزینه نفر اضافه کامل بر مبنای نرخ مصوب هتل محاسبه و لحاظ می‌گردد.
              </p>
              <p>
                حداکثر ظرفیت مجاز برای هر اتاق بر اساس اطلاعات درج‌شده در صفحه اتاق هتل تابان تعیین شده و ورود تعداد نفرات بیش از ظرفیت مجاز ممنوع است.
              </p>
            </div>
          </section>

          {/* Article 7 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-amber-400 font-black text-base sm:text-lg">
              <span className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-xs">
                ۷
              </span>
              <h2>نظم عمومی، دخانیات و مسئولیت‌های خسارت</h2>
            </div>
            <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-2">
              <p>
                <strong>ممنوعیت دخانیات:</strong> استعمال سیگار، قلیان و هرگونه مواد دخانی در داخل تمامی اتاق‌ها و راهروهای هتل تابان اکیداً ممنوع بوده و کشف آن موجب جریمه شست‌وشو و ضدعفونی طبق نرخ مصوب هتل خواهد شد.
              </p>
              <p>
                <strong>حیوانات خانگی:</strong> ورود و نگهداری هر نوع حیوان خانگی در هتل ممنوع می‌باشد.
              </p>
              <p>
                <strong>خسارت به اموال:</strong> هرگونه خسارت به تجهیزات، لوازم اتاق یا فضای عمومی هتل توسط مسافر در زمان Check-out ارزیابی و خسارت مربوطه اخذ خواهد گردید.
              </p>
            </div>
          </section>
        </div>

        {/* Footer Support Info */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-2">
          <p className="text-xs text-neutral-400">
            در صورت وجود هرگونه ابهام یا سوال پیرامون ضوابط، تیم پشتیبانی ۲۴ ساعته تهران‌روم پاسخگوی شماست:
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-bold text-amber-300 pt-1">
            <span>شماره تماس هتل تابان: ۰۲۱-۹۱۰۰۸۸۹۹</span>
            <span>•</span>
            <Link href="/contact" className="hover:underline">تماس با پشتیبانی آنلاین</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
