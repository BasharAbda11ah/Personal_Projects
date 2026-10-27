import { Clock, MapPin } from 'lucide-react';
import { BRAND_NAME } from '../data/branches';
import { useI18n } from '../i18n/LanguageContext';
import type { Branch } from '../types';
import OpeningHours from './OpeningHours';
import ContactButtons from './ContactButtons';

interface BranchInfoProps {
  branch: Branch;
  heading: string;
  onChange?: () => void;
}

/** Selected branch details: address, opening hours (only if supplied) and contact links. */
export default function BranchInfo({ branch, heading, onChange }: BranchInfoProps) {
  const { t, lang } = useI18n();
  return (
    <div className="frame bg-ink-2/90 p-5 shadow-xl shadow-black/30 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-flame uppercase">{heading}</p>
          <h2 className="font-display mt-1 text-xl leading-tight text-cheese">
            <span lang="en">{BRAND_NAME}</span> — {branch.label[lang]}
          </h2>
        </div>
        {onChange && (
          <button type="button" onClick={onChange} className="btn btn-secondary btn-sm">
            {t('header.changeBranch')}
          </button>
        )}
      </div>
      <dl className="mt-4 grid gap-3 text-sm">
        <div className="flex gap-2.5">
          <dt className="mt-0.5 shrink-0 text-cheese">
            <MapPin size={16} aria-label={t('branch.location')} />
          </dt>
          <dd className="text-cream/90">{branch.address[lang]}</dd>
        </div>
        <div className="flex gap-2.5">
          <dt className="mt-0.5 shrink-0 text-cheese">
            <Clock size={16} aria-label={t('branch.hours')} />
          </dt>
          <dd>
            <OpeningHours hours={branch.openingHours} />
          </dd>
        </div>
      </dl>
      <div className="mt-5 border-t border-white/5 pt-5">
        <ContactButtons branch={branch} compact />
      </div>
    </div>
  );
}
