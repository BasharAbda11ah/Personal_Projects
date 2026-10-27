import { ArrowRight } from 'lucide-react';
import { FEATURED_PRODUCT_IDS, getProduct } from '../data/menu';
import { useMenuFilter } from '../context/MenuFilterContext';
import { useI18n } from '../i18n/LanguageContext';
import type { Product } from '../types';
import ProductCard from './ProductCard';

const FEATURED: Product[] = FEATURED_PRODUCT_IDS.map(getProduct).filter((p): p is Product => Boolean(p));

/** "Menu highlights": a handful of real menu items (edit FEATURED_PRODUCT_IDS in data/menu.ts). */
export default function FeaturedMenu() {
  const { showMenu } = useMenuFilter();
  const { t } = useI18n();
  if (FEATURED.length === 0) return null;

  return (
    <section aria-labelledby="featured-title" className="border-y border-white/5 bg-ink-2/40 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-flame uppercase">{t('featured.eyebrow')}</p>
            <h2 id="featured-title" className="font-display mt-1 text-2xl text-cream sm:text-3xl">
              {t('featured.title')}
            </h2>
          </div>
          <button type="button" onClick={() => showMenu('all')} className="btn btn-secondary btn-sm">
            {t('featured.seeAll')} <ArrowRight size={16} className="rtl:-scale-x-100" aria-hidden="true" />
          </button>
        </div>
        {/* Swipeable row on phones, grid on large screens. */}
        <ul className="scrollbar-none relative -mx-4 grid snap-x auto-cols-[minmax(168px,46%)] grid-flow-col gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:auto-cols-[minmax(220px,31%)] sm:px-0 lg:grid-flow-row lg:grid-cols-4 lg:gap-5 lg:overflow-visible">
          {FEATURED.map((p) => (
            <li key={p.id} className="snap-start">
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
