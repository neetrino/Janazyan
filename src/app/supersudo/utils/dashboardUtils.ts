/**
 * Dashboard utility functions
 */

import { CURRENCIES, formatPriceInCurrency, type CurrencyCode } from '../../../lib/currency';

/**
 * Formats an amount already stored in AMD (order totals, dashboard revenue).
 * Do not use formatPrice here — that treats the value as USD and multiplies by rate.
 */
export function formatDashboardAmdAmount(amount: number): string {
  return formatPriceInCurrency(amount, 'AMD');
}

/**
 * Formats currency amount that is already in the given currency (no conversion).
 */
export function formatCurrency(amount: number, currency: string = 'AMD'): string {
  if (currency in CURRENCIES) {
    return formatPriceInCurrency(amount, currency as CurrencyCode);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('hy-AM', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

