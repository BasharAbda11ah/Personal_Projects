import { useEffect, type RefObject } from 'react';

/**
 * Publishes an element's live height as a CSS variable on <html> (e.g. --header-h),
 * so sticky offsets and scroll margins follow the real layout instead of hard-coded pixels.
 * When the element unmounts the variable is removed and the CSS default applies again.
 */
export function useCssVarHeight(ref: RefObject<HTMLElement | null>, name: `--${string}`): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const update = () => root.style.setProperty(name, `${Math.round(el.getBoundingClientRect().height)}px`);
    update();
    if (typeof ResizeObserver === 'undefined') return () => root.style.removeProperty(name);
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty(name);
    };
  }, [ref, name]);
}
