import { useEffect, useState } from 'react';

/**
 * Minimal hash router. Hash URLs work on any static host (no server rewrites needed),
 * so links and QR codes survive refreshes and direct visits.
 *   #/ or empty   → home
 *   #/summary     → order summary
 *   #/privacy     → privacy notice
 *   #menu, #branches (plain anchors) → home, scrolled to that section
 *   anything else → 404
 */
export type Route = 'home' | 'summary' | 'privacy' | 'not-found';
export type Path = '/' | '/summary' | '/privacy';

export function parseHash(hash: string): { route: Route; anchor: string | null } {
  const h = hash.replace(/^#/, '');
  if (h && !h.startsWith('/')) return { route: 'home', anchor: h.split('?')[0] || null };
  const path = h.split('?')[0].replace(/\/+$/, '');
  if (path === '') return { route: 'home', anchor: null };
  if (path === '/summary') return { route: 'summary', anchor: null };
  if (path === '/privacy') return { route: 'privacy', anchor: null };
  return { route: 'not-found', anchor: null };
}

export function useHashRoute(): Route {
  const [state, setState] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => {
      const next = parseHash(window.location.hash);
      setState(next);
      if (!next.anchor) window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  // Scroll to a plain anchor (#menu) once the home page has rendered.
  useEffect(() => {
    if (!state.anchor) return;
    const id = state.anchor;
    // Instant (not smooth) so shared links like /#menu land correctly even before the page has painted.
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' }), 60);
    return () => window.clearTimeout(t);
  }, [state]);

  return state.route;
}

export function navigate(path: Path): void {
  window.location.hash = path;
}

export function isHome(): boolean {
  return parseHash(window.location.hash).route === 'home';
}
