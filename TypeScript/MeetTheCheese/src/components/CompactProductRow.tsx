import { memo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAddToCart } from '../hooks/useAddToCart';
import { useI18n } from '../i18n/LanguageContext';
import type { Product } from '../types';
import AskPriceButton from './AskPriceButton';
import VerificationNote from './VerificationNote';

/** List-style row for add-ons and sauces (the menu prints these as a price list without photos). */
function CompactProductRow({ product }: { product: Product }) {
  const addToCart = useAddToCart();
  const { t, price } = useI18n();
  const [optionId, setOptionId] = useState<string>(product.options[0]?.id ?? '');
  const option = product.options.find((o) => o.id === optionId);
  const hasVariants = product.options.length > 1;

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-white/5 py-3 last:border-0">
      <div className="min-w-0 flex-1 basis-40">
        <p lang="en" className="font-display text-[0.95rem] tracking-wide text-cheese uppercase">
          {product.name}
        </p>
        <VerificationNote product={product} />
      </div>

      {hasVariants ? (
        <div role="radiogroup" aria-label={t('product.optionAria', { name: product.name })} className="flex gap-1 rounded-full bg-ink p-1">
          {product.options.map((o) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={o.id === optionId}
              aria-label={`${t(`option.${o.id}`)} — ${price(o.price)}`}
              onClick={() => setOptionId(o.id)}
              className={`min-h-9 rounded-full px-3 text-xs font-bold whitespace-nowrap tabular-nums transition ${
                o.id === optionId ? 'bg-ink-3 text-cheese ring-1 ring-cheese/60' : 'text-muted hover:text-cream'
              }`}
            >
              {price(o.price)}
            </button>
          ))}
        </div>
      ) : option ? (
        <span className="font-bold whitespace-nowrap tabular-nums text-cream">{price(option.price)}</span>
      ) : null}

      <div className="w-32 shrink-0">
        {option ? (
          <button
            type="button"
            className="btn btn-primary btn-sm w-full"
            onClick={() => addToCart(product, option)}
            aria-label={t('product.addAria', { name: product.name, price: price(option.price) })}
          >
            <Plus size={16} aria-hidden="true" /> {t('product.add')}
          </button>
        ) : (
          <AskPriceButton productName={product.name} small />
        )}
      </div>
    </li>
  );
}

export default memo(CompactProductRow);
