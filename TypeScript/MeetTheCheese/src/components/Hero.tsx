import { ArrowDown, MapPin, ShoppingBag } from 'lucide-react';
import { useBranch } from '../context/BranchContext';
import { useCart } from '../context/CartContext';
import { useMenuFilter } from '../context/MenuFilterContext';
import { useI18n } from '../i18n/LanguageContext';

export default function Hero() {
  const { branch } = useBranch();
  const { openDrawer, count } = useCart();
  const { showMenu } = useMenuFilter();
  const { t, tn, lang } = useI18n();

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(244,122,32,0.22),transparent_55%)] rtl:bg-[radial-gradient(ellipse_at_30%_40%,rgba(244,122,32,0.22),transparent_55%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pt-6 pb-12 sm:px-6 sm:pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-14 lg:pb-16">
        <div className="order-2 lg:order-1">
          {branch && (
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-2/80 px-3.5 py-1.5 text-sm text-muted">
              <MapPin size={15} className="text-cheese" aria-hidden="true" />
              <span>{tn('hero.browsing', { branch: <strong className="text-cream">{branch.label[lang]}</strong> })}</span>
            </p>
          )}
          <h1
            id="hero-title"
            className="font-display mt-5 text-[2.5rem] leading-[1.04] tracking-wide uppercase min-[400px]:text-5xl sm:text-6xl xl:text-7xl"
          >
            <span className="block text-cream">{t('hero.line1')}</span>
            <span className="text-gradient-cheese block">{t('hero.line2')}</span>
            <span className="block text-cream">{t('hero.line3')}</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted">{t('hero.sub')}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary min-h-12 px-7 text-base" onClick={() => showMenu('all')}>
              {t('hero.explore')} <ArrowDown size={18} aria-hidden="true" />
            </button>
            <button type="button" className="btn btn-secondary min-h-12 px-6 text-base" onClick={openDrawer}>
              <ShoppingBag size={18} aria-hidden="true" /> {t('hero.viewCart')}
              {count > 0 && <span className="rounded-full bg-cheese px-2 py-0.5 text-xs text-ink tabular-nums">{count}</span>}
            </button>
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="frame relative overflow-hidden border-[3px] shadow-2xl shadow-flame/20">
            <img
              src="/images/brand/hero-burger.jpg"
              alt={t('hero.imageAlt')}
              width={897}
              height={609}
              className="aspect-[4/3] h-full w-full object-cover sm:aspect-[3/2]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" aria-hidden="true" />
          </div>
          <img
            src="/images/brand/logo-480.png"
            alt=""
            aria-hidden="true"
            width={480}
            height={457}
            className="absolute -start-2 -bottom-5 h-20 w-auto -rotate-6 drop-shadow-[0_6px_14px_rgba(0,0,0,0.7)] sm:-start-6 sm:-bottom-8 sm:h-28"
          />
        </div>
      </div>
    </section>
  );
}
