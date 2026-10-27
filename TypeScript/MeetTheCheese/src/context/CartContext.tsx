import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { BranchId, CartState, ResolvedCartLine } from '../types';
import {
  addLine,
  EMPTY_CART,
  itemCount,
  removeLine,
  resolveLines,
  sanitizeCart,
  setLineQuantity,
  subtotal,
} from '../utils/cart';
import { readJSON, STORAGE_KEYS, writeJSON } from '../utils/storage';
import { useBranch } from './BranchContext';

interface CartContextValue {
  /** Branch the cart belongs to (null when empty). */
  cartBranchId: BranchId | null;
  lines: ResolvedCartLine[];
  count: number;
  subtotal: number;
  add: (productId: string, optionId: string, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { branch } = useBranch();
  const [cart, setCart] = useState<CartState>(() => sanitizeCart(readJSON(STORAGE_KEYS.cart)));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // A cart never mixes branches: if the stored cart belongs to a different branch, drop it.
  useEffect(() => {
    if (branch && cart.branchId && cart.branchId !== branch.id) setCart(EMPTY_CART);
  }, [branch, cart.branchId]);

  useEffect(() => {
    writeJSON(STORAGE_KEYS.cart, cart);
  }, [cart]);

  const add = useCallback(
    (productId: string, optionId: string, quantity = 1) => {
      if (!branch) return;
      setCart((c) => ({
        branchId: branch.id,
        lines: addLine(c.branchId === branch.id ? c.lines : [], productId, optionId, quantity),
      }));
    },
    [branch],
  );

  const setQuantity = useCallback((key: string, quantity: number) => {
    setCart((c) => {
      const lines = setLineQuantity(c.lines, key, quantity);
      return lines.length ? { ...c, lines } : EMPTY_CART;
    });
  }, []);

  const remove = useCallback((key: string) => {
    setCart((c) => {
      const lines = removeLine(c.lines, key);
      return lines.length ? { ...c, lines } : EMPTY_CART;
    });
  }, []);

  const clear = useCallback(() => setCart(EMPTY_CART), []);

  const value = useMemo<CartContextValue>(() => {
    const resolved = resolveLines(cart.lines);
    return {
      cartBranchId: cart.branchId,
      lines: resolved,
      count: itemCount(resolved),
      subtotal: subtotal(resolved),
      add,
      setQuantity,
      remove,
      clear,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    };
  }, [cart, add, setQuantity, remove, clear, drawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
