import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CategoryGroup } from '../types';
import { isHome, navigate } from '../hooks/useHashRoute';
import { scrollToElement } from '../utils/motion';

export type GroupFilter = 'all' | CategoryGroup;

interface MenuFilterValue {
  group: GroupFilter;
  setGroup: (g: GroupFilter) => void;
  query: string;
  setQuery: (q: string) => void;
  /** Go to the menu (from any page), apply a group filter and scroll to it. */
  showMenu: (g?: GroupFilter) => void;
  /** Go to a home-page section (e.g. "branches") from any page. */
  showSection: (id: string) => void;
}

const MenuFilterContext = createContext<MenuFilterValue | null>(null);

function scrollToId(id: string) {
  const go = () => scrollToElement(id);
  if (isHome()) {
    go();
  } else {
    navigate('/');
    // Wait for the home page to render before scrolling.
    window.setTimeout(go, 60);
  }
}

export function MenuFilterProvider({ children }: { children: ReactNode }) {
  const [group, setGroup] = useState<GroupFilter>('all');
  const [query, setQuery] = useState('');

  const showMenu = useCallback((g: GroupFilter = 'all') => {
    setGroup(g);
    setQuery('');
    scrollToId('menu');
  }, []);

  const value = useMemo(
    () => ({ group, setGroup, query, setQuery, showMenu, showSection: scrollToId }),
    [group, query, showMenu],
  );
  return <MenuFilterContext.Provider value={value}>{children}</MenuFilterContext.Provider>;
}

export function useMenuFilter(): MenuFilterValue {
  const ctx = useContext(MenuFilterContext);
  if (!ctx) throw new Error('useMenuFilter must be used inside <MenuFilterProvider>');
  return ctx;
}
