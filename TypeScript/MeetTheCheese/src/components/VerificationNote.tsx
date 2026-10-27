import { useId, useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { needsConfirmation } from '../data/menu';
import { useI18n } from '../i18n/LanguageContext';
import type { Product } from '../types';

/**
 * Small disclosure explaining how a price was read from the printed menu.
 * Renders nothing for clearly printed single prices.
 */
export default function VerificationNote({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const { t } = useI18n();

  if (product.priceStatus === 'confirmed') return null;
  const warn = needsConfirmation(product);
  const text =
    product.priceStatus === 'meal-inferred'
      ? t('note.meal')
      : product.priceStatus === 'option-unclear'
        ? t('note.unclear', { prices: product.options.map((o) => o.price).join('/') })
        : t('note.unconfirmed');
  const Icon = warn ? AlertTriangle : Info;

  return (
    <div className="text-xs">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex min-h-7 items-center gap-1 rounded-md py-0.5 font-semibold underline-offset-2 hover:underline ${
          warn ? 'text-amber-300' : 'text-muted'
        }`}
      >
        <Icon size={13} aria-hidden="true" /> {warn ? t('product.confirmWithBranch') : t('product.aboutPrices')}
      </button>
      {open && (
        <p id={id} className="mt-1 rounded-lg bg-ink/70 p-2 leading-snug text-muted">
          {text}
        </p>
      )}
    </div>
  );
}
