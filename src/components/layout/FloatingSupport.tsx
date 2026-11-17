'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, PhoneCall, X, Headphones } from 'lucide-react';

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40 print:hidden">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="mb-3 w-64 bg-slate-900/95 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-4 shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5" />
              <span>پشتیبانی آنلاین تهران‌روم</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <a
            href="https://wa.me/989357122978"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-800/80 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 text-xs font-bold transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-white">پشتیبانی واتساپ (مدیریت)</span>
              <span className="text-[10px] text-emerald-400 font-mono" dir="ltr">+98 935 712 2978</span>
            </div>
          </a>

          <a
            href="https://t.me/tehranroom_support"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-800/80 hover:bg-sky-600/20 text-sky-400 border border-sky-500/20 hover:border-sky-500/40 text-xs font-bold transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-white">ارتباط در تلگرام</span>
              <span className="text-[10px] text-sky-400">پشتیبانی ۲۴ ساعته</span>
            </div>
          </a>

          <a
            href="tel:+989357122978"
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-800/80 hover:bg-amber-600/20 text-amber-300 border border-amber-500/20 hover:border-amber-500/40 text-xs font-bold transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-white">تماس مستقیم پذیرش و مدیر</span>
              <span className="text-[10px] text-amber-300 font-mono" dir="ltr">+98 935 712 2978</span>
            </div>
          </a>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-white/20"
        aria-label="پشتیبانی سریع"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Headphones className="w-6 h-6" />}
      </button>
    </div>
  );
}

