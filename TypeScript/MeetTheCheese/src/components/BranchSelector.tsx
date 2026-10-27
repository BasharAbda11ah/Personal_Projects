import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { BRANCHES, BRAND_NAME, getBranch } from '../data/branches';
import { useBranch } from '../context/BranchContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useModalBehavior } from '../hooks/useModalBehavior';
import { useI18n } from '../i18n/LanguageContext';
import { useRequestBranch } from '../hooks/useRequestBranch';
import { hasLinkParams, stripLinkParams } from '../utils/branchLink';
import BranchCard from './BranchCard';
import ConfirmDialog from './ConfirmDialog';
import LanguageToggle from './LanguageToggle';
import Logo from './Logo';

/** Full-screen branch picker: shown on first visit, from every "Change Branch" control, and for QR links that need confirming. */
export default function BranchSelector() {
  const { branch, setBranchId, pickerOpen, closePicker, pendingBranchId, setPendingBranchId, linkStatus, linkedBranchId } =
    useBranch();
  const { count, cartBranchId, clear } = useCart();
  const { notify } = useToast();
  const { t, tn, lang, items } = useI18n();
  const requestBranch = useRequestBranch();
  const ref = useRef<HTMLDivElement>(null);
  const announced = useRef(false);
  const canDismiss = Boolean(branch);

  useModalBehavior(pickerOpen, ref, canDismiss ? closePicker : undefined);

  // One-time notice for ?branch= links (QR codes), then tidy the address bar.
  useEffect(() => {
    if (announced.current) return;
    announced.current = true;
    const linked = getBranch(linkedBranchId);
    if (linkStatus === 'applied' && linked) notify(t('toast.qrBranch', { branch: linked.label[lang] }), { tone: 'info' });
    if (linkStatus === 'invalid') notify(t('toast.badBranchLink'), { tone: 'info' });
    // Strip both ?branch= and ?lang= (even a lang-only link) so a later refresh keeps the visitor's own choices.
    if (hasLinkParams(window.location.search, window.location.hash)) stripLinkParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!pickerOpen) return null;

  const oldBranch = getBranch(cartBranchId);
  const newBranch = getBranch(pendingBranchId);

  return (
    <div
      ref={ref}
      data-modal-root
      role="dialog"
      aria-modal="true"
      aria-labelledby="branch-picker-title"
      tabIndex={-1}
      className="bg-brick animate-fade-in fixed inset-0 z-[70] overflow-y-auto outline-none"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,122,32,0.18),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="fixed top-3 end-3 z-10 flex items-center gap-1 rounded-full bg-ink/70 backdrop-blur">
        <LanguageToggle />
        {canDismiss && (
          <button
            type="button"
            onClick={closePicker}
            className="btn btn-ghost"
            aria-label={t('picker.closeAria', { branch: branch!.label[lang] })}
          >
            <X size={20} aria-hidden="true" />
            <span className="hidden sm:inline">{t('picker.keep', { branch: branch!.shortName[lang] })}</span>
          </button>
        )}
      </div>

      <div className="relative mx-auto flex min-h-full max-w-6xl flex-col items-center px-4 pt-16 pb-10 sm:px-6 sm:pt-14">
        <Logo className="h-28 w-auto drop-shadow-[0_8px_24px_rgba(244,122,32,0.35)] sm:h-36" />
        <h1 id="branch-picker-title" className="font-display mt-6 text-center text-3xl leading-tight sm:text-5xl">
          {tn('picker.welcome', {
            brand: (
              <span className="text-gradient-cheese" lang="en">
                {BRAND_NAME}
              </span>
            ),
          })}
        </h1>
        <p className="mt-3 max-w-xl text-center text-base text-muted sm:text-lg">{t('picker.subtitle')}</p>

        <div className="mt-10 grid w-full gap-6 md:grid-cols-3">
          {BRANCHES.map((b) => (
            <BranchCard key={b.id} branch={b} selected={b.id === branch?.id} onChoose={() => requestBranch(b.id)} />
          ))}
        </div>

        <p className="mt-8 max-w-xl text-center text-xs text-muted">{t('picker.saved')}</p>
      </div>

      <ConfirmDialog
        open={pendingBranchId !== null && newBranch !== undefined}
        title={t('switch.title', { branch: newBranch?.label[lang] ?? '' })}
        confirmLabel={t('switch.confirm')}
        cancelLabel={t('switch.cancel', { branch: oldBranch?.label[lang] ?? '' })}
        destructive
        onCancel={() => {
          setPendingBranchId(null);
          if (branch) closePicker();
        }}
        onConfirm={() => {
          if (!pendingBranchId || !newBranch) return;
          clear();
          setBranchId(pendingBranchId);
          notify(t('toast.switched', { branch: newBranch.label[lang] }), { tone: 'info' });
        }}
      >
        <p>
          {tn('switch.body1', {
            items: <strong className="text-cream">{items(count)}</strong>,
            branch: <strong className="text-cream">{oldBranch?.label[lang]}</strong>,
          })}
        </p>
        <p className="mt-2">{t('switch.body2', { branch: newBranch?.label[lang] ?? '' })}</p>
      </ConfirmDialog>
    </div>
  );
}
