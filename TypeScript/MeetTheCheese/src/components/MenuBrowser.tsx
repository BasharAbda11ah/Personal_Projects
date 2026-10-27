import { useMemo, useRef } from 'react';
import { Search, SearchX, X } from 'lucide-react';
import { CATEGORIES, GROUPS, PRODUCTS } from '../data/menu';
import { useMenuFilter, type GroupFilter } from '../context/MenuFilterContext';
import { useI18n } from '../i18n/LanguageContext';
import type { MessageKey } from '../i18n/en';
import type { CategoryGroup } from '../types';
import { matchesQuery } from '../utils/search';
import { scrollToElement } from '../utils/motion';
import { useCssVarHeight } from '../hooks/useCssVarHeight';
import CompactProductRow from './CompactProductRow';
import ProductCard from './ProductCard';
import SectionBanner from './SectionBanner';

const LIST_STYLE_GROUPS: CategoryGroup[] = ['extras'];

export default function MenuBrowser() {
  const { group, setGroup, query, setQuery } = useMenuFilter();
  const { t, items, lang } = useI18n();
  const searchRef = useRef<HTMLInputElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  useCssVarHeight(toolbarRef, '--toolbar-h');
  const catLabel = (id: string) => t(`cat.${id}` as MessageKey);

  const sections = useMemo(
    () =>
      CATEGORIES.filter((c) => group === 'all' || c.group === group)
        .map((category) => {
          // Search also matches the category name in both languages ("shake", "برجر").
          const extra = `${category.name} ${t(`cat.${category.id}` as MessageKey)} ${t(`group.${category.group}`)}`;
          return {
            category,
            products: PRODUCTS.filter((p) => p.categoryId === category.id && matchesQuery(p, query, extra)),
          };
        })
        .filter((s) => s.products.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [group, query, lang],
  );
  const resultCount = sections.reduce((n, s) => n + s.products.length, 0);

  const selectGroup = (g: GroupFilter) => {
    setGroup(g);
    scrollToElement('menu');
  };

  const chip = (value: GroupFilter, label: string) => {
    const active = group === value;
    return (
      <button
        key={value}
        type="button"
        aria-pressed={active}
        onClick={() => selectGroup(value)}
        className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-bold whitespace-nowrap transition ${
          active
            ? 'bg-gradient-cheese border-transparent text-ink shadow-md shadow-flame/30'
            : 'border-line bg-ink-2/80 text-cream/85 hover:border-cheese/60 hover:text-cheese'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <section id="menu" aria-labelledby="menu-title" className="pt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-flame uppercase">{t('menu.eyebrow')}</p>
            <h2 id="menu-title" className="font-display mt-1 text-3xl text-cream sm:text-4xl">
              {t('menu.titleA')} <span className="text-gradient-cheese">{t('menu.titleB')}</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted">{t('menu.note')}</p>
        </div>
      </div>

      {/* Sticky toolbar: categories + search */}
      <div ref={toolbarRef} className="sticky top-(--header-h) z-30 mt-6 border-y border-white/5 bg-ink/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center">
          <nav aria-label={t('menu.categoriesAria')} className="-mx-4 min-w-0 flex-1 sm:-mx-6 lg:mx-0">
            <div className="scrollbar-none relative flex gap-2 overflow-x-auto px-4 sm:px-6 lg:px-0">
              {chip('all', t('menu.all'))}
              {GROUPS.map((g) => chip(g, t(`group.${g}`)))}
            </div>
          </nav>
          <div className="relative lg:w-72">
            <label htmlFor="menu-search" className="sr-only">
              {t('menu.searchLabel')}
            </label>
            <Search size={18} className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              ref={searchRef}
              id="menu-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('menu.searchPlaceholder')}
              autoComplete="off"
              enterKeyHint="search"
              className="h-11 w-full rounded-full border border-line bg-ink-2 ps-10 pe-10 text-[16px] text-cream placeholder:text-muted/70 focus:border-cheese focus:outline-none sm:text-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  searchRef.current?.focus();
                }}
                className="absolute end-1.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted hover:text-cream"
                aria-label={t('menu.clearSearch')}
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 pb-4 sm:px-6">
        <p className="sr-only" aria-live="polite">
          {query ? t('menu.results', { items: items(resultCount), query }) : ''}
        </p>

        {group !== 'all' && sections.length > 1 && !query && (
          <div className="mb-8 flex flex-wrap gap-2 text-sm">
            <span className="py-1 text-muted">{t('menu.jumpTo')}</span>
            {sections.map(({ category }) => (
              <a
                key={category.id}
                href={`#cat-${category.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToElement(`cat-${category.id}`);
                }}
                className="rounded-full px-3 py-1 font-semibold text-cheese underline-offset-4 hover:underline"
              >
                {catLabel(category.id)}
              </a>
            ))}
          </div>
        )}

        {sections.length === 0 ? (
          <div className="frame mx-auto flex max-w-lg flex-col items-center bg-ink-2 px-6 py-12 text-center">
            <SearchX size={40} className="text-cheese" aria-hidden="true" />
            <h3 className="font-display mt-4 text-xl text-cream">{t('menu.emptyTitle')}</h3>
            <p className="mt-2 text-muted">
              {group === 'all' ? t('menu.emptyBody', { query }) : t('menu.emptyBodyIn', { query, group: t(`group.${group}`) })}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" className="btn btn-primary" onClick={() => setQuery('')}>
                {t('menu.clearSearch')}
              </button>
              {group !== 'all' && (
                <button type="button" className="btn btn-secondary" onClick={() => setGroup('all')}>
                  {t('menu.searchAll')}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-14">
            {sections.map(({ category, products }, sectionIndex) => (
              <section key={category.id} aria-labelledby={`cat-${category.id}`}>
                <SectionBanner id={`cat-${category.id}`} title={catLabel(category.id)} count={products.length} />
                {LIST_STYLE_GROUPS.includes(category.group) ? (
                  <ul className="frame mt-6 bg-ink-2/80 px-4 sm:px-6">
                    {products.map((p) => (
                      <CompactProductRow key={p.id} product={p} />
                    ))}
                  </ul>
                ) : (
                  <div className="mt-6 grid grid-cols-1 gap-3 min-[350px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((p, i) => (
                      <ProductCard key={p.id} product={p} showCategory={false} eager={sectionIndex === 0 && i < 4} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
