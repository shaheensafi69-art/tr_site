'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SupportedCurrency, CurrencyRateMap } from '@/types/currency';
import { DEFAULT_RATES, formatPrice, convertPrice } from './currency-utils';
import { supabase } from '@/lib/supabase/client';

interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  rates: CurrencyRateMap;
  format: (amountInToman: number) => string;
  convert: (amountInToman: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'TOMAN',
  setCurrency: () => {},
  rates: DEFAULT_RATES,
  format: (amt) => formatPrice(amt, 'TOMAN', DEFAULT_RATES),
  convert: (amt) => amt,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<SupportedCurrency>('TOMAN');
  const [rates, setRates] = useState<CurrencyRateMap>(DEFAULT_RATES);

  useEffect(() => {
    // Load persisted currency
    const saved = localStorage.getItem('tehranroom_currency') as SupportedCurrency;
    if (saved && (saved === 'TOMAN' || saved === 'USD' || saved === 'EUR' || saved === 'AFN')) {
      setCurrencyState(saved);
    }

    // Fetch dynamic rates from Supabase
    async function fetchRates() {
      try {
        const { data, error } = await supabase
          .from('currencies')
          .select('code, name_fa, name_en, symbol, rate_to_toman')
          .eq('is_active', true);

        if (!error && data && data.length > 0) {
          const map: CurrencyRateMap = { ...DEFAULT_RATES };
          data.forEach((item) => {
            map[item.code] = {
              name_fa: item.name_fa,
              name_en: item.name_en,
              symbol: item.symbol,
              rate_to_toman: Number(item.rate_to_toman),
            };
          });
          setRates(map);
        }
      } catch (err) {
        console.error('Failed to load currency rates, using defaults', err);
      }
    }

    fetchRates();
  }, []);

  const setCurrency = (c: SupportedCurrency) => {
    setCurrencyState(c);
    localStorage.setItem('tehranroom_currency', c);
  };

  const format = (amountInToman: number) => {
    return formatPrice(amountInToman, currency, rates);
  };

  const convert = (amountInToman: number) => {
    return convertPrice(amountInToman, currency, rates);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, format, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

