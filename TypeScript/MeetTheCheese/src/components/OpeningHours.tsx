import { Fragment } from 'react';
import { useI18n } from '../i18n/LanguageContext';
import type { HoursRow } from '../types';

/** "Sat – Thu  12:00 PM – 1:00 AM" / "Friday  3:00 PM – 1:00 AM", or a note when hours weren't supplied. */
export default function OpeningHours({ hours, className = '' }: { hours?: HoursRow[]; className?: string }) {
  const { t, lang } = useI18n();
  if (!hours?.length) return <span className={`text-muted ${className}`}>{t('branch.hoursMissing')}</span>;
  return (
    <dl className={`grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 ${className}`}>
      {hours.map((row) => (
        <Fragment key={row.days.en}>
          <dt className="font-semibold whitespace-nowrap text-cream">{row.days[lang]}</dt>
          <dd className="tabular-nums text-cream/90">
            <bdi>{row.time[lang]}</bdi>
          </dd>
        </Fragment>
      ))}
    </dl>
  );
}
