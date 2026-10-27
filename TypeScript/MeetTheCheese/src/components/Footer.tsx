import { BRANCHES } from '../data/branches';
import { useCart } from '../context/CartContext';
import { useMenuFilter } from '../context/MenuFilterContext';
import { navigate } from '../hooks/useHashRoute';
import { useI18n } from '../i18n/LanguageContext';
import type { MessageKey } from '../i18n/en';
import { telHref, whatsappHref } from '../utils/contact';
import Logo from './Logo';
import OpeningHours from './OpeningHours';
import Phone from './Phone';

export default function Footer() {
  const { t, lang } = useI18n();
  const { showMenu, showSection } = useMenuFilter();
  const { count } = useCart();

  const links: { label: MessageKey; onClick: () => void }[] = [
    { label: 'nav.home', onClick: () => (navigate('/'), window.scrollTo({ top: 0 })) },
    { label: 'nav.menu', onClick: () => showMenu('all') },
    { label: 'nav.burgers', onClick: () => showMenu('burgers') },
    { label: 'nav.drinks', onClick: () => showMenu('drinks') },
    { label: 'nav.branches', onClick: () => showSection('branches') },
    ...(count > 0 ? [{ label: 'footer.summary' as MessageKey, onClick: () => navigate('/summary') }] : []),
    { label: 'footer.privacy', onClick: () => navigate('/privacy') },
  ];

  return (
    <footer className="mt-8 border-t border-white/5 bg-ink/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,2fr)]">
        <div className="max-w-xs">
          <Logo className="h-24 w-auto" />
          <p className="mt-4 text-sm text-muted">{t('footer.tagline')}</p>
        </div>

        <nav aria-label={t('footer.explore')}>
          <h2 className="font-display text-lg text-cheese">{t('footer.explore')}</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm lg:grid-cols-1">
            {links.map((l) => (
              <li key={l.label}>
                <button type="button" onClick={l.onClick} className="min-h-9 text-start text-cream/80 hover:text-cheese hover:underline">
                  {t(l.label)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid gap-8 sm:grid-cols-3">
          {BRANCHES.map((b) => (
            <div key={b.id}>
              <h2 className="font-display text-lg text-cheese">{b.shortName[lang]}</h2>
              <p className="mt-2 text-sm text-cream/80">{b.address[lang]}</p>
              <OpeningHours hours={b.openingHours} className="mt-2 text-sm" />
              <ul className="mt-2 space-y-1 text-sm">
                {b.phones.map((p) => {
                  const tel = telHref(p);
                  const wa = whatsappHref(p);
                  return (
                    <li key={p.display}>
                      {tel && (
                        <span className="flex flex-wrap items-center gap-x-2">
                          <a href={tel} className="text-cream/90 underline-offset-4 hover:text-cheese hover:underline">
                            <Phone>{p.display}</Phone>
                          </a>
                          {wa && (
                            <a
                              href={wa}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-cheese underline-offset-4 hover:underline"
                              aria-label={t('phone.whatsappAria', { number: p.display })}
                            >
                              {t('phone.whatsapp')}
                            </a>
                          )}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 text-xs text-muted sm:px-6 md:flex-row md:justify-between">
          <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
          <p>{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}
