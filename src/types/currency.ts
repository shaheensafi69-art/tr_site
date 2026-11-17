import { Database } from './database';

export type CurrencyRow = Database['public']['Tables']['currencies']['Row'];
export type SupportedCurrency = 'TOMAN' | 'IRR' | 'USD' | 'EUR' | 'AFN';

export interface CurrencyRateMap {
  [code: string]: {
    name_fa: string;
    name_en: string;
    symbol: string;
    rate_to_toman: number;
  };
}

