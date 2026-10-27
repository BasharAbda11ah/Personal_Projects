export type BranchId = 'ajman' | 'al-zubair' | 'kalba';

export type Lang = 'en' | 'ar';

/** Text supplied in both interface languages. */
export interface Localized {
  en: string;
  ar: string;
}

export type PhoneLabel = 'phoneWhatsapp';

export interface PhoneContact {
  /** Number as it should be displayed, e.g. "+971 50 116 4065". */
  display: string;
  /** Digits only in international format, e.g. "971501164065". */
  e164: string;
  /** True only when the restaurant supplied this number as a WhatsApp contact. */
  whatsapp: boolean;
  /** Neutral label key. Never assign a purpose that wasn't supplied. */
  label: PhoneLabel;
}

export interface HoursRow {
  days: Localized;
  time: Localized;
}

export interface Branch {
  id: BranchId;
  /** e.g. "Ajman Branch" — shown after the brand name. */
  label: Localized;
  shortName: Localized;
  address: Localized;
  phones: PhoneContact[];
  /** Only set when supplied by the restaurant. One row per group of days. */
  openingHours?: HoursRow[];
  /** Only set when a verified destination URL is available. */
  mapUrl?: string;
}

export type CategoryGroup = 'burgers' | 'sandwiches' | 'meals' | 'chicken' | 'sides' | 'drinks' | 'extras';

export interface Category {
  id: string;
  /** Category heading as printed on the menu. */
  name: string;
  group: CategoryGroup;
  /** Which PDF / page the category was read from. */
  source: string;
}

export type OptionId = 'regular' | 'single' | 'meal' | 'option-1' | 'option-2';

export interface PriceOption {
  id: OptionId;
  /** English label (also used in WhatsApp messages). Interface text comes from the dictionary. */
  label: string;
  price: number;
}

/**
 * How reliable the printed price is:
 *  - confirmed       one clearly printed price
 *  - meal-inferred   two printed prices; second = first + AED 8 ("Add On Meal 8 Aed") → Single / Meal
 *  - option-unclear  two printed prices with no explanation → orderable, flagged for the branch to confirm
 *  - unconfirmed     price could not be read → NOT orderable
 */
export type PriceStatus = 'confirmed' | 'meal-inferred' | 'option-unclear' | 'unconfirmed';

export interface Product {
  id: string;
  /** Name as printed on the menu (only line breaks / casing normalised). */
  name: string;
  categoryId: string;
  /** Public path to the product photo, when one was extracted from the menu. */
  image?: string;
  /** Only text printed on the menu itself. */
  description?: string;
  /** Empty when the price could not be read reliably. */
  options: PriceOption[];
  priceStatus: PriceStatus;
}

export interface CartLine {
  productId: string;
  optionId: string;
  quantity: number;
}

export interface CartState {
  branchId: BranchId | null;
  lines: CartLine[];
}

/** A cart line joined with menu data, ready for display and totals. */
export interface ResolvedCartLine extends CartLine {
  key: string;
  product: Product;
  option: PriceOption;
  lineTotal: number;
}
