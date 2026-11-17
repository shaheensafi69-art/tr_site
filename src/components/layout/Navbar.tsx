'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCurrency } from '@/lib/currency/currency-context';
import { SupportedCurrency } from '@/types/currency';
import {
  PhoneCall,
  Menu,
  X,
  FileCheck2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'صفحه اصلی' },
    { href: '/hotels', label: 'هتل‌ها و اقامتگاه‌ها' },
    { href: '/reviews', label: 'نظرات مسافران' },
    { href: '/about', label: 'درباره ما' },
    { href: '/contact', label: 'تماس با ما' },
  ];

  const currencyOptions: { code: SupportedCurrency; label: string; symbol: string }[] = [
    { code: 'TOMAN', label: 'تومان', symbol: 'تومان' },
    { code: 'IRR', label: 'ریال', symbol: 'ریال' },
    { code: 'USD', label: 'دلار (USD)', symbol: '$' },
    { code: 'EUR', label: 'یورو (EUR)', symbol: '€' },
    { code: 'AFN', label: 'افغانی (AFN)', symbol: '؋' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030712]/95 backdrop-blur-2xl shadow-2xl shadow-black/90 py-3 border-b border-white/10'
          : 'bg-gradient-to-b from-[#030712]/95 via-[#030712]/80 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* 1. BRAND LOGO & TITLE */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center bg-black/60 border border-amber-400/30 p-1">
              <Image
                src="/bg_logo.png"
                alt="لوگوی تهران‌روم"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                تهران<span className="text-amber-400">روم</span>
              </span>
              <span className="text-[11px] text-amber-300/80 font-bold tracking-wide -mt-0.5">
                سامانه رزرواسیون هتل‌های برتر
              </span>
            </div>
          </Link>

          {/* 2. DESKTOP NAVIGATION LINKS (High Contrast & Legible) */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-white/[0.04] backdrop-blur-2xl px-3 py-1.5 rounded-full border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20'
                      : 'text-neutral-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 3. ACTION UTILITIES (Currency, Track, Phone) */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Currency Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <span>{currencyOptions.find((c) => c.code === currency)?.label || currency}</span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute left-0 mt-2 w-36 bg-[#0a0f1d] border border-amber-500/30 rounded-2xl shadow-2xl py-1.5 z-50 overflow-hidden backdrop-blur-xl">
                  {currencyOptions.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => {
                        setCurrency(opt.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-right px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                        currency === opt.code
                          ? 'bg-amber-400/20 text-amber-300 font-black'
                          : 'text-neutral-200 hover:bg-white/[0.06]'
                      }`}
                    >
                      <span className="font-bold">{opt.label}</span>
                      <span className="text-[10px] text-neutral-400">{opt.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tracking Button */}
            <Link
              href="/booking/track"
              className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>پیگیری رزرو</span>
            </Link>

            {/* Quick Call with English country code */}
            <a
              href="tel:+982191008899"
              className="gold-glow-btn px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
              dir="ltr"
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono text-xs font-black tracking-wider">+98 21 9100 8899</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/booking/track"
              className="p-2 rounded-xl bg-white/[0.06] border border-white/10 text-amber-400"
              title="پیگیری رزرو"
            >
              <FileCheck2 className="w-5 h-5" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/[0.06] border border-white/10 text-white"
              aria-label="منوی موبایل"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#030712]/98 backdrop-blur-2xl border-b border-white/10 px-4 pt-4 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'text-neutral-200 hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <Link
              href="/booking/track"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>سامانه پیگیری و استعلام واچر</span>
            </Link>

            <a
              href="tel:+982191008899"
              className="w-full gold-glow-btn py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2"
              dir="ltr"
            >
              <PhoneCall className="w-4 h-4" />
              <span className="font-mono font-black">+98 21 9100 8899</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
