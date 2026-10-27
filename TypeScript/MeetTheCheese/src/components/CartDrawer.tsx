import { useRef, useState } from 'react';
import { ArrowRight, MapPin, ShoppingBag, Trash2, X } from 'lucide-react';
import { useBranch } from '../context/BranchContext';
import { useCart } from '../context/CartContext';
import { useMenuFilter } from '../context/MenuFilterContext';
import { useToast } from '../context/ToastContext';
import { navigate } from '../hooks/useHashRoute';
import { useModalBehavior } from '../hooks/useModalBehavior';
import { useI18n } from '../i18n/LanguageContext';
import CartItem from './CartItem';
import ConfirmDialog from './ConfirmDialog';

export default function CartDrawer() {
  const { drawerOpen, closeDrawer, lines, count, subtotal, clear } = useCart();
  const { branch, openPicker } = useBranch();
  const { showMenu } = useMenuFilter();
  const { notify } = useToast();
  const { t, tn, lang, items, price } = useI18n();
  const [confirmClear, setConfirmClear] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useModalBehavior(drawerOpen, ref, closeDrawer);
  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="animate-fade-in absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={closeDrawer} aria-hidden="true" />
      <div
        ref={ref}
        data-modal-root
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        className="animate-drawer-in absolute inset-y-0 end-0 flex h-dvh w-full max-w-md flex-col border-s border-line bg-ink-2 shadow-2xl shadow-black outline-none"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-4">
          <div>
            <h2 id="cart-title" className="font-display text-2xl text-cheese">
              {t('cart.title')}
            </h2>
            <p className="text-sm text-muted">{items(count)}</p>
          </div>
          <button type="button" onClick={closeDrawer} className="btn btn-ghost min-h-11 px-2.5" aria-label={t('cart.close')}>
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        {branch && (
          <div className="flex items-center justify-between gap-2 bg-ink-3/60 px-5 py-2.5 text-sm">
            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin size={15} className="shrink-0 text-cheese" aria-hidden="true" />
              <span className="truncate">
                {tn('cart.orderFor', { branch: <strong className="text-cream">{branch.label[lang]}</strong> })}
              </span>
            </span>
            <button
              type="button"
              className="min-h-9 shrink-0 rounded-full px-2 font-semibold text-cheese hover:underline"
              onClick={() => {
                closeDrawer();
                openPicker();
              }}
            >
              {t('cart.change')}
            </button>
          </div>
        )}

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-3">
              <ShoppingBag size={36} className="text-cheese" aria-hidden="true" />
            </div>
            <h3 className="font-display mt-5 text-xl text-cream">{t('cart.emptyTitle')}</h3>
            <p className="mt-2 text-muted">{t('cart.emptyBody')}</p>
            <button
              type="button"
              className="btn btn-primary mt-6"
              onClick={() => {
                closeDrawer();
                showMenu('all');
              }}
            >
              {t('cart.browse')}
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-white/5 overflow-y-auto overscroll-contain px-5">
              {lines.map((line) => (
                <CartItem key={line.key} line={line} />
              ))}
            </ul>

            <div className="border-t border-white/5 bg-ink-2 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex items-baseline justify-between">
                <span className="text-muted">{t('cart.subtotal')}</span>
                <span className="text-2xl font-black text-cream tabular-nums">{price(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">{t('cart.pricesNote')}</p>
              <button
                type="button"
                className="btn btn-primary mt-4 min-h-12 w-full text-base"
                onClick={() => {
                  closeDrawer();
                  navigate('/summary');
                }}
              >
                {t('cart.review')} <ArrowRight size={18} className="rtl:-scale-x-100" aria-hidden="true" />
              </button>
              <div className="mt-2 flex gap-2">
                <button type="button" className="btn btn-ghost flex-1 text-sm whitespace-nowrap" onClick={closeDrawer}>
                  {t('cart.continue')}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost flex-1 text-sm whitespace-nowrap hover:text-red-300"
                  onClick={() => setConfirmClear(true)}
                >
                  <Trash2 size={16} aria-hidden="true" /> {t('cart.clear')}
                </button>
              </div>
            </div>
          </>
        )}

        <ConfirmDialog
          open={confirmClear}
          title={t('cart.clearTitle')}
          confirmLabel={t('cart.clear')}
          cancelLabel={t('cart.keep')}
          destructive
          onCancel={() => setConfirmClear(false)}
          onConfirm={() => {
            clear();
            setConfirmClear(false);
            notify(t('toast.cleared'), { tone: 'info' });
          }}
        >
          {t('cart.clearBody', { items: items(count) })}
        </ConfirmDialog>
      </div>
    </div>
  );
}
