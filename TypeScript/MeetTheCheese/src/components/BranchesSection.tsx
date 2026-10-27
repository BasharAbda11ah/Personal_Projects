import { Check, Clock, MapPin } from 'lucide-react';
import { BRANCHES, BRAND_NAME } from '../data/branches';
import { useBranch } from '../context/BranchContext';
import { useI18n } from '../i18n/LanguageContext';
import { useRequestBranch } from '../hooks/useRequestBranch';
import OpeningHours from './OpeningHours';
import ContactButtons from './ContactButtons';

/** All three branches with verified addresses and working Call / WhatsApp links. */
export default function BranchesSection() {
  const { branch: selected } = useBranch();
  const requestBranch = useRequestBranch();
  const { t, lang } = useI18n();

  return (
    <section id="branches" aria-labelledby="branches-title" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.25em] text-flame uppercase">{t('branches.eyebrow')}</p>
          <h2 id="branches-title" className="font-display mt-1 text-3xl text-cream sm:text-4xl">
            {t('branches.title')}
          </h2>
          <p className="mt-3 text-muted">{t('branches.sub')}</p>
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {BRANCHES.map((b) => {
            const isSelected = b.id === selected?.id;
            return (
              <li
                key={b.id}
                className={`frame flex flex-col bg-ink-2/90 p-5 shadow-xl shadow-black/30 sm:p-6 ${isSelected ? 'border-cheese' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] text-flame uppercase" lang="en">
                      {BRAND_NAME}
                    </p>
                    <h3 className="font-display mt-1 text-2xl leading-tight text-cheese">{b.label[lang]}</h3>
                  </div>
                  {isSelected && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-cheese px-2.5 py-1 text-xs font-bold text-ink">
                      <Check size={14} aria-hidden="true" /> {t('branches.yours')}
                    </span>
                  )}
                </div>
                <dl className="mt-4 space-y-2.5 text-sm">
                  <div className="flex gap-2.5">
                    <dt className="mt-0.5 shrink-0 text-cheese">
                      <MapPin size={16} aria-label={t('branch.location')} />
                    </dt>
                    <dd className="text-cream/90">{b.address[lang]}</dd>
                  </div>
                  <div className="flex gap-2.5">
                    <dt className="mt-0.5 shrink-0 text-cheese">
                      <Clock size={16} aria-label={t('branch.hours')} />
                    </dt>
                    <dd>
                      <OpeningHours hours={b.openingHours} />
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 flex-1 border-t border-white/5 pt-5">
                  <ContactButtons branch={b} compact />
                </div>
                {!isSelected && (
                  <button
                    type="button"
                    className="btn btn-primary mt-5 w-full"
                    onClick={() => requestBranch(b.id)}
                  >
                    {t('branches.orderHere')}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
