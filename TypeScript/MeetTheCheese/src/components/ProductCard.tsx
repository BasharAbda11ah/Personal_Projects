import { memo, useEffect, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { useAddToCart } from '../hooks/useAddToCart';
import { useI18n } from '../i18n/LanguageContext';
import type { MessageKey } from '../i18n/en';
import type { Product } from '../types';
import AskPriceButton from './AskPriceButton';
import ProductImage from './ProductImage';
import VariantSelector from './VariantSelector';
import VerificationNote from './VerificationNote';

interface ProductCardProps {
  product: Product;
  eager?: boolean;
  /** Show the category above the name. */
  showCategory?: boolean;
}

function ProductCard({ product, eager, showCategory = true }: ProductCardProps) {
  const addToCart = useAddToCart();
  const { t, lang, price } = useI18n();
  const [optionId, setOptionId] = useState<string>(product.options[0]?.id ?? '');
  const [justAdded, setJustAdded] = useState(false);
  const option = product.options.find((o) => o.id === optionId);
  const hasVariants = product.options.length > 1;
  const priceLabel = product.options.length ? product.options.map((o) => o.price).join(' / ') : null;

  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(false), 1200);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  return (
    <article className="frame group relative flex h-full flex-col overflow-hidden bg-ink-2 shadow-lg shadow-black/30 transition duration-200 hover:-translate-y-1 hover:border-cheese hover:shadow-2xl hover:shadow-flame/10 motion-reduce:hover:translate-y-0">
      <div className="relative aspect-square overflow-hidden bg-ink-3">
        <ProductImage
          src={product.image}
          alt={product.name}
          eager={eager}
          className="h-full w-full transition duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
        />
        <span className="absolute end-2.5 top-2.5 rounded-lg bg-gradient-to-b from-cheese-soft to-cheese px-2 py-1 text-sm font-black text-ink shadow-md sm:text-base">
          {priceLabel ? (
            <bdi dir="ltr">
              <span className="tabular-nums">{priceLabel}</span> <span className="text-[0.7em]">{lang === 'ar' ? 'د.إ' : 'AED'}</span>
            </bdi>
          ) : (
            <span className="text-xs">{t('product.priceTbc')}</span>
          )}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div>
          {showCategory && (
            <p className="text-[0.68rem] font-bold tracking-[0.16em] text-flame uppercase">
              {t(`cat.${product.categoryId}` as MessageKey)}
            </p>
          )}
          <h3 lang="en" className="font-display mt-0.5 text-[0.95rem] leading-snug tracking-wide break-words text-cheese uppercase sm:text-lg">
            {product.name}
          </h3>
          {product.description && (
            <p lang="en" className="mt-1.5 text-sm leading-snug text-muted">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-auto space-y-2.5">
          {hasVariants && (
            <VariantSelector productName={product.name} options={product.options} value={optionId} onChange={setOptionId} />
          )}
          <VerificationNote product={product} />

          {option ? (
            <button
              type="button"
              onClick={() => {
                addToCart(product, option);
                setJustAdded(true);
              }}
              className={`btn w-full px-2.5 text-sm whitespace-nowrap sm:text-[0.95rem] ${justAdded ? 'btn-added' : 'btn-primary'}`}
              aria-label={t('product.addAria', {
                name: hasVariants ? `${product.name} (${t(`option.${option.id}`)})` : product.name,
                price: price(option.price),
              })}
            >
              {justAdded ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
              {justAdded ? t('product.added') : t('product.addToCart')}
            </button>
          ) : (
            <AskPriceButton productName={product.name} />
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
