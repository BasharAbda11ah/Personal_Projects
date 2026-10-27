import type { Category, PriceOption, Product } from '../types';

/**
 * MEET THE CHEESE MENU — single source of truth.
 *
 * Read from:
 *  - "meet the cheese 2024 for online.pdf"  (pages 2–20, food + mojito + add-ons)
 *  - "Meet The Refreshment Menu.pdf"         (pages 1–2, shakes / smoothies / lassi)
 *
 * Names keep the menu's own spelling (e.g. "Hollandise", "Moster Meal", "Stips Lite Meal");
 * only ALL-CAPS was converted to title case. To edit the menu, change the tables below.
 *
 * Pricing notation used in the tables:
 *   14            → one price
 *   meal(21, 29)  → menu prints "21/29 Dhs"; the gap is exactly the menu's "Add On Meal 8 Aed"
 *   two(8, 12)    → menu prints two prices whose meaning is not explained → flagged for verification
 *   null          → price could not be read reliably → not orderable, flagged for verification
 *
 * Each product gets a `priceStatus` (see types.ts) so uncertain prices stay visible to customers
 * and can be listed for the restaurant to confirm (see docs/MENU_CONFIRMATION.md).
 * Once the restaurant confirms a price, change its pricing to a plain number or meal(a, b).
 */

export const CATEGORIES: Category[] = [
  { id: 'zinger-sandwiches', name: 'Zinger Sandwiches', group: 'sandwiches', source: 'Food menu p.2' },
  { id: 'zinger-burger', name: 'Zinger Burger', group: 'burgers', source: 'Food menu p.3' },
  { id: 'smash-beef-burger', name: 'Smash Beef Burger', group: 'burgers', source: 'Food menu p.4' },
  { id: 'smash-burger', name: 'Smash Burger', group: 'burgers', source: 'Food menu p.5' },
  { id: 'toast-sandwich', name: 'Toast Sandwich', group: 'sandwiches', source: 'Food menu p.6' },
  { id: 'sandwich', name: 'Sandwich', group: 'sandwiches', source: 'Food menu p.17' },
  { id: 'wrap', name: 'Wrap', group: 'sandwiches', source: 'Food menu p.16' },
  { id: 'combo-meals', name: 'Combo Meals', group: 'meals', source: 'Food menu p.7–9' },
  { id: 'biggi', name: 'Biggi', group: 'meals', source: 'Food menu p.10' },
  { id: 'kids-meal', name: 'Kids Meal', group: 'meals', source: 'Food menu p.11' },
  { id: 'chicken-meal', name: 'Chicken Meal', group: 'chicken', source: 'Food menu p.15' },
  { id: 'chicken-bucket', name: 'Chicken Bucket', group: 'chicken', source: 'Food menu p.14' },
  { id: 'strip-bucket', name: 'Strip Bucket', group: 'chicken', source: 'Food menu p.14' },
  { id: 'appetizerz', name: 'Appetizerz', group: 'sides', source: 'Food menu p.12–13' },
  { id: 'pasta', name: 'Pasta', group: 'sides', source: 'Food menu p.18' },
  { id: 'mojito', name: 'Mojito', group: 'drinks', source: 'Food menu p.19' },
  { id: 'shakes', name: 'Shakes', group: 'drinks', source: 'Refreshment menu p.1–2' },
  { id: 'smoothies', name: 'Smoothies', group: 'drinks', source: 'Refreshment menu p.2' },
  { id: 'lassi', name: 'Lassi', group: 'drinks', source: 'Refreshment menu p.1' },
  { id: 'add-on', name: 'Add On', group: 'extras', source: 'Food menu p.20' },
  { id: 'sauce-box', name: 'Sauce Box', group: 'extras', source: 'Food menu p.20' },
];

type Pricing = number | null | { kind: 'meal' | 'two'; a: number; b: number };
const meal = (a: number, b: number): Pricing => ({ kind: 'meal', a, b });
const two = (a: number, b: number): Pricing => ({ kind: 'two', a, b });

/** [id, printed name, price, image file (in /images/menu) or null, printed description] */
type Row = [id: string, name: string, pricing: Pricing, image?: string | null, description?: string];

const TABLE: Record<string, Row[]> = {
  'zinger-sandwiches': [
    ['classic-zinger', 'Classic Zinger', meal(21, 29)],
    ['hollandise', 'Hollandise', meal(18, 26)],
    ['zingwich', 'Zingwich', meal(12, 20)],
    ['cheezy-zinger-burger', 'Cheezy Zinger Burger', meal(20, 28)],
    ['doppler-burger', 'Doppler Burger', meal(20, 28)],
    ['mega-classic-burger', 'Mega Classic Burger', meal(22, 30)],
  ],
  'zinger-burger': [
    ['buffalo-zinger-burger', 'Buffalo Zinger Burger', meal(20, 28)],
    ['chillay-zinger-burger', 'Chillay Zinger Burger', meal(16, 24)],
    ['classic-zinger-burger', 'Classic Zinger Burger', meal(16, 24)],
    ['mash-classic-burger', 'Mash Classic Burger', meal(17, 25)],
    ['crunchy-cheetos', 'Crunchy Cheetos', meal(20, 28)],
    ['rockstar', 'Rockstar', meal(12, 20)],
  ],
  'smash-beef-burger': [
    ['three-star', 'Three Star', meal(25, 33)],
    ['big-g', 'Big G', meal(20, 28)],
    ['royal-feast', 'Royal Feast', meal(20, 28)],
    ['omg', 'OMG', meal(20, 28)],
    ['cheesy-beef-burger', 'Cheesy Beef Burger', meal(20, 28)],
    ['classic-beef-burger', 'Classic Beef Burger', meal(20, 28)],
  ],
  'smash-burger': [
    ['nuker-burger', 'Nuker Burger', meal(25, 33)],
    ['mushroom-beef-burger', 'Mushroom Beef Burger', meal(20, 28)],
    ['bite-joy-burger', 'Bite Joy Burger', meal(12, 20)],
    ['beef-becon-burger', 'Beef Becon Burger', meal(18, 26)],
    ['grill-chi-mushroom', 'Grill Chi. Mushroom', meal(18, 26)],
    ['grill-chi-double', 'Grill Chi. Double', meal(20, 28)],
  ],
  'toast-sandwich': [
    ['mac-n-zinger-toast', 'Mac N Zinger Toast', meal(20, 28)],
    ['crunchy-toast', 'Crunchy Toast', meal(20, 28)],
    ['cheetos-zinger', 'Cheetos Zinger', meal(20, 28)],
    ['spicy-zinger-toast', 'Spicy Zinger Toast', meal(20, 28)],
    ['beef-toast', 'Beef Toast', meal(20, 28)],
    ['cheesy-zinger-toast', 'Cheesy Zinger Toast', meal(20, 28)],
  ],
  sandwich: [
    ['beef-steak-sandwich', 'Beef Steak Sandwich', meal(20, 28)],
    ['shrimp-supreme', 'Shrimp Supreme', meal(20, 28)],
    ['crazy-hotdog', 'Crazy Hotdog', meal(15, 23)],
    ['classic-hotdog', 'Classic Hotdog', meal(15, 23)],
    ['cheese-hotdog', 'Cheese Hotdog', meal(15, 23)],
  ],
  wrap: [
    ['spicy-twister', 'Spicy Twister', meal(12, 20)],
    ['cheetos-twister', 'Cheetos Twister', meal(12, 20)],
    ['classic-beef-wrap', 'Classic Beef Wrap', meal(12, 20)],
    ['dynamite-beef-wrap', 'Dynamite Beef Wrap', meal(12, 20)],
    ['classic-chicken-wrap', 'Classic Chicken Wrap', meal(12, 20)],
    ['twister', 'Twister', meal(9, 17)],
  ],
  'combo-meals': [
    ['doppler-extra-meal', 'Doppler Extra Meal', 29],
    ['omg-extra-meal', 'OMG Extra Meal', 29],
    ['cheetos-punch', 'Cheetos Punch', 55],
    ['rock-n-joy-combo', 'Rock N Joy Combo', 34],
    ['meet-the-cheese-combo', 'Meet The Cheese Combo', 50],
    ['snack-attack-meal', 'Snack Attack Meal', 53],
    ['viral-combo', 'Viral Combo', 74],
    ['classic-meal', 'Classic Meal', 49],
    ['ultimate-double-combo', 'Ultimate Double Combo', 64],
    ['snap-bite-meal', 'Snap Bite Meal', 22],
    ['noor-meal', 'Noor Meal', 22],
    ['zingwich-extra-meal', 'Zingwich Extra Meal', 22],
    ['beefy-meal', 'Beefy Meal', 46],
    ['omd-meal', 'OMD Meal', 49],
    ['zinger-treat', 'Zinger Treat', 36],
    ['biggy-meal', 'Biggy Meal', 58],
    ['bite-buddy-deal', 'Bite Buddy Deal', 28],
    ['buffalo-chi-delight-meal', 'Buffalo Chi. Delight Meal', 32],
  ],
  biggi: [
    ['mega-hollandise', 'Mega Hollandise', 69],
    [
      'mtc-family-meal',
      'MTC Family Meal',
      99,
      undefined,
      '2 Classic Zinger + 1 Hollandise + 1 Zingwich + 2 Twister + 10 pc Nuggets + Curly Fries',
    ],
    ['moster-meal', 'Moster Meal', 80],
  ],
  'kids-meal': [
    ['kids-chicken-popcorn', 'Kids Chicken Popcorn', 15],
    ['kids-chicken-nuggets', 'Kids Chicken Nuggets', 15],
    ['kids-chicken-burger-meal', 'Kids Chicken Burger Meal', 15],
  ],
  'chicken-meal': [
    ['snack-meal-2-pcs', 'Snack Meal (2 PCS)', 15],
    ['snack-meal-3-pcs', 'Snack Meal (3 PCS)', 17],
    ['dinner-meal', 'Dinner Meal', 20],
    ['stips-lite-meal', 'Stips Lite Meal', 14],
    ['strips-extra-meal', 'Strips Extra Meal', 20],
  ],
  'chicken-bucket': [
    ['jumbo-meal', 'Jumbo Meal', 36, 'chicken-bucket', '6 pcs chicken + Coleslaw (m), Fries (m) + 2 Buns + 2 Cola'],
    ['mini-family', 'Mini Family', 46, 'chicken-bucket', '9 pcs chicken + Coleslaw (m), Fries (m) + 4 Buns + 1.5 Liter Cola'],
    ['family-pack', 'Family Pack', 60, 'chicken-bucket', '12 pcs chicken + Coleslaw (L), Fries (L) + 6 Buns + 1.5 Liter Cola'],
    ['family-bucket', 'Family Bucket', 75, 'chicken-bucket', '15 pcs chicken + Coleslaw (L), Fries (L) + 8 Buns + Cola Large'],
    ['party-bucket', 'Party Bucket', 103, 'chicken-bucket', '24 pcs chicken + Coleslaw (L), Fries (L) + 10 Buns + 1 Cola Large'],
  ],
  'strip-bucket': [
    ['strips-bucket-meal', 'Strips Bucket Meal', 55, 'strip-bucket', '15 pcs strips + Coleslaw (m), Fries (m) + 4 Buns + 1.5 Cola'],
    ['value-strips-meal', 'Value Strips Meal', 39, 'strip-bucket', '10 pcs strips + Coleslaw (m), Fries (m) + 3 Buns + 2 Cola'],
    ['family-strips-bucket', 'Family Strips Bucket', 72, 'strip-bucket', '21 pcs strips + Coleslaw (L), Fries (L) + 6 Buns + Cola Large'],
  ],
  appetizerz: [
    ['chicago-fries', 'Chicago Fries', 20],
    ['dynamite-beef-fries', 'Dynamite Beef Fries', 20],
    ['dynamite-chicken', 'Dynamite Chicken', 20],
    ['mac-fries', 'Mac Fries', 20],
    ['cheese-fries', 'Cheese Fries', 15],
    ['cheetos-cheese-fries', 'Cheetos Cheese Fries', 18],
    ['mozzrella-cheetos', 'Mozzrella Cheetos', 15],
    ['cheesy-buffalo-wings', 'Cheesy Buffalo Wings', two(12, 20)],
    ['potato-wedges', 'Potato Wedges', two(8, 12)],
    ['dynamite-shrimp', 'Dynamite Shrimp', 25],
    ['onion-rings', 'Onion Rings', two(8, 12)],
    ['curly-fries', 'Curly Fries', two(8, 12)],
  ],
  pasta: [
    ['mac-n-cheese', 'Mac N Cheese', 25],
    ['alfredo-pasta', 'Alfredo Pasta', 25],
    ['signature-pasta', 'Signature Pasta', 25],
    ['cheeto-pasta', 'Cheeto Pasta', 29],
    ['alfredo-shrimp-pasta', 'Alfredo Shrimp Pasta', 29],
  ],
  mojito: [
    ['mojito-blackberry', 'Blackberry', 13],
    ['mojito-blueberry', 'Blueberry', 13],
    ['mojito-strawberry', 'Strawberry', 13],
    ['mojito-sky-blue', 'Sky Blue', 13],
    ['mojito-passion-fruit', 'Passion Fruit', 13],
    ['mojito-lemon', 'Lemon', 13],
  ],
  shakes: [
    ['pistachio-shake', 'Pistachio Shake', 14],
    ['passion-fruit-shake', 'Passion Fruit Shake', 14],
    ['purple-shake', 'Purple Shake', 14],
    ['blue-coconut-shake', 'Blue Coconut Shake', 14],
    ['caramel-shake', 'Caramel Shake', 14],
    ['mix-berry-shake', 'Mix Berry Shake', 14],
    ['lotus-shake', 'Lotus Shake', 14],
    ['blueberry-shake', 'Blueberry Shake', 14],
  ],
  smoothies: [
    ['mix-berry-smoothie', 'Mix Berry Smoothie', 14],
    ['blueberry-smoothie', 'Blueberry Smoothie', 14],
    ['mango-smoothie', 'Mango Smoothie', 14],
    ['passion-fruit-smoothie', 'Passion Fruit Smoothie', 14],
    ['strawberry-smoothie', 'Strawberry Smoothie', 14],
  ],
  lassi: [['mango-lassi', 'Mango Lassi', 14]],
  'add-on': [
    ['addon-cheetos', 'Cheetos', 3, null],
    ['addon-curly-fries', 'Curly Fries', 3, null],
    ['addon-potato-wedges', 'Potato Wedges', 3, null],
    ['addon-bacon', 'Bacon', 3, null],
    ['addon-turkey', 'Turkey', 3, null],
    ['addon-jalapeno', 'Jalapeno', 2, null],
    ['addon-mushroom', 'Mushroom', 3, null],
    ['addon-coleslaw', 'Coleslaw', two(3, 5), null],
    ['addon-brosted-bun', 'Brosted Bun', 2, null],
    ['addon-potato-bun', 'Potato Bun', 3, null],
    ['addon-toast-bread', 'Toast Bread', 3, null],
    ['addon-meal', 'Add On Meal', 8, null],
    ['addon-extra-patty-chicken', 'Extra Patty Chicken', 5, null],
    ['addon-extra-patty-beef', 'Extra Patty Beef', 5, null],
    ['addon-chicken-strips', 'Chicken Strips', 3, null],
    ['addon-broasted', 'Broasted', 6, null],
  ],
  'sauce-box': [
    ['sauce-dynamite', 'Dynamite Sauce', 3, null],
    ['sauce-runch', 'Runch Sauce', 3, null],
    ['sauce-spicy', 'Spicy Sauce', null, null],
    ['sauce-buffalo', 'Buffalo Sauce', null, null],
    ['sauce-bbq', 'B.B.Q Sauce', null, null],
    ['sauce-french', 'French Sauce', null, null],
    ['sauce-melted-chedder-cheese', 'Melted Chedder Cheese', two(3, 5), null],
  ],
};

function buildProduct(categoryId: string, [id, name, pricing, image, description]: Row): Product {
  const base = {
    id,
    name,
    categoryId,
    image: image === null ? undefined : `/images/menu/${image ?? id}.jpg`,
    description,
  };
  if (pricing === null) return { ...base, options: [], priceStatus: 'unconfirmed' };
  if (typeof pricing === 'number') {
    return { ...base, options: [{ id: 'regular', label: 'Regular', price: pricing }], priceStatus: 'confirmed' };
  }
  if (pricing.kind === 'meal') {
    return {
      ...base,
      options: [
        { id: 'single', label: 'Single', price: pricing.a },
        { id: 'meal', label: 'Meal', price: pricing.b },
      ],
      priceStatus: 'meal-inferred',
    };
  }
  return {
    ...base,
    options: [
      { id: 'option-1', label: 'Option 1', price: pricing.a },
      { id: 'option-2', label: 'Option 2', price: pricing.b },
    ],
    priceStatus: 'option-unclear',
  };
}

export const PRODUCTS: Product[] = CATEGORIES.flatMap((c) => (TABLE[c.id] ?? []).map((row) => buildProduct(c.id, row)));

const PRODUCT_INDEX = new Map(PRODUCTS.map((p) => [p.id, p]));
const CATEGORY_INDEX = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getProduct(id: string): Product | undefined {
  return PRODUCT_INDEX.get(id);
}

export function getCategory(id: string): Category | undefined {
  return CATEGORY_INDEX.get(id);
}

export function getOption(product: Product, optionId: string): PriceOption | undefined {
  return product.options.find((o) => o.id === optionId);
}

/** Exposed for data-integrity tests. */
export const __TABLE_CATEGORY_IDS = Object.keys(TABLE);

/** Name used in the cart and summary. Mojito flavours are printed under a "MOJITO" heading, so the heading is appended. */
export function fullName(product: Product): string {
  return product.categoryId === 'mojito' ? `${product.name} Mojito` : product.name;
}

/** Shown as an "unconfirmed" warning to customers. */
export function needsConfirmation(product: Product): boolean {
  return product.priceStatus === 'option-unclear' || product.priceStatus === 'unconfirmed';
}

/**
 * Products shown in the homepage "Menu highlights" strip. Edit freely — any product id works.
 * Only items with clearly printed prices and photos are used, and nothing here claims popularity.
 */
export const FEATURED_PRODUCT_IDS = [
  'three-star',
  'classic-zinger',
  'mac-n-zinger-toast',
  'crunchy-cheetos',
  'viral-combo',
  'mega-hollandise',
  'cheetos-cheese-fries',
  'pistachio-shake',
];

/** Order of the category groups in filters and navigation. */
export const GROUPS = ['burgers', 'sandwiches', 'meals', 'chicken', 'sides', 'drinks', 'extras'] as const;
