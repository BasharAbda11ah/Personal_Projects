import { branchFullName, whatsappPhones } from '../data/branches';
import { fullName, getCategory } from '../data/menu';
import type { Branch, ResolvedCartLine } from '../types';
import { formatAED } from './currency';

/**
 * The order request the customer sends to the branch on WhatsApp.
 * Always written in English so staff at every branch read the same format, and uses the
 * product names exactly as printed on the menu. No internal ids or debug data.
 */
export function buildOrderMessage(branch: Branch, lines: ResolvedCartLine[], subtotal: number): string {
  const contacts = whatsappPhones(branch).map((p) => p.display);
  const hasUnclear = lines.some((l) => l.product.priceStatus === 'option-unclear');

  const items = lines.map((l, i) => {
    const variant = l.product.options.length > 1 ? ` — ${l.option.label}` : '';
    const category = getCategory(l.product.categoryId);
    // Add-ons and sauces read better with their section (e.g. "Bacon (Add On)").
    const suffix = category && (category.group === 'extras') ? ` (${category.name})` : '';
    const rows = [
      `${i + 1}. ${fullName(l.product)}${suffix}${variant}`,
      `Quantity: ${l.quantity}`,
      `Unit price: ${formatAED(l.option.price)}`,
      `Line total: ${formatAED(l.lineTotal)}`,
    ];
    if (l.product.priceStatus === 'option-unclear') rows.push('(Printed price option — please confirm)');
    return rows.join('\n');
  });

  return [
    '*MEET THE CHEESE — ORDER REQUEST*',
    '',
    `Selected branch: ${branchFullName(branch, 'en')}`,
    `Branch location: ${branch.address.en}`,
    ...(contacts.length ? [`Branch WhatsApp: ${contacts.join(' / ')}`] : []),
    '',
    '*ITEMS*',
    items.join('\n\n'),
    '',
    `*Subtotal: ${formatAED(subtotal)}*`,
    ...(hasUnclear ? ['Some items show a printed price option that needs your confirmation.'] : []),
    '',
    'Please confirm availability and the next steps for this order.',
  ].join('\n');
}

/** WhatsApp click-to-chat URL with a fully encoded message. */
export function buildWhatsAppUrl(e164: string, message: string): string {
  return `https://wa.me/${e164}?text=${encodeURIComponent(message)}`;
}
