import { SupportedCurrency, CurrencyRateMap } from '@/types/currency';

export const DEFAULT_RATES: CurrencyRateMap = {
  TOMAN: {
    name_fa: 'تومان',
    name_en: 'Toman',
    symbol: 'تومان',
    rate_to_toman: 1.0,
  },
  IRR: {
    name_fa: 'ریال ایران',
    name_en: 'Rials (IRR)',
    symbol: 'ریال',
    rate_to_toman: 0.1,
  },
  USD: {
    name_fa: 'دلار آمریکا',
    name_en: 'USD',
    symbol: '$',
    rate_to_toman: 95000.0,
  },
  EUR: {
    name_fa: 'یورو اتحادیه اروپا',
    name_en: 'EUR',
    symbol: '€',
    rate_to_toman: 102000.0,
  },
  AFN: {
    name_fa: 'افغانی',
    name_en: 'AFN',
    symbol: '؋',
    rate_to_toman: 1320.0,
  },
};

export function toPersianDigits(num: string | number): string {
  if (num === null || num === undefined) return '';
  const str = num.toString();
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (d) => farsiDigits[parseInt(d, 10)]);
}

export function formatNumberWithCommas(num: number | string): string {
  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function convertPrice(
  amountInToman: number,
  targetCurrency: SupportedCurrency,
  rates: CurrencyRateMap = DEFAULT_RATES
): number {
  if (!amountInToman || amountInToman <= 0) return 0;
  if (targetCurrency === 'TOMAN') return amountInToman;

  const rate = rates[targetCurrency]?.rate_to_toman || DEFAULT_RATES[targetCurrency]?.rate_to_toman || 1;
  const converted = amountInToman / rate;

  // Rounding based on currency
  if (targetCurrency === 'USD' || targetCurrency === 'EUR') {
    return Math.round(converted * 10) / 10;
  }
  return Math.round(converted);
}

export function formatPrice(
  amountInToman: number,
  targetCurrency: SupportedCurrency = 'TOMAN',
  rates: CurrencyRateMap = DEFAULT_RATES,
  usePersianDigits: boolean = true
): string {
  const converted = convertPrice(amountInToman, targetCurrency, rates);
  const formattedNumber = formatNumberWithCommas(converted);
  const symbol = rates[targetCurrency]?.symbol || targetCurrency;

  const displayDigits = usePersianDigits && targetCurrency !== 'USD' && targetCurrency !== 'EUR'
    ? toPersianDigits(formattedNumber)
    : formattedNumber;

  if (targetCurrency === 'USD') {
    return `$${formattedNumber}`;
  }
  if (targetCurrency === 'EUR') {
    return `€${formattedNumber}`;
  }
  return `${displayDigits} ${symbol}`;
}

export interface CurrencyPriceBreakdown {
  currency: SupportedCurrency;
  name_fa: string;
  symbol: string;
  formatted: string;
  rawAmount: number;
}

export function getAllCurrencyPrices(
  amountInToman: number,
  rates: CurrencyRateMap = DEFAULT_RATES
): CurrencyPriceBreakdown[] {
  const currencies: SupportedCurrency[] = ['TOMAN', 'IRR', 'USD', 'EUR', 'AFN'];
  return currencies.map((curr) => {
    const converted = convertPrice(amountInToman, curr, rates);
    return {
      currency: curr,
      name_fa: rates[curr]?.name_fa || curr,
      symbol: rates[curr]?.symbol || curr,
      formatted: formatPrice(amountInToman, curr, rates, true),
      rawAmount: converted,
    };
  });
}

