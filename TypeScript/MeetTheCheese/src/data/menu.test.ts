import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BRANCHES } from './branches';
import { CATEGORIES, PRODUCTS, __TABLE_CATEGORY_IDS, getProduct } from './menu';
import { matchesQuery } from '../utils/search';

describe('menu data integrity', () => {
  it('has unique product ids', () => {
    const ids = PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every table category is a declared category', () => {
    const declared = new Set(CATEGORIES.map((c) => c.id));
    for (const id of __TABLE_CATEGORY_IDS) expect(declared.has(id)).toBe(true);
  });

  it('every referenced image exists in /public', () => {
    for (const p of PRODUCTS) {
      if (!p.image) continue;
      expect(existsSync(resolve(__dirname, '../../public', `.${p.image}`)), p.image).toBe(true);
    }
  });

  it('prices are positive and only unverified items lack a price', () => {
    for (const p of PRODUCTS) {
      for (const o of p.options) expect(o.price).toBeGreaterThan(0);
      if (p.options.length === 0) expect(p.priceStatus).toBe('unconfirmed');
      if (p.priceStatus === 'unconfirmed') expect(p.options).toHaveLength(0);
    }
  });

  it('matches the validation examples from the brief', () => {
    const expected: Record<string, number[]> = {
      'classic-zinger': [21, 29],
      hollandise: [18, 26],
      zingwich: [12, 20],
      'cheezy-zinger-burger': [20, 28],
      'doppler-burger': [20, 28],
      'mega-classic-burger': [22, 30],
      'buffalo-zinger-burger': [20, 28],
      'chillay-zinger-burger': [16, 24],
      'classic-zinger-burger': [16, 24],
      'mash-classic-burger': [17, 25],
      'crunchy-cheetos': [20, 28],
      rockstar: [12, 20],
      'mix-berry-shake': [14],
      'lotus-shake': [14],
      'blueberry-shake': [14],
      'mix-berry-smoothie': [14],
      'blueberry-smoothie': [14],
      'mango-smoothie': [14],
      'passion-fruit-smoothie': [14],
      'strawberry-smoothie': [14],
    };
    for (const [id, prices] of Object.entries(expected)) {
      expect(getProduct(id)?.options.map((o) => o.price), id).toEqual(prices);
    }
  });

  it('search matches by name, ignoring punctuation and case', () => {
    expect(matchesQuery(getProduct('sauce-bbq')!, 'bbq')).toBe(true);
    expect(matchesQuery(getProduct('mac-n-cheese')!, 'MAC n cheese')).toBe(true);
    expect(matchesQuery(getProduct('mojito-lemon')!, 'lemon mojito')).toBe(true);
    expect(matchesQuery(getProduct('omg')!, 'shake')).toBe(false);
  });
});

describe('branches', () => {
  it('has the three supplied branches with valid WhatsApp numbers', () => {
    expect(BRANCHES.map((b) => b.id)).toEqual(['ajman', 'al-zubair', 'kalba']);
    for (const b of BRANCHES) {
      for (const p of b.phones) if (p.e164) expect(p.e164).toMatch(/^971\d{8,9}$/);
    }
  });

  it('has the supplied opening hours for every branch (Friday listed separately)', () => {
    const hours = Object.fromEntries(BRANCHES.map((b) => [b.id, b.openingHours?.map((h) => `${h.days.en} ${h.time.en}`)]));
    expect(hours).toEqual({
      ajman: ['Sat – Thu 12:00 PM – 1:00 AM', 'Friday 3:00 PM – 1:00 AM'],
      'al-zubair': ['Sat – Thu 12:00 PM – 12:00 AM', 'Friday 3:00 PM – 12:00 AM'],
      kalba: ['Sat – Thu 12:00 PM – 1:00 AM', 'Friday 3:00 PM – 2:00 AM'],
    });
    for (const b of BRANCHES) for (const h of b.openingHours ?? []) expect(h.days.ar && h.time.ar).toBeTruthy();
  });
});
