import { Languages } from 'lucide-react';
import { useI18n } from '../i18n/LanguageContext';

/** EN ⇄ عربي switch. Its label is always written in the language it switches *to*. */
export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { t, toggleLang, lang } = useI18n();
  return (
    <button
      type="button"
      onClick={toggleLang}
      lang={lang === 'ar' ? 'en' : 'ar'}
      aria-label={t('lang.toggleAria')}
      className={`btn btn-ghost min-h-11 gap-1.5 px-3 text-sm font-bold text-cream/90 hover:text-cheese ${className}`}
    >
      <Languages size={18} aria-hidden="true" />
      <span>{t('lang.toggle')}</span>
    </button>
  );
}
