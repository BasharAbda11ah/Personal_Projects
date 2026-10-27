import { describe, expect, it } from 'vitest';
import { EMPTY_CART } from './cart';
import { hasLinkParams, normalizeBranchParam, readBranchParam, resolveInitialBranch } from './branchLink';
import { parseHash } from '../hooks/useHashRoute';
import type { CartState } from '../types';

const ajmanCart: CartState = { branchId: 'ajman', lines: [{ productId: 'omg', optionId: 'single', quantity: 1 }] };

describe('QR / branch links', () => {
  it('reads ?branch= from the query string or after the hash', () => {
    expect(readBranchParam('?branch=kalba', '')).toBe('kalba');
    expect(readBranchParam('', '#/?branch=ajman')).toBe('ajman');
    expect(readBranchParam('?lang=ar', '#/')).toBeNull();
  });

  it('accepts known branch ids and friendly variants only', () => {
    expect(normalizeBranchParam('ajman')).toBe('ajman');
    expect(normalizeBranchParam('AL-ZUBAIR')).toBe('al-zubair');
    expect(normalizeBranchParam('alzubair')).toBe('al-zubair');
    expect(normalizeBranchParam('al_zubair')).toBe('al-zubair');
    expect(normalizeBranchParam(' Kalba ')).toBe('kalba');
    expect(normalizeBranchParam('rak')).toBeNull();
    expect(normalizeBranchParam('dubai')).toBeNull();
    expect(normalizeBranchParam('<script>')).toBeNull();
  });

  it('a valid link preselects the branch and skips the picker', () => {
    expect(resolveInitialBranch('kalba', null, EMPTY_CART)).toEqual({
      branchId: 'kalba',
      pickerOpen: false,
      pendingBranchId: null,
      linkStatus: 'applied',
    });
    // Overrides a different saved branch when the cart is empty.
    expect(resolveInitialBranch('kalba', 'ajman', EMPTY_CART).branchId).toBe('kalba');
  });

  it('an invalid link never selects a branch and keeps the normal flow', () => {
    expect(resolveInitialBranch('dubai', null, EMPTY_CART)).toEqual({
      branchId: null,
      pickerOpen: true,
      pendingBranchId: null,
      linkStatus: 'invalid',
    });
    expect(resolveInitialBranch('dubai', 'ajman', ajmanCart).branchId).toBe('ajman');
  });

  it('asks before clearing a cart that belongs to another branch', () => {
    expect(resolveInitialBranch('kalba', 'ajman', ajmanCart)).toEqual({
      branchId: 'ajman',
      pickerOpen: true,
      pendingBranchId: 'kalba',
      linkStatus: 'pending',
    });
    // Same branch as the cart: no question needed.
    expect(resolveInitialBranch('ajman', 'ajman', ajmanCart).linkStatus).toBe('applied');
  });

  it('no link: saved branch opens the menu directly, first visit shows the picker', () => {
    expect(resolveInitialBranch(null, 'ajman', EMPTY_CART)).toMatchObject({ branchId: 'ajman', pickerOpen: false, linkStatus: 'none' });
    expect(resolveInitialBranch(null, null, EMPTY_CART)).toMatchObject({ branchId: null, pickerOpen: true });
  });
});

describe('link clean-up', () => {
  // Regression: a lang-only link (?lang=ar) used to stay in the address bar, so a refresh
  // after switching to English flipped the site back to Arabic.
  it('detects ?branch= and ?lang= in the query or after the hash', () => {
    expect(hasLinkParams('?lang=ar', '')).toBe(true);
    expect(hasLinkParams('?branch=kalba', '')).toBe(true);
    expect(hasLinkParams('', '#/?lang=en')).toBe(true);
    expect(hasLinkParams('', '#/summary?branch=ajman')).toBe(true);
    expect(hasLinkParams('?utm_source=qr', '#menu')).toBe(false);
    expect(hasLinkParams('', '')).toBe(false);
  });
});

describe('hash routes', () => {
  it('maps hashes to pages, treating plain anchors and link queries as home', () => {
    expect(parseHash('')).toEqual({ route: 'home', anchor: null });
    expect(parseHash('#/')).toEqual({ route: 'home', anchor: null });
    expect(parseHash('#/?branch=kalba')).toEqual({ route: 'home', anchor: null });
    expect(parseHash('#menu')).toEqual({ route: 'home', anchor: 'menu' });
    expect(parseHash('#/summary')).toEqual({ route: 'summary', anchor: null });
    expect(parseHash('#/privacy')).toEqual({ route: 'privacy', anchor: null });
    expect(parseHash('#/nope').route).toBe('not-found');
  });
});
