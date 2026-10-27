import { getOption, getProduct } from '../data/menu';
import { isBranchId } from '../data/branches';
import type { BranchId, CartLine, CartState, ResolvedCartLine } from '../types';

export const MAX_QUANTITY = 99;

export const EMPTY_CART: CartState = { branchId: null, lines: [] };

export function lineKey(productId: string, optionId: string): string {
  return `${productId}::${optionId}`;
}

/** Adds `quantity` of a product option, merging with an existing line for the same option. */
export function addLine(lines: CartLine[], productId: string, optionId: string, quantity = 1): CartLine[] {
  const existing = lines.find((l) => l.productId === productId && l.optionId === optionId);
  if (existing) {
    return lines.map((l) =>
      l === existing ? { ...l, quantity: Math.min(MAX_QUANTITY, l.quantity + quantity) } : l,
    );
  }
  return [...lines, { productId, optionId, quantity: Math.min(MAX_QUANTITY, quantity) }];
}

/** Sets an exact quantity; zero or less removes the line. */
export function setLineQuantity(lines: CartLine[], key: string, quantity: number): CartLine[] {
  if (quantity <= 0) return removeLine(lines, key);
  const q = Math.min(MAX_QUANTITY, Math.floor(quantity));
  return lines.map((l) => (lineKey(l.productId, l.optionId) === key ? { ...l, quantity: q } : l));
}

export function removeLine(lines: CartLine[], key: string): CartLine[] {
  return lines.filter((l) => lineKey(l.productId, l.optionId) !== key);
}

/** Joins cart lines with current menu data. Lines whose product/price no longer exists are dropped. */
export function resolveLines(lines: CartLine[]): ResolvedCartLine[] {
  const out: ResolvedCartLine[] = [];
  for (const line of lines) {
    const product = getProduct(line.productId);
    const option = product && getOption(product, line.optionId);
    if (!product || !option) continue;
    out.push({
      ...line,
      key: lineKey(line.productId, line.optionId),
      product,
      option,
      lineTotal: roundMoney(option.price * line.quantity),
    });
  }
  return out;
}

export function subtotal(lines: ResolvedCartLine[]): number {
  return roundMoney(lines.reduce((sum, l) => sum + l.lineTotal, 0));
}

export function itemCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Validates data read from storage; anything malformed is discarded. */
export function sanitizeCart(raw: unknown): CartState {
  if (!raw || typeof raw !== 'object') return EMPTY_CART;
  const r = raw as { branchId?: unknown; lines?: unknown };
  const branchId: BranchId | null = isBranchId(r.branchId) ? r.branchId : null;
  if (!branchId || !Array.isArray(r.lines)) return EMPTY_CART;
  let lines: CartLine[] = [];
  for (const l of r.lines) {
    if (!l || typeof l !== 'object') continue;
    const { productId, optionId, quantity } = l as Record<string, unknown>;
    if (typeof productId !== 'string' || typeof optionId !== 'string') continue;
    if (typeof quantity !== 'number' || !Number.isFinite(quantity) || quantity < 1) continue;
    const product = getProduct(productId);
    if (!product || !getOption(product, optionId)) continue;
    lines = addLine(lines, productId, optionId, Math.floor(quantity));
  }
  return { branchId, lines };
}
