import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

let lockCount = 0;

/**
 * Shared behaviour for dialogs and drawers: focus trap, Escape to close,
 * body scroll lock and focus restore on close.
 */
export function useModalBehavior(
  open: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onClose?: () => void,
): void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const container = containerRef.current;

    lockCount++;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog straight away (it is already in the DOM when this effect runs).
    const preferred = container?.querySelector<HTMLElement>('[data-autofocus]');
    const firstFocusable = preferred ?? container?.querySelector<HTMLElement>(FOCUSABLE);
    (firstFocusable ?? container)?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (!container) return;
      // Only the top-most open modal reacts.
      const modals = document.querySelectorAll('[data-modal-root]');
      if (modals[modals.length - 1] !== container) return;
      if (e.key === 'Escape' && onCloseRef.current) {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      // Notifications (e.g. "Undo" after removing an item) stay reachable while the dialog is open.
      const toasts = document.querySelector<HTMLElement>('[data-toast-region]');
      const visible = (el: HTMLElement) => el.offsetParent !== null;
      const items = [
        ...Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)),
        ...Array.from(toasts?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
      ].filter(visible);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = !!active && (container.contains(active) || !!toasts?.contains(active));
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      lockCount--;
      if (lockCount === 0) document.body.style.overflow = '';
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus();
    };
  }, [open, containerRef]);
}
