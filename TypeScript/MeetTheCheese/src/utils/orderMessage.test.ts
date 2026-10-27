import { describe, expect, it } from 'vitest';
import { BRANCHES, getBranch, whatsappPhones } from '../data/branches';
import { addLine, resolveLines, subtotal } from './cart';
import { buildOrderMessage, buildWhatsAppUrl } from './orderMessage';
import { telHref, whatsappHref } from './contact';

function cart(entries: [string, string, number][]) {
  let lines: ReturnType<typeof addLine> = [];
  for (const [id, opt, q] of entries) lines = addLine(lines, id, opt, q);
  const resolved = resolveLines(lines);
  return { lines: resolved, total: subtotal(resolved) };
}

describe('WhatsApp order message', () => {
  const ajman = getBranch('ajman')!;

  it('lists numbered items with variant, quantity, unit price, line total and subtotal', () => {
    const { lines, total } = cart([
      ['classic-zinger', 'meal', 2], // 2 × 29
      ['lotus-shake', 'regular', 1], // 14
      ['mojito-lemon', 'regular', 3], // 3 × 13
    ]);
    const msg = buildOrderMessage(ajman, lines, total);

    expect(msg).toContain('*MEET THE CHEESE — ORDER REQUEST*');
    expect(msg).toContain('Selected branch: Meet The Cheese — Ajman Branch');
    expect(msg).toContain('Branch location: Al Hamidiya 1, Ajman (Near Hyakum Car Service)');
    expect(msg).toContain('1. Classic Zinger — Meal\nQuantity: 2\nUnit price: AED 29.00\nLine total: AED 58.00');
    expect(msg).toContain('2. Lotus Shake\nQuantity: 1\nUnit price: AED 14.00\nLine total: AED 14.00');
    expect(msg).toContain('3. Lemon Mojito\nQuantity: 3\nUnit price: AED 13.00\nLine total: AED 39.00');
    expect(msg).toContain('*Subtotal: AED 111.00*');
    expect(msg).toContain('Please confirm availability and the next steps for this order.');
  });

  it('lists the branch WhatsApp number (Al Zubair: only the working number)', () => {
    const { lines, total } = cart([['omg', 'single', 1]]);
    expect(buildOrderMessage(ajman, lines, total)).toContain('Branch WhatsApp: +971 50 116 4065');
    const zubair = buildOrderMessage(getBranch('al-zubair')!, lines, total);
    expect(zubair).toContain('Branch WhatsApp: +971 56 647 0835');
    expect(zubair).not.toContain('510 8828');
  });

  it('flags unclear price options and labels add-ons, without exposing internal ids', () => {
    const { lines, total } = cart([
      ['potato-wedges', 'option-2', 1],
      ['addon-bacon', 'regular', 2],
    ]);
    const msg = buildOrderMessage(ajman, lines, total);
    expect(msg).toContain('1. Potato Wedges — Option 2');
    expect(msg).toContain('(Printed price option — please confirm)');
    expect(msg).toContain('2. Bacon (Add On)');
    expect(msg).not.toMatch(/addon-bacon|potato-wedges|option-2|regular/);
  });

  it('encodes the full message into a wa.me URL that decodes back exactly', () => {
    const { lines, total } = cart([['mac-n-cheese', 'regular', 1], ['three-star', 'meal', 1]]);
    const msg = buildOrderMessage(ajman, lines, total);
    const url = buildWhatsAppUrl('971501164065', msg);
    expect(url.startsWith('https://wa.me/971501164065?text=')).toBe(true);
    // Spaces, new lines and dashes are percent-encoded ("*" is URL-safe and kept for WhatsApp bold).
    expect(url).not.toMatch(/[\s—&#]/);
    expect(url).toContain('%0A');
    expect(new URL(url).searchParams.get('text')).toBe(msg);
  });
});

describe('branch contact links', () => {
  it('each branch sends WhatsApp orders to its own supplied number(s)', () => {
    const recipients = Object.fromEntries(BRANCHES.map((b) => [b.id, whatsappPhones(b).map((p) => p.e164)]));
    expect(recipients).toEqual({
      ajman: ['971501164065'],
      'al-zubair': ['971566470835'],
      kalba: ['971528353959'],
    });
  });

  it('every listed number has working Call and WhatsApp links', () => {
    for (const b of BRANCHES) {
      for (const p of b.phones) {
        expect(telHref(p)).toBe(`tel:+${p.e164}`);
        expect(whatsappHref(p)?.startsWith(`https://wa.me/${p.e164}?text=`)).toBe(true);
      }
    }
    expect(BRANCHES.flatMap((b) => b.phones.map((p) => p.e164))).not.toContain('971565108828');
  });
});
