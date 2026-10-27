import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { getBranch, isBranchId } from '../data/branches';
import type { Branch, BranchId } from '../types';
import { readBranchParam, resolveInitialBranch, type LinkStatus } from '../utils/branchLink';
import { sanitizeCart } from '../utils/cart';
import { readJSON, STORAGE_KEYS, writeJSON } from '../utils/storage';

interface BranchContextValue {
  branch: Branch | undefined;
  setBranchId: (id: BranchId) => void;
  /** Whether the full-screen branch picker is showing. */
  pickerOpen: boolean;
  openPicker: () => void;
  closePicker: () => void;
  /** A branch waiting for the "switch & clear cart" confirmation. */
  pendingBranchId: BranchId | null;
  setPendingBranchId: (id: BranchId | null) => void;
  /** What happened with a ?branch= link on page load (used once, for a notification). */
  linkStatus: LinkStatus;
  linkedBranchId: BranchId | null;
}

const BranchContext = createContext<BranchContextValue | null>(null);

function computeInitial() {
  const saved = readJSON<unknown>(STORAGE_KEYS.branch);
  const savedBranch = isBranchId(saved) ? saved : null;
  const raw = readBranchParam(window.location.search, window.location.hash);
  const state = resolveInitialBranch(raw, savedBranch, sanitizeCart(readJSON(STORAGE_KEYS.cart)));
  if (state.linkStatus === 'applied' && state.branchId) writeJSON(STORAGE_KEYS.branch, state.branchId);
  return { ...state, linkedBranchId: state.linkStatus === 'applied' ? state.branchId : state.pendingBranchId };
}

export function BranchProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(computeInitial);
  const [branchId, setId] = useState<BranchId | null>(initial.branchId);
  const [pickerOpen, setPickerOpen] = useState(initial.pickerOpen);
  const [pendingBranchId, setPendingBranchId] = useState<BranchId | null>(initial.pendingBranchId);

  const setBranchId = useCallback((id: BranchId) => {
    setId(id);
    writeJSON(STORAGE_KEYS.branch, id);
    setPickerOpen(false);
    setPendingBranchId(null);
  }, []);

  const value = useMemo<BranchContextValue>(
    () => ({
      branch: getBranch(branchId),
      setBranchId,
      pickerOpen,
      openPicker: () => setPickerOpen(true),
      closePicker: () => {
        setPickerOpen(false);
        setPendingBranchId(null);
      },
      pendingBranchId,
      setPendingBranchId,
      linkStatus: initial.linkStatus,
      linkedBranchId: initial.linkedBranchId,
    }),
    [branchId, pickerOpen, pendingBranchId, setBranchId, initial],
  );

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranch(): BranchContextValue {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error('useBranch must be used inside <BranchProvider>');
  return ctx;
}
