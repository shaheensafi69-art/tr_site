'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Headphones,
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setIsSent(true);
  };

  return (
    <div className="min-h-screen dark-mesh-bg pt-28 pb-20 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
          <Link href="/" className="hover:text-amber-400">صفحه اصلی</Link>
          <span>/</span>
          <span className="text-white font-bold">تماس با رزرواسیون تهران‌روم</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-black text-white mb-2">
            ارتباط با پشتیبانی و رزرواسیون
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            تیم رزرواسیون تهران‌روم به صورت ۲۴ ساعته و در تمام ایام هفته پاسخگوی تماس‌ها و سوالات مسافران گرامی است.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Quick Channels Cards */}
          <div className="glass-panel-dark rounded-3xl p-6 border border-white/10 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 font-bold block">تماس تلفنی مستقیم</span>
              <a href="tel:02191008899" className="text-base font-bold text-white hover:text-amber-400 transition-colors" dir="ltr">
                ۰۲۱ - ۹۱۰۰ ۸۸۹۹
              </a>
            </div>
          </div>

          <div className="glass-panel-dark rounded-3xl p-6 border border-white/10 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 font-bold block">پشتیبانی واتساپ</span>
              <a href="https://wa.me/989123456789" target="_blank" rel="noreferrer" className="text-base font-bold text-emerald-400 hover:underline">
                شروع گفتگو در واتساپ
              </a>
            </div>
          </div>

          <div className="glass-panel-dark rounded-3xl p-6 border border-white/10 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 font-bold block">کانال و بات تلگرام</span>
              <a href="https://t.me/tehranroom_support" target="_blank" rel="noreferrer" className="text-base font-bold text-sky-400 hover:underline">
                @tehranroom_support
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
            <h2 className="text-lg font-black text-white mb-4">
              ارسال پیام به واحد رزرواسیون
            </h2>

            {isSent ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-300">
                  پیام شما با موفقیت ثبت شد
                </h3>
                <p className="text-xs text-emerald-400/80">
                  کارشناسان رزرواسیون تهران‌روم در اسرع وقت با شماره تماس شما ارتباط برقرار خواهند کرد.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    نام و نام خانوادگی
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-semibold"
                    placeholder="علی رضایی"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    شماره تلفن همراه
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-semibold text-left"
                    placeholder="09120000000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    متن پیام یا سوال شما
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs"
                    placeholder="سوال در مورد رزرو گروهی، اتاق ساعتی، ترانسفر یا ..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full gold-glow-btn py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>ارسال پیام</span>
                </button>
              </form>
            )}
          </div>

          {/* Location & Details */}
          <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h2 className="text-lg font-black text-white">
                  دفتر مرکزی رزرواسیون تهران‌روم و هتل تابان
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                مقر رزرواسیون پلتفرم تهران‌روم در قلب تاریخی و تجاری تهران (میدان فردوسی) واقع شده و کمتر از ۲ دقیقه پیاده با ایستگاه مترو فردوسی فاصله دارد.
              </p>

              <div className="space-y-3 pt-2 text-xs text-neutral-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="font-semibold text-white">
                    تهران، خیابان انقلاب، ضلع غربی میدان فردوسی، کوچه شاهرود، پلاک ۱
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>پذیرش و رزرواسیون: ۲۴ ساعته در تمام روزهای هفته</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span dir="ltr">info@tehranroom.com</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              {/* Google Map Preview / Iframe */}
              <div className="relative h-48 rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 group">
                <iframe
                  title="موقعیت مکانی هتل تابان و تهران‌روم در گوگل مپ"
                  src="https://maps.google.com/maps?q=35.7021727,51.4178863&hl=fa&z=17&output=embed"
                  className="w-full h-full border-0 filter contrast-125 opacity-90 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Direct Navigation Button */}
              <a
                href="https://maps.app.goo.gl/hmhZz2Xv6CSnqX3x8"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all shadow-lg"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>مسیریابی مستقیم در گوگل مپ (Google Maps)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

