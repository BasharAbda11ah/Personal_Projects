import { useEffect, useRef, useState } from 'react';
import { MapPin, Menu as MenuIcon, ShoppingBag, X } from 'lucide-react';
import { useBranch } from '../context/BranchContext';
import { useCart } from '../context/CartContext';
import { useMenuFilter, type GroupFilter } from '../context/MenuFilterContext';
import { navigate } from '../hooks/useHashRoute';
import { useI18n } from '../i18n/LanguageContext';
import type { MessageKey } from '../i18n/en';
import { useCssVarHeight } from '../hooks/useCssVarHeight';
import { scrollBehavior } from '../utils/motion';
import LanguageToggle from './LanguageToggle';
import Logo from './Logo';

interface NavItem {
  label: MessageKey;
  action: 'home' | 'branches' | GroupFilter;
}

const NAV: NavItem[] = [
  { label: 'nav.home', action: 'home' },
  { label: 'nav.menu', action: 'all' },
  { label: 'nav.burgers', action: 'burgers' },
  { label: 'nav.sandwiches', action: 'sandwiches' },
  { label: 'nav.drinks', action: 'drinks' },
  { label: 'nav.branches', action: 'branches' },
];

export default function Header() {
  const { branch, openPicker } = useBranch();
  const { count, openDrawer } = useCart();
  const { showMenu, showSection } = useMenuFilter();
  const { t, tn, lang, items } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);
  const headerRef = useRef<HTMLElement>(null);
  // Sticky menu bar, scroll targets and the summary sidebar all read this live height.
  useCssVarHeight(headerRef, '--header-h');

  // Little "pop" on the cart badge when the count goes up.
  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const timer = window.setTimeout(() => setBump(false), 300);
      prevCount.current = count;
      return () => window.clearTimeout(timer);
    }
    prevCount.current = count;
  }, [count]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [mobileOpen]);

  const go = (item: NavItem) => {
    setMobileOpen(false);
    if (item.action === 'home') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: scrollBehavior() });
    } else if (item.action === 'branches') {
      showSection('branches');
    } else {
      showMenu(item.action);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/90 backdrop-blur-md" ref={headerRef}>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6">
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            go(NAV[0]);
          }}
          className="shrink-0 rounded-lg"
          aria-label={t('header.homeAria')}
        >
          <Logo className="h-11 w-auto sm:h-12" decorative />
        </a>

        <nav aria-label={t('nav.main')} className="ms-3 hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {NAV.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => go(item)}
                  className="rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap text-cream/85 transition hover:bg-white/5 hover:text-cheese"
                >
                  {t(item.label)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1.5 sm:gap-2">
          {branch && (
            <div className="hidden items-center gap-1 rounded-full border border-line bg-ink-2/80 py-1 ps-3 pe-1 md:flex">
              <MapPin size={15} className="text-cheese" aria-hidden="true" />
              <span className="text-sm whitespace-nowrap">
                <span className="sr-only">{t('header.selectedBranch')} </span>
                <span className="font-semibold text-cream">{branch.shortName[lang]}</span>
              </span>
              <button type="button" onClick={openPicker} className="btn btn-sm ms-1 min-h-8 px-3 whitespace-nowrap text-cheese hover:bg-white/5">
                {t('header.changeBranch')}
              </button>
            </div>
          )}

          <LanguageToggle className="hidden sm:inline-flex" />

          <button
            type="button"
            onClick={openDrawer}
            className="btn btn-secondary relative min-h-11 px-3.5"
            aria-label={t('header.openCart', { items: items(count) })}
          >
            <ShoppingBag size={20} aria-hidden="true" />
            <span className="hidden sm:inline">{t('header.cart')}</span>
            <span
              className={`absolute -top-1.5 -end-1.5 flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold tabular-nums ${
                count > 0 ? 'bg-gradient-cheese text-ink' : 'bg-ink-3 text-muted'
              } ${bump ? 'animate-pop' : ''}`}
              aria-hidden="true"
            >
              {count > 99 ? '99+' : count}
            </span>
          </button>

          <button
            type="button"
            className="btn btn-ghost min-h-11 px-2.5 xl:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={24} aria-hidden="true" /> : <MenuIcon size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Branch strip on small screens so the selected branch is always visible. */}
      {branch && (
        <div className="flex h-[34px] items-center justify-between gap-2 border-t border-white/5 px-4 text-sm md:hidden">
          <span className="flex min-w-0 items-center gap-1.5">
            <MapPin size={14} className="shrink-0 text-cheese" aria-hidden="true" />
            <span className="truncate">
              {tn('header.orderingFrom', { branch: <strong className="text-cream">{branch.shortName[lang]}</strong> })}
            </span>
          </span>
          <button type="button" onClick={openPicker} className="shrink-0 rounded-full px-2 py-1 font-semibold text-cheese">
            {t('header.changeBranch')}
          </button>
        </div>
      )}

      {mobileOpen && (
        <nav id="mobile-nav" aria-label={t('nav.main')} className="animate-fade-in border-t border-white/5 bg-ink-2 xl:hidden">
          <ul className="mx-auto grid max-w-7xl gap-0.5 px-2 py-2 sm:grid-cols-2">
            {NAV.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => go(item)}
                  className="flex w-full items-center rounded-xl px-4 py-3.5 text-start text-base font-semibold text-cream hover:bg-white/5 hover:text-cheese"
                >
                  {t(item.label)}
                </button>
              </li>
            ))}
            <li className="border-t border-white/5 pt-1 sm:hidden">
              <LanguageToggle className="w-full justify-start px-4" />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
