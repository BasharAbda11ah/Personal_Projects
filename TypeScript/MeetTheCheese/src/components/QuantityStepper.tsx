import { Minus, Plus, Trash2 } from 'lucide-react';
import { useI18n } from '../i18n/LanguageContext';
import { MAX_QUANTITY } from '../utils/cart';

interface QuantityStepperProps {
  quantity: number;
  itemName: string;
  onChange: (quantity: number) => void;
  onRemove: () => void;
}

/** − qty + control. At quantity 1 the minus becomes a remove (bin) button. */
export default function QuantityStepper({ quantity, itemName, onChange, onRemove }: QuantityStepperProps) {
  const { t } = useI18n();
  const btn =
    'flex h-10 w-10 items-center justify-center rounded-full text-cream transition hover:bg-white/10 hover:text-cheese disabled:opacity-40 disabled:hover:bg-transparent';
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-ink p-0.5" role="group" aria-label={t('qty.group', { name: itemName })}>
      {quantity <= 1 ? (
        <button type="button" className={btn} onClick={onRemove} aria-label={t('cart.remove', { name: itemName })}>
          <Trash2 size={16} aria-hidden="true" />
        </button>
      ) : (
        <button type="button" className={btn} onClick={() => onChange(quantity - 1)} aria-label={t('qty.decrease', { name: itemName })}>
          <Minus size={16} aria-hidden="true" />
        </button>
      )}
      <span className="min-w-8 text-center font-bold tabular-nums" aria-live="polite" aria-atomic="true">
        <span className="sr-only">{t('qty.quantity')} </span>
        {quantity}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= MAX_QUANTITY}
        aria-label={t('qty.increase', { name: itemName })}
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
