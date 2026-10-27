import { useState } from 'react';
import { AlertTriangle, ArrowLeft, Info, Send, ShoppingBag, Trash2 } from 'lucide-react';
import { fullName } from '../data/menu';
import { useBranch } from '../context/BranchContext';
import { useCart } from '../context/CartContext';
import { useMenuFilter } from '../context/MenuFilterContext';
import { useToast } from '../context/ToastContext';
import { useI18n } from '../i18n/LanguageContext';
import BranchInfo from '../components/BranchInfo';
import ConfirmDialog from '../components/ConfirmDialog';
import ProductImage from '../components/ProductImage';
import QuantityStepper from '../components/QuantityStepper';
import WhatsAppOrderPanel from '../components/WhatsAppOrderPanel';
import { scrollToElement } from '../utils/motion';

export default function OrderSummaryPage() {
  const { branch, openPicker } = useBranch();
  const { lines, count, subtotal, setQuantity, remove, clear } = useCart();
  const { showMenu } = useMenuFilter();
  const { notify } = useToast();
  const { t, lang, items, price } = useI18n();
  const [confirmClear, setConfirmClear] = useState(false);

  const backToMenu = () => showMenu('all');
  const backIcon = <ArrowLeft size={18} className="rtl:-scale-x-100" aria-hidden="true" />;

  if (!branch || lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-3">
          <ShoppingBag size={36} className="text-cheese" aria-hidden="true" />
        </div>
        <h1 className="font-display mt-6 text-3xl text-cream">{t('summary.emptyTitle')}</h1>
        <p className="mt-3 text-muted">{t('summary.emptyBody')}</p>
        <button type="button" className="btn btn-primary mt-8" onClick={backToMenu}>
          {backIcon} {t('summary.back')}
        </button>
      </div>
    );
  }

  const hasUnclear = lines.some((l) => l.product.priceStatus === 'option-unclear');
  const steps = [t('summary.step1'), t('summary.step2'), t('summary.step3')];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-28 sm:px-6 sm:pt-12 lg:pb-12">
      <button type="button" onClick={backToMenu} className="btn btn-ghost -ms-3">
        {backIcon} {t('summary.back')}
      </button>

      <h1 className="font-display mt-3 text-4xl text-cream sm:text-5xl">
        {t('summary.titleA')} <span className="text-gradient-cheese">{t('summary.titleB')}</span>
      </h1>

      <ol aria-label={t('summary.stepsAria')} className="mt-6 grid gap-2 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${
              i === 0 ? 'border-cheese/60 bg-cheese/[0.08] text-cream' : 'border-line bg-ink-2/60 text-muted'
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                i === 0 ? 'bg-cheese text-ink' : 'bg-ink-3 text-cream'
              }`}
            >
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>

      <div role="note" className="mt-4 flex gap-3 rounded-2xl border border-white/10 bg-ink-2/60 p-4 text-sm leading-relaxed">
        <Info size={20} className="mt-0.5 shrink-0 text-cheese" aria-hidden="true" />
        <p className="text-cream/90">{t('summary.notice', { branch: branch.label[lang] })}</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <section aria-labelledby="items-title" className="frame bg-ink-2/90 p-5 shadow-xl shadow-black/30 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="items-title" className="font-display text-xl text-cheese">
              {t('summary.itemsTitle')}
            </h2>
            <span className="text-sm text-muted">{items(count)}</span>
          </div>

          {/* Table on wide screens, stacked rows on small screens */}
          <table className="mt-4 w-full text-sm">
            <caption className="sr-only">{t('summary.caption')}</caption>
            <thead className="hidden text-start text-xs tracking-wider text-muted uppercase sm:table-header-group">
              <tr className="border-b border-white/10">
                <th scope="col" className="pb-3 text-start font-semibold">{t('summary.colItem')}</th>
                <th scope="col" className="pb-3 text-start font-semibold">{t('summary.colUnit')}</th>
                <th scope="col" className="pb-3 text-center font-semibold">{t('summary.colQty')}</th>
                <th scope="col" className="pb-3 text-end font-semibold">{t('summary.colTotal')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {lines.map((l) => {
                const name = fullName(l.product);
                const variant = l.product.options.length > 1 ? t(`option.${l.option.id}`) : null;
                return (
                  <tr key={l.key} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 py-4 sm:table-row">
                    <td className="row-span-3 sm:py-4 sm:pe-3">
                      <div className="flex items-center gap-3">
                        <ProductImage src={l.product.image} alt={name} size={64} className="h-16 w-16 shrink-0 rounded-xl" />
                        <div className="hidden sm:block">
                          <p lang="en" className="font-display tracking-wide text-cheese uppercase">{name}</p>
                          {variant && <p className="text-xs text-muted">{variant}</p>}
                          {l.product.priceStatus === 'option-unclear' && <p className="text-xs text-amber-300">{t('cart.toConfirm')}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="sm:hidden">
                      <p lang="en" className="font-display tracking-wide text-cheese uppercase">{name}</p>
                      <p className="text-xs text-muted">
                        {variant && `${variant} · `}
                        {t('cart.each', { price: price(l.option.price) })}
                      </p>
                      {l.product.priceStatus === 'option-unclear' && <p className="text-xs text-amber-300">{t('cart.toConfirm')}</p>}
                    </td>
                    <td className="hidden whitespace-nowrap tabular-nums sm:table-cell sm:py-4">{price(l.option.price)}</td>
                    <td className="sm:py-4 sm:text-center">
                      <QuantityStepper
                        quantity={l.quantity}
                        itemName={name}
                        onChange={(q) => setQuantity(l.key, q)}
                        onRemove={() => {
                          remove(l.key);
                          notify(t('toast.removed', { name }), { tone: 'info' });
                        }}
                      />
                    </td>
                    <td className="col-start-2 font-bold whitespace-nowrap tabular-nums text-cream sm:py-4 sm:text-end">
                      <span className="text-xs font-normal text-muted sm:hidden">{t('cart.lineTotal')}: </span>
                      {price(l.lineTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-2 flex items-baseline justify-between border-t border-white/10 pt-4">
            <span className="text-lg text-muted">{t('cart.subtotal')}</span>
            <span className="text-3xl font-black text-cream tabular-nums">{price(subtotal)}</span>
          </div>
          <p className="mt-1 text-end text-xs text-muted">{t('summary.pricesNote')}</p>

          {hasUnclear && (
            <p className="mt-4 flex gap-2 rounded-xl bg-amber-300/10 p-3 text-xs text-amber-200">
              <AlertTriangle size={16} className="shrink-0" aria-hidden="true" /> {t('summary.unclearWarning')}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-secondary" onClick={backToMenu}>
              {backIcon} {t('summary.back')}
            </button>
            <button type="button" className="btn btn-danger" onClick={() => setConfirmClear(true)}>
              <Trash2 size={18} aria-hidden="true" /> {t('summary.clear')}
            </button>
          </div>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <WhatsAppOrderPanel branch={branch} lines={lines} subtotal={subtotal} />
          <BranchInfo branch={branch} heading={t('summary.orderFor')} onChange={openPicker} />
        </aside>
      </div>

      {/* Phones: keep the next step one tap away while reviewing items. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-ink/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted">{t('cart.subtotal')}</p>
            <p className="text-lg font-black whitespace-nowrap text-cream tabular-nums">{price(subtotal)}</p>
          </div>
          <button
            type="button"
            className="btn btn-primary min-h-12 flex-1 px-3 whitespace-nowrap"
            onClick={() => scrollToElement('send-title', 'center')}
          >
            <Send size={18} className="rtl:-scale-x-100" aria-hidden="true" /> {t('send.short')}
          </button>
        </div>
      </div>

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
  );
}
