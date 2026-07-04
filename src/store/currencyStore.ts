import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types';

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'AED' | 'CNY' | 'JPY' | 'GBP';

/** Language → default display currency, per product spec. */
export const LANGUAGE_CURRENCY_MAP: Record<string, CurrencyCode> = {
  en: 'USD',
  ta: 'INR',
  hi: 'INR',
  ml: 'INR',
  te: 'INR',
  kn: 'INR',
  fr: 'EUR',
  de: 'EUR',
  es: 'EUR',
  ar: 'AED',
  zh: 'CNY',
  ja: 'JPY',
};

/** Static fallback rates (units of currency per 1 USD) used if the live-rate call fails. */
export const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  INR: 83.2,
  EUR: 0.92,
  AED: 3.67,
  CNY: 7.24,
  JPY: 156.5,
  GBP: 0.79,
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  AED: 'AED ',
  CNY: '¥',
  JPY: '¥',
  GBP: '£',
};

interface CurrencyRatesResponse {
  base: string;
  rates: Record<string, number>;
}

interface CurrencyState {
  currency: CurrencyCode;
  rates: Record<string, number>;
  ratesLoaded: boolean;
  setCurrency: (currency: CurrencyCode) => void;
  fetchRates: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: 'USD',
      rates: FALLBACK_RATES,
      ratesLoaded: false,
      setCurrency: (currency) => set({ currency }),
      fetchRates: async () => {
        if (get().ratesLoaded) return;
        try {
          const res = await apiClient.get<ApiResponse<CurrencyRatesResponse>>('/meta/currency-rates');
          const rates = res.data.data?.rates;
          if (rates && Object.keys(rates).length > 0) {
            set({ rates: { ...FALLBACK_RATES, ...rates }, ratesLoaded: true });
            return;
          }
          set({ ratesLoaded: true });
        } catch {
          set({ ratesLoaded: true });
        }
      },
    }),
    {
      name: 'sed-ecomm-currency',
      partialize: (state) => ({ currency: state.currency }),
    },
  ),
);

/** Converts a USD amount to `currency` using the live/fallback rate table and formats it. */
export function formatPrice(amountUSD: number, currency: CurrencyCode, rates: Record<string, number>): string {
  const rate = rates[currency] ?? FALLBACK_RATES[currency] ?? 1;
  const converted = amountUSD * rate;
  const fractionDigits = currency === 'JPY' ? 0 : 2;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(converted);
  } catch {
    const symbol = CURRENCY_SYMBOLS[currency] ?? '';
    return `${symbol}${converted.toFixed(fractionDigits)}`;
  }
}
