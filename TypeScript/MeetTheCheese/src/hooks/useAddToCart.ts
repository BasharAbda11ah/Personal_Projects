import { useCallback } from 'react';
import { fullName } from '../data/menu';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useI18n } from '../i18n/LanguageContext';
import type { PriceOption, Product } from '../types';

/** Adds an item and shows a confirmation toast with a "View cart" shortcut. */
export function useAddToCart() {
  const { add, openDrawer } = useCart();
  const { notify } = useToast();
  const { t } = useI18n();

  return useCallback(
    (product: Product, option: PriceOption) => {
      add(product.id, option.id);
      const variant = product.options.length > 1 ? ` (${t(`option.${option.id}`)})` : '';
      notify(t('toast.added', { name: `${fullName(product)}${variant}` }), {
        action: { label: t('toast.viewCart'), onClick: openDrawer },
      });
    },
    [add, notify, openDrawer, t],
  );
}
