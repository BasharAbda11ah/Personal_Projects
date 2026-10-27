import { describe, expect, it } from 'vitest';
import { addLine, itemCount, lineKey, removeLine, resolveLines, sanitizeCart, setLineQuantity, subtotal } from './cart';
import { formatAED } from './currency';

describe('cart calculations', () => {
  it('adds items and merges the same option into one line', () => {
    let lines = addLine([], 'classic-zinger', 'meal');
    lines = addLine(lines, 'classic-zinger', 'meal');
    lines = addLine(lines, 'classic-zinger', 'single');
    expect(lines).toHaveLength(2);
    expect(lines[0].quantity).toBe(2);
    expect(itemCount(lines)).toBe(3);
  });

  it('uses the selected option price for line totals and subtotal', () => {
    // Classic Zinger 21/29, Lotus Shake 14
    let lines = addLine([], 'classic-zinger', 'meal', 2); // 2 × 29 = 58
    lines = addLine(lines, 'classic-zinger', 'single'); // 1 × 21 = 21
    lines = addLine(lines, 'lotus-shake', 'regular', 3); // 3 × 14 = 42
    const resolved = resolveLines(lines);
    expect(resolved.map((l) => l.lineTotal)).toEqual([58, 21, 42]);
    expect(subtotal(resolved)).toBe(121);
    expect(formatAED(subtotal(resolved))).toBe('AED 121.00');
  });

  it('increases, decreases and removes lines', () => {
    const key = lineKey('omg', 'single');
    let lines = addLine([], 'omg', 'single');
    lines = setLineQuantity(lines, key, 4);
    expect(lines[0].quantity).toBe(4);
    lines = setLineQuantity(lines, key, 3);
    expect(lines[0].quantity).toBe(3);
    expect(setLineQuantity(lines, key, 0)).toHaveLength(0);
    expect(removeLine(lines, key)).toHaveLength(0);
  });

  it('drops stored lines that no longer match the menu or are malformed', () => {
    const cart = sanitizeCart({
      branchId: 'ajman',
      lines: [
        { productId: 'classic-zinger', optionId: 'meal', quantity: 2 },
        { productId: 'not-a-product', optionId: 'regular', quantity: 1 },
        { productId: 'classic-zinger', optionId: 'giant', quantity: 1 },
        { productId: 'sauce-spicy', optionId: 'regular', quantity: 1 }, // unverified price → not orderable
        { productId: 'lotus-shake', optionId: 'regular', quantity: -3 },
      ],
    });
    expect(cart.branchId).toBe('ajman');
    expect(cart.lines).toEqual([{ productId: 'classic-zinger', optionId: 'meal', quantity: 2 }]);
  });

  it('always uses the current menu price, never a price saved in storage', () => {
    const cart = sanitizeCart({
      branchId: 'kalba',
      lines: [{ productId: 'lotus-shake', optionId: 'regular', quantity: 2, price: 1, lineTotal: 2 }],
    });
    const [line] = resolveLines(cart.lines);
    expect(line.option.price).toBe(14);
    expect(line.lineTotal).toBe(28);
    expect(subtotal(resolveLines(cart.lines))).toBe(28);
  });

  it('caps quantities and floors fractional quantities from storage', () => {
    const cart = sanitizeCart({
      branchId: 'ajman',
      lines: [
        { productId: 'omg', optionId: 'single', quantity: 5000 },
        { productId: 'lotus-shake', optionId: 'regular', quantity: 2.7 },
      ],
    });
    expect(cart.lines.map((l) => l.quantity)).toEqual([99, 2]);
    expect(setLineQuantity(cart.lines, lineKey('omg', 'single'), 150)[0].quantity).toBe(99);
  });

  it('rejects carts for unknown branches', () => {
    expect(sanitizeCart({ branchId: 'dubai', lines: [{ productId: 'omg', optionId: 'single', quantity: 1 }] }).lines).toEqual([]);
    expect(sanitizeCart('garbage').lines).toEqual([]);
  });
});
