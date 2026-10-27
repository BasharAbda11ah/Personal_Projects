import type { Branch, BranchId, Lang, Localized } from '../types';

/**
 * Branch details exactly as supplied by the restaurant.
 *
 * VERIFIED: addresses, phone numbers (all WhatsApp), opening hours for all three branches
 * (from each branch's Google listing). Times after midnight belong to the same evening's opening.
 * NOT SUPPLIED (do not add until the restaurant confirms): map links / coordinates, delivery areas.
 *
 * Arabic addresses wrap English landmark names in \u2066…\u2069 (left-to-right isolate) so brackets render correctly,
 * and \u00a0 (non-breaking spaces) so a landmark name never splits across lines.
 * To change a number: edit `display` (what customers see) and `e164` (digits only, with 971, no + or spaces).
 */
const SAT_THU: Localized = { en: 'Sat – Thu', ar: 'السبت – الخميس' };
const FRI: Localized = { en: 'Friday', ar: 'الجمعة' };

export const BRANCHES: Branch[] = [
  {
    id: 'ajman',
    label: { en: 'Ajman Branch', ar: 'فرع عجمان' },
    shortName: { en: 'Ajman', ar: 'عجمان' },
    address: {
      en: 'Al Hamidiya 1, Ajman (Near Hyakum Car Service)',
      ar: 'الحميدية 1، عجمان (بالقرب من \u2066Hyakum\u00a0Car\u00a0Service\u2069)',
    },
    phones: [
      { display: '+971 50 116 4065', e164: '971501164065', whatsapp: true, label: 'phoneWhatsapp' },
    ],
    openingHours: [
      { days: SAT_THU, time: { en: '12:00 PM – 1:00 AM', ar: '12:00 ظهرًا – 1:00 صباحًا' } },
      { days: FRI, time: { en: '3:00 PM – 1:00 AM', ar: '3:00 عصرًا – 1:00 صباحًا' } },
    ],
  },
  {
    id: 'al-zubair',
    label: { en: 'Al Zubair Branch', ar: 'فرع الزبير' },
    shortName: { en: 'Al Zubair', ar: 'الزبير' },
    address: {
      en: 'Al Zubair, Sharjah (Near Charakov)',
      ar: 'الزبير، الشارقة (بالقرب من \u2066Charakov\u2069)',
    },
    phones: [
      { display: '+971 56 647 0835', e164: '971566470835', whatsapp: true, label: 'phoneWhatsapp' },
    ],
    openingHours: [
      { days: SAT_THU, time: { en: '12:00 PM – 12:00 AM', ar: '12:00 ظهرًا – 12:00 ليلًا' } },
      { days: FRI, time: { en: '3:00 PM – 12:00 AM', ar: '3:00 عصرًا – 12:00 ليلًا' } },
    ],
  },
  {
    id: 'kalba',
    label: { en: 'Kalba Branch', ar: 'فرع كلباء' },
    shortName: { en: 'Kalba', ar: 'كلباء' },
    address: { en: 'Kalba, Sharjah / Fujairah area', ar: 'كلباء، منطقة الشارقة / الفجيرة' },
    phones: [{ display: '+971 52 835 3959', e164: '971528353959', whatsapp: true, label: 'phoneWhatsapp' }],
    openingHours: [
      { days: SAT_THU, time: { en: '12:00 PM – 1:00 AM', ar: '12:00 ظهرًا – 1:00 صباحًا' } },
      { days: FRI, time: { en: '3:00 PM – 2:00 AM', ar: '3:00 عصرًا – 2:00 صباحًا' } },
    ],
  },
];

export const BRAND_NAME = 'Meet The Cheese';

export function getBranch(id: string | null | undefined): Branch | undefined {
  return BRANCHES.find((b) => b.id === id);
}

export function isBranchId(id: unknown): id is BranchId {
  return typeof id === 'string' && BRANCHES.some((b) => b.id === id);
}

export function loc(text: Localized, lang: Lang): string {
  return text[lang];
}

/** "Meet The Cheese — Ajman Branch" (brand name is never translated). */
export function branchFullName(branch: Branch, lang: Lang = 'en'): string {
  return `${BRAND_NAME} — ${branch.label[lang]}`;
}

/** Complete numbers the restaurant supplied as WhatsApp contacts. */
export function whatsappPhones(branch: Branch) {
  return branch.phones.filter((p) => p.whatsapp && p.e164);
}
