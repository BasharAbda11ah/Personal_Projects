import { useCallback } from 'react';
import { getBranch } from '../data/branches';
import { useBranch } from '../context/BranchContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useI18n } from '../i18n/LanguageContext';
import type { BranchId } from '../types';

/**
 * Select a branch. If the cart holds items for another branch, open the picker with the
 * "switch & clear cart" confirmation instead — a cart never mixes branches.
 */
export function useRequestBranch() {
  const { branch, setBranchId, openPicker, closePicker, setPendingBranchId } = useBranch();
  const { count, cartBranchId } = useCart();
  const { notify } = useToast();
  const { t, lang } = useI18n();

  return useCallback(
    (id: BranchId) => {
      if (id === branch?.id) {
        closePicker();
        return;
      }
      if (count > 0 && cartBranchId && cartBranchId !== id) {
        setPendingBranchId(id);
        openPicker();
        return;
      }
      setBranchId(id);
      notify(t('toast.nowOrdering', { branch: getBranch(id)!.label[lang] }), { tone: 'info' });
    },
    [branch, count, cartBranchId, setBranchId, openPicker, closePicker, setPendingBranchId, notify, t, lang],
  );
}
