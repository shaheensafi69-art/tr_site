import { NextResponse } from 'next/server';
import { getLiveCurrencyRates } from '@/lib/currency/live-rates';

export async function GET() {
  const rates = await getLiveCurrencyRates();
  return NextResponse.json({
    success: true,
    rates,
    timestamp: new Date().toISOString(),
  });
}

