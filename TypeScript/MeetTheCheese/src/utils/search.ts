import { fullName } from '../data/menu';
import type { Product } from '../types';

/**
 * Lower-case, strip accents/punctuation and unify common Arabic letter variants, so
 * "mac n cheese", "Mac-N-Cheese", "B.B.Q" and "برجر"/"البرجر" match naturally.
 */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ًͯ-ْ]/g, '')
    .toLowerCase()
    .replace(/[إأآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/**
 * Every word of the query must appear in the product name (as printed) or in the
 * category label passed in `extra` (e.g. the Arabic category name).
 */
export function matchesQuery(product: Product, query: string, extra = ''): boolean {
  const q = normalize(query);
  if (!q) return true;
  const haystack = normalize(`${product.name} ${fullName(product)} ${extra}`);
  const compact = haystack.replace(/ /g, '');
  return q.split(' ').every((word) => {
    const bare = word.startsWith('ال') && word.length > 3 ? word.slice(2) : word;
    return haystack.includes(word) || compact.includes(word) || haystack.includes(bare);
  });
}
