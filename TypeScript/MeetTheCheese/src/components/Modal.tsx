import { useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useModalBehavior } from '../hooks/useModalBehavior';
import { useI18n } from '../i18n/LanguageContext';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

/** Accessible centred dialog (focus trap, Escape, backdrop click). */
export default function Modal({ open, onClose, title, children, footer, wide }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const bodyId = useId();
  const { t } = useI18n();
  useModalBehavior(open, ref, onClose);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-4">
      <div className="animate-fade-in absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        data-modal-root
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
        className={`animate-toast-in relative max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto rounded-3xl border border-line bg-ink-2 p-6 shadow-2xl shadow-black/60 outline-none ${
          wide ? 'max-w-lg' : 'max-w-md'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-xl leading-tight text-cheese">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="btn btn-ghost -me-3 -mt-2 min-h-10 px-2.5" aria-label={t('modal.close')}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div id={bodyId} className="mt-3 text-[0.95rem] leading-relaxed text-muted">
          {children}
        </div>
        {footer && <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  );
}
