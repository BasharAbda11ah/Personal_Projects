import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { navigate } from '../hooks/useHashRoute';
import { useI18n } from '../i18n/LanguageContext';
import { removeKey, STORAGE_KEYS } from '../utils/storage';

export default function PrivacyPage() {
  const { t } = useI18n();
  const [cleared, setCleared] = useState(false);

  const clearData = () => {
    Object.values(STORAGE_KEYS).forEach(removeKey);
    setCleared(true);
    // Reload so the app starts fresh (branch picker, empty cart, default language).
    window.setTimeout(() => {
      window.location.hash = '/';
      window.location.reload();
    }, 1200);
  };

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <button type="button" onClick={() => navigate('/')} className="btn btn-ghost -ms-3">
        <ArrowLeft size={18} className="rtl:-scale-x-100" aria-hidden="true" /> {t('nf.back')}
      </button>
      <h1 className="font-display mt-4 flex items-center gap-3 text-3xl text-cream sm:text-4xl">
        <ShieldCheck size={32} className="shrink-0 text-cheese" aria-hidden="true" /> {t('privacy.title')}
      </h1>
      <div className="mt-6 space-y-4 leading-relaxed text-cream/85">
        <p>{t('privacy.p1')}</p>
        <p>{t('privacy.p2')}</p>
        <p>{t('privacy.p3')}</p>
        <p>{t('privacy.p4')}</p>
      </div>
      <div className="mt-8">
        <button type="button" onClick={clearData} disabled={cleared} className="btn btn-secondary">
          {t('privacy.clear')}
        </button>
        {cleared && (
          <p role="status" className="mt-3 text-sm text-success">
            {t('privacy.cleared')}
          </p>
        )}
      </div>
    </article>
  );
}
