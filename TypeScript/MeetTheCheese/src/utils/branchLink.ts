import { isBranchId } from '../data/branches';
import type { BranchId, CartState } from '../types';

/**
 * Branch-specific links for QR codes, e.g. https://<domain>/?branch=kalba
 * (also accepts ?branch=al-zubair, ?branch=alzubair, and the same after the hash: /#/?branch=ajman).
 */
const ALIASES: Record<string, BranchId> = {
  alzubair: 'al-zubair',
  zubair: 'al-zubair',
};

export type LinkStatus = 'none' | 'applied' | 'pending' | 'invalid';

export interface InitialBranchState {
  branchId: BranchId | null;
  pickerOpen: boolean;
  /** Branch requested by the link but waiting for the customer to confirm clearing their cart. */
  pendingBranchId: BranchId | null;
  linkStatus: LinkStatus;
}

/** Reads ?branch= from the query string or from a query after the hash. Returns the raw value. */
export function readBranchParam(search: string, hash: string): string | null {
  const fromSearch = new URLSearchParams(search).get('branch');
  if (fromSearch !== null) return fromSearch;
  const q = hash.indexOf('?');
  return q >= 0 ? new URLSearchParams(hash.slice(q + 1)).get('branch') : null;
}

export function normalizeBranchParam(raw: string): BranchId | null {
  const v = raw.trim().toLowerCase().replace(/[\s_]+/g, '-');
  if (isBranchId(v)) return v;
  return ALIASES[v.replace(/-/g, '')] ?? null;
}

export function resolveInitialBranch(
  rawParam: string | null,
  savedBranch: BranchId | null,
  savedCart: CartState,
): InitialBranchState {
  const fallback = { branchId: savedBranch, pickerOpen: savedBranch === null, pendingBranchId: null };
  if (rawParam === null || rawParam.trim() === '') return { ...fallback, linkStatus: 'none' };

  const linked = normalizeBranchParam(rawParam);
  // Never let an unknown value select a nonexistent branch.
  if (!linked) return { ...fallback, linkStatus: 'invalid' };

  const cartBelongsElsewhere = savedCart.lines.length > 0 && savedCart.branchId !== null && savedCart.branchId !== linked;
  if (cartBelongsElsewhere) {
    // Don't silently throw away the customer's cart: ask first.
    return { branchId: savedBranch, pickerOpen: true, pendingBranchId: linked, linkStatus: 'pending' };
  }
  return { branchId: linked, pickerOpen: false, pendingBranchId: null, linkStatus: 'applied' };
}

/** True when the URL carries a ?branch= or ?lang= link parameter (in the query or after the hash). */
export function hasLinkParams(search: string, hash: string): boolean {
  const q = hash.indexOf('?');
  const all = [new URLSearchParams(search), new URLSearchParams(q >= 0 ? hash.slice(q + 1) : '')];
  return all.some((p) => p.has('branch') || p.has('lang'));
}

/** Removes ?branch= / ?lang= from the address bar so a later refresh doesn't re-apply them. */
export function stripLinkParams(): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('branch');
    url.searchParams.delete('lang');
    let hash = url.hash;
    const q = hash.indexOf('?');
    if (q >= 0) {
      const hp = new URLSearchParams(hash.slice(q + 1));
      hp.delete('branch');
      hp.delete('lang');
      const rest = hp.toString();
      hash = hash.slice(0, q) + (rest ? `?${rest}` : '');
    }
    const clean = url.pathname + (url.searchParams.toString() ? `?${url.searchParams}` : '') + hash;
    window.history.replaceState(window.history.state, '', clean);
  } catch {
    /* ignore */
  }
}
