import { ArrowLeft } from 'lucide-react';
import { navigate } from '../hooks/useHashRoute';
import { useI18n } from '../i18n/LanguageContext';
import Logo from '../components/Logo';

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <Logo className="h-24 w-auto opacity-90" decorative />
      <p className="font-display text-gradient-cheese mt-4 text-8xl">404</p>
      <h1 className="font-display mt-4 text-3xl text-cream">{t('nf.title')}</h1>
      <p className="mt-3 text-muted">{t('nf.body')}</p>
      <button type="button" className="btn btn-primary mt-8" onClick={() => navigate('/')}>
        <ArrowLeft size={18} className="rtl:-scale-x-100" aria-hidden="true" /> {t('nf.back')}
      </button>
    </div>
  );
}
