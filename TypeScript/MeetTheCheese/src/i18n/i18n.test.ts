import { describe, expect, it } from 'vitest';
import { ar } from './ar';
import { en } from './en';
import { translate, translatePlural } from './LanguageContext';
import { formatPrice } from '../utils/currency';
import { CATEGORIES, GROUPS, PRODUCTS } from '../data/menu';
import { matchesQuery } from '../utils/search';

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe('translations', () => {
  it('Arabic covers every English key with the same placeholders', () => {
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(ar[key], key).toBeTruthy();
      expect(placeholders(ar[key]), key).toEqual(placeholders(en[key]));
    }
  });

  it('has labels for every category, group and price option', () => {
    for (const c of CATEGORIES) expect(en).toHaveProperty(`cat.${c.id}`);
    for (const g of GROUPS) expect(en).toHaveProperty(`group.${g}`);
    for (const p of PRODUCTS) for (const o of p.options) expect(en).toHaveProperty(`option.${o.id}`);
  });

  it('interpolates and pluralises', () => {
    expect(translate('en', 'toast.added', { name: 'OMG' })).toBe('Added OMG to your cart');
    expect(translatePlural('en', 'items', 1)).toBe('1 item');
    expect(translatePlural('en', 'items', 4)).toBe('4 items');
    expect(translatePlural('ar', 'items', 1)).toBe('صنف واحد');
    expect(translatePlural('ar', 'items', 2)).toBe('صنفان');
    expect(translatePlural('ar', 'items', 5)).toBe('5 أصناف');
    expect(translatePlural('ar', 'items', 11)).toBe('11 صنفًا');
  });

  it('formats AED prices for each language', () => {
    expect(formatPrice(28, 'en')).toBe('AED 28.00');
    expect(formatPrice(1234.5, 'en')).toBe('AED 1,234.50');
    expect(formatPrice(28, 'ar')).toBe('28.00 د.إ');
  });

  it('search finds items by English name or Arabic category', () => {
    const zinger = PRODUCTS.find((p) => p.id === 'classic-zinger')!;
    expect(matchesQuery(zinger, 'classic zinger')).toBe(true);
    expect(matchesQuery(zinger, 'زنجر', 'ساندويتشات زنجر')).toBe(true);
    expect(matchesQuery(zinger, 'ساندويتشات', 'ساندويتشات زنجر')).toBe(true);
    expect(matchesQuery(zinger, 'موهيتو', 'ساندويتشات زنجر')).toBe(false);
  });
});
