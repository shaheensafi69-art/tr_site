'use client';

import React from 'react';
import { useCurrency } from '@/lib/currency/currency-context';
import { getAllCurrencyPrices } from '@/lib/currency/currency-utils';
import { Coins, RefreshCw } from 'lucide-react';

interface MultiCurrencyStripProps {
  amountInToman: number;
  label?: string;
  className?: string;
}

export default function MultiCurrencyStrip({
  amountInToman,
  label = 'نرخ روزانه معادل در سایر ارزها:',
  className = '',
}: MultiCurrencyStripProps) {
  const { rates } = useCurrency();
  const currencyPrices = getAllCurrencyPrices(amountInToman, rates);

  return (
    <div className={`p-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between text-[11px] text-neutral-400">
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <Coins className="w-3.5 h-3.5" />
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>محاسبه همزمان بر اساس نرخ روز</span>
        </div>
      </div>

      {/* Grid of All 5 Currencies */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
        {currencyPrices.map((item) => {
          const isToman = item.currency === 'TOMAN';
          const isRial = item.currency === 'IRR';

          return (
            <div
              key={item.currency}
              className={`p-2 rounded-xl border transition-all ${
                isToman
                  ? 'bg-amber-400/10 border-amber-400/30 text-amber-300 font-black shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                  : isRial
                  ? 'bg-white/[0.05] border-white/15 text-neutral-200 font-bold'
                  : 'bg-white/[0.02] border-white/10 text-neutral-300'
              }`}
            >
              <div className="text-[10px] text-neutral-400 block mb-0.5 font-medium">
                {item.name_fa}
              </div>
              <div className="font-mono text-xs sm:text-[13px] font-bold">
                {item.formatted}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[10px] text-neutral-400/80 flex items-center justify-between pt-1 border-t border-white/5">
        <span>💡 هر ۱ تومان دقیقاً معادل ۱۰ ریال است.</span>
        <span className="text-neutral-500">منبع نرخ: بازار رسمی روز</span>
      </div>
    </div>
  );
}

