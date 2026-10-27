import { Eye } from 'lucide-react';
import { useI18n } from '../i18n/LanguageContext';

/** Shown only in demo builds (npm run build:demo) so a shared preview link is never mistaken for the official site. */
export const IS_DEMO = import.meta.env.MODE === 'demo';

export default function DemoBanner() {
  const { t } = useI18n();
  if (!IS_DEMO) return null;
  return (
    <div role="note" className="bg-gradient-cheese px-4 py-1.5 text-center text-xs font-semibold text-ink sm:text-sm">
      <Eye size={14} className="me-1.5 inline-block align-[-2px]" aria-hidden="true" />
      {t('demo.banner')} <span className="font-normal">{t('demo.whatsapp')}</span>
    </div>
  );
}
