'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ChevronUp, Phone, Send } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'آیا رزرواسیون از طریق تهران‌روم قطعی است و اتاق برای من رزرو می‌شود؟',
      a: 'بله، پلتفرم تهران‌روم مستقیماً به سیستم مدیریت و رزرواسیون هتل تابان متصل است. به محض ثبت اولیه در سامانه، اتاق به مدت ۳۰ دقیقه برای شما قفل شده و پس از واریز کارت‌به‌کارت و ارسال فیش، واچر قطعی صادر می‌گردد.',
    },
    {
      q: 'رزرو ساعتی چیست و چه شرایطی دارد؟',
      a: 'رزرو ساعتی ویژه مسافرانی است که برای قرارهای کاری، استراحت کوتاه، یا توقف موقت بین پروازها به اتاق نیاز دارند. شما می‌توانید اتاق را برای ۳، ۶ یا ۱۲ ساعت در بازه مشخصی از روز با هزینه‌ای به مراتب کمتر از اقامت شبانه رزرو کنید.',
    },
    {
      q: 'پرداخت کارت‌به‌کارت چگونه انجام می‌شود و چقدر زمان می‌برد؟',
      a: 'پس از تکمیل فرم رزرو، شماره کارت رسمی رزرواسیون تهران‌روم (بانک سامان / ملت) نمایش داده می‌شود. شما مبلغ را واریز نموده و شماره پیگیری یا تصویر رسید را در همان صفحه یا بخش پیگیری رزرو بارگذاری می‌کنید. تایید حسابداری هتل معمولاً در کمتر از ۱۵ دقیقه انجام می‌شود.',
    },
    {
      q: 'مدارک شناسایی لازم برای پذیرش در هتل چیست؟',
      a: 'همراه داشتن اصل شناسنامه و کارت ملی هوشمند برای کلیه مسافران الزامی است. برای زوجین محترم، ارائه صیغه‌نامه معتبر با مهر برجسته به همراه شناسنامه مسافران ضروری می‌باشد. برای مهمانان و اتباع خارجی، اصل پاسپورت با ویزای معتبر الزامی است.',
    },
    {
      q: 'آیا صبحانه روی قیمت اتاق‌ها محاسبه شده است؟',
      a: 'بله، برای تمام رزروهای اقامت روزانه (شبانه) در هتل تابان، بوفه صبحانه گرم و سرد به صورت سلف‌سرویس و کاملاً رایگان برای میهمانان گرامی سرو می‌شود.',
    },
    {
      q: 'چگونه می‌توانم وضعیت رزرو خود را بررسی کنم؟',
      a: 'با مراجعه به بخش «پیگیری رزرو» در بالای سایت و وارد کردن کد رزرو (مانند TR-XXXXXX) به همراه شماره تلفن همراه، می‌توانید واچر الکترونیکی، وضعیت تایید هتل و QR Code پذیرش را مشاهده و چاپ نمایید.',
    },
    {
      q: 'قوانین لغو و کنسلی رزرو چگونه است؟',
      a: 'کنسلی تا ۲۴ ساعت قبل از تاریخ ورود بدون جریمه انجام شده و وجه پس از کسر کارمزدهای بانکی مسترد می‌گردد. در صورت کنسلی در روز ورود، مبلغ شب اول به عنوان نیم‌شارژ دریافت خواهد شد.',
    },
  ];

  return (
    <div className="min-h-screen dark-mesh-bg pt-28 pb-20 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
          <Link href="/" className="hover:text-amber-400">صفحه اصلی</Link>
          <span>/</span>
          <span className="text-white font-bold">پرسش‌های متداول (FAQ)</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            پرسش‌های متداول مسافران
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            پاسخ به متداول‌ترین سوالات درباره ثبت رزرو، پرداخت کارت‌به‌کارت، اقامت ساعتی و قوانین هتل تابان تهران.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-12">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-panel-dark border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-right p-5 font-bold text-xs sm:text-sm text-white flex items-center justify-between hover:bg-white/[0.04] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-white/10 bg-white/[0.02] text-justify">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="glass-panel-dark text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-right border border-white/10 shadow-2xl">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white mb-1">
              هنوز سوالی دارید که پاسخ آن در لیست بالا نبود؟
            </h3>
            <p className="text-xs text-neutral-400">
              کارشناسان رزرواسیون تهران‌روم در تمام ساعات شبانه‌روز آماده پاسخگویی به شما هستند.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:02191008899"
              className="gold-glow-btn px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 font-black"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>۰۲۱-۹۱۰۰۸۸۹۹</span>
            </a>

            <a
              href="https://t.me/tehranroom_support"
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-white/10"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>پشتیبانی تلگرام</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

