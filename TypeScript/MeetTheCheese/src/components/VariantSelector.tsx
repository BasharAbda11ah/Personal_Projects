import { useId } from 'react';
import { useI18n } from '../i18n/LanguageContext';
import type { PriceOption } from '../types';

interface VariantSelectorProps {
  productName: string;
  options: PriceOption[];
  value: string;
  onChange: (optionId: string) => void;
}

/** Segmented radio group for products with more than one printed price. */
export default function VariantSelector({ productName, options, value, onChange }: VariantSelectorProps) {
  const name = useId();
  const { t, price } = useI18n();
  return (
    <fieldset>
      <legend className="sr-only">{t('product.chooseOption', { name: productName })}</legend>
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-ink p-1">
        {options.map((o) => {
          const checked = o.id === value;
          return (
            <label
              key={o.id}
              className={`relative flex min-h-12 cursor-pointer flex-col items-center justify-center rounded-lg px-1 py-1.5 text-center transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-cheese ${
                checked ? 'bg-ink-3 text-cheese shadow-inner ring-1 ring-cheese/60' : 'text-muted hover:text-cream'
              }`}
            >
              <input type="radio" name={name} value={o.id} checked={checked} onChange={() => onChange(o.id)} className="sr-only" />
              <span className="text-[0.7rem] font-bold tracking-wide uppercase">{t(`option.${o.id}`)}</span>
              <span
                className={`text-[0.7rem] font-bold whitespace-nowrap tabular-nums min-[420px]:text-xs sm:text-sm ${checked ? 'text-cream' : ''}`}
              >
                {price(o.price)}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
