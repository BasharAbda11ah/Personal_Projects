import type { Lang } from '../types';

const formatter = new Intl.NumberFormat('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Formats a dirham amount as "AED 28.00" (used in WhatsApp messages and English UI). */
export function formatAED(amount: number): string {
  return `AED ${formatter.format(amount)}`;
}

/** Interface price: "AED 28.00" in English, "28.00 د.إ" in Arabic (Western digits, as used on the menu). */
export function formatPrice(amount: number, lang: Lang): string {
  return lang === 'ar' ? `${formatter.format(amount)} د.إ` : formatAED(amount);
}
