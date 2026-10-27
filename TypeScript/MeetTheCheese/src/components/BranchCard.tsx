import { Check, Clock, MapPin, Phone as PhoneIcon } from 'lucide-react';
import { BRAND_NAME } from '../data/branches';
import { useI18n } from '../i18n/LanguageContext';
import type { Branch } from '../types';
import OpeningHours from './OpeningHours';
import Phone from './Phone';

interface BranchCardProps {
  branch: Branch;
  selected: boolean;
  onChoose: () => void;
}

/** Branch card used in the full-screen branch picker. */
export default function BranchCard({ branch, selected, onChoose }: BranchCardProps) {
  const { t, lang } = useI18n();
  return (
    <article
      className={`frame relative flex flex-col bg-ink-2/90 p-5 shadow-xl shadow-black/40 transition duration-200 hover:-translate-y-0.5 hover:bg-ink-3/90 sm:p-6 ${
        selected ? 'ring-2 ring-cheese ring-offset-2 ring-offset-ink' : ''
      }`}
    >
      {selected && (
        <span className="absolute -top-3 end-5 inline-flex items-center gap-1 rounded-full bg-cheese px-2.5 py-1 text-xs font-bold text-ink">
          <Check size={14} aria-hidden="true" /> {t('picker.current')}
        </span>
      )}
      <p className="text-xs font-bold tracking-[0.2em] text-flame uppercase" lang="en">
        {BRAND_NAME}
      </p>
      <h2 className="font-display mt-1 text-2xl leading-tight text-cheese">{branch.label[lang]}</h2>

      <dl className="mt-4 flex-1 space-y-3 text-sm">
        <div className="flex gap-2.5">
          <dt className="mt-0.5 shrink-0 text-cheese">
            <MapPin size={16} aria-label={t('branch.location')} />
          </dt>
          <dd className="text-cream/90">{branch.address[lang]}</dd>
        </div>
        <div className="flex gap-2.5">
          <dt className="mt-0.5 shrink-0 text-cheese">
            <PhoneIcon size={16} aria-label={t('branch.contact')} />
          </dt>
          <dd className="space-y-1">
            {branch.phones.map((p) => (
              <div key={p.display}>
                <Phone className="font-semibold text-cream">{p.display}</Phone>
                <span className="block text-xs text-muted">{t(`phone.${p.label}`)}</span>
              </div>
            ))}
          </dd>
        </div>
        {branch.openingHours && (
          <div className="flex gap-2.5">
            <dt className="mt-0.5 shrink-0 text-cheese">
              <Clock size={16} aria-label={t('branch.hours')} />
            </dt>
            <dd>
              <OpeningHours hours={branch.openingHours} />
            </dd>
          </div>
        )}
      </dl>

      <button type="button" onClick={onChoose} className="btn btn-primary mt-5 w-full">
        {selected ? t('picker.continue') : t('picker.choose')}
      </button>
    </article>
  );
}
