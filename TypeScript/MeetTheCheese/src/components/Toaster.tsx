import { CheckCircle2, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useI18n } from '../i18n/LanguageContext';

export default function Toaster() {
  const { toasts, dismiss } = useToast();
  const { t } = useI18n();

  return (
    <div
      data-toast-region
      role="region"
      aria-label={t('toast.region')}
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-center gap-2 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-end sm:p-6"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-toast-in pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-line bg-ink-3/95 py-3 ps-4 pe-2 shadow-xl shadow-black/50 backdrop-blur"
        >
          {toast.tone === 'success' ? (
            <CheckCircle2 size={20} className="shrink-0 text-success" aria-hidden="true" />
          ) : (
            <Info size={20} className="shrink-0 text-cheese" aria-hidden="true" />
          )}
          <p className="min-w-0 flex-1 text-sm text-cream">{toast.message}</p>
          {toast.action && (
            <button
              type="button"
              className="btn btn-sm shrink-0 px-3 text-cheese hover:bg-white/5"
              onClick={() => {
                toast.action!.onClick();
                dismiss(toast.id);
              }}
            >
              {toast.action.label}
            </button>
          )}
          <button
            type="button"
            className="btn btn-ghost min-h-9 shrink-0 px-2"
            onClick={() => dismiss(toast.id)}
            aria-label={t('toast.dismiss')}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
