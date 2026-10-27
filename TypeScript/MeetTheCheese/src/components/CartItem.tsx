import { X } from 'lucide-react';
import { fullName } from '../data/menu';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useI18n } from '../i18n/LanguageContext';
import type { ResolvedCartLine } from '../types';
import ProductImage from './ProductImage';
import QuantityStepper from './QuantityStepper';

export default function CartItem({ line }: { line: ResolvedCartLine }) {
  const { setQuantity, remove, add } = useCart();
  const { notify } = useToast();
  const { t, price } = useI18n();
  const name = fullName(line.product);
  const hasVariants = line.product.options.length > 1;

  const removeWithUndo = () => {
    const { productId, optionId, quantity } = line;
    remove(line.key);
    notify(t('toast.removed', { name }), {
      tone: 'info',
      action: { label: t('toast.undo'), onClick: () => add(productId, optionId, quantity) },
    });
  };

  return (
    <li className="flex gap-3 py-4">
      <ProductImage src={line.product.image} alt={name} size={80} className="h-20 w-20 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p lang="en" className="font-display text-sm leading-snug tracking-wide text-cheese uppercase">
              {name}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {hasVariants && <span className="font-semibold text-cream/80">{t(`option.${line.option.id}`)} · </span>}
              {t('cart.each', { price: price(line.option.price) })}
            </p>
            {line.product.priceStatus === 'option-unclear' && <p className="text-xs text-amber-300">{t('cart.toConfirm')}</p>}
          </div>
          <button
            type="button"
            onClick={removeWithUndo}
            className="-me-1 -mt-1 rounded-full p-2 text-muted transition hover:bg-white/5 hover:text-red-300"
            aria-label={t('cart.remove', { name })}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <QuantityStepper
            quantity={line.quantity}
            itemName={name}
            onChange={(q) => setQuantity(line.key, q)}
            onRemove={removeWithUndo}
          />
          <span className="font-bold whitespace-nowrap tabular-nums text-cream">
            <span className="sr-only">{t('cart.lineTotal')}: </span>
            {price(line.lineTotal)}
          </span>
        </div>
      </div>
    </li>
  );
}
