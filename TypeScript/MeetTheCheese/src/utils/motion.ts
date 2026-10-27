/** Smooth scrolling, unless the visitor asked their device to reduce motion. */
export function scrollBehavior(): ScrollBehavior {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  } catch {
    return 'auto';
  }
}

export function scrollToElement(id: string, block: ScrollLogicalPosition = 'start'): void {
  document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior(), block });
}
