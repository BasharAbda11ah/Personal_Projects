import { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from '../types';
import { readJSON, STORAGE_KEYS, writeJSON } from '../utils/storage';
import { formatPrice } from '../utils/currency';
import { ar } from './ar';
import { en, type MessageKey } from './en';

type Params = Record<string, string | number>;
type PluralBase = { [K in MessageKey]: K extends `${infer B}.other` ? B : never }[MessageKey];

const DICTIONARIES: Record<Lang, Record<string, string>> = { en, ar };

export function isLang(v: unknown): v is Lang {
  return v === 'en' || v === 'ar';
}

/** Pure translator, also used by tests. */
export function translate(lang: Lang, key: MessageKey, params?: Params): string {
  const raw = DICTIONARIES[lang][key] ?? en[key] ?? key;
  return params ? raw.replace(/\{(\w+)\}/g, (m, p: string) => (p in params ? String(params[p]) : m)) : raw;
}

export function translatePlural(lang: Lang, base: PluralBase, count: number): string {
  const rule = new Intl.PluralRules(lang === 'ar' ? 'ar' : 'en').select(count);
  const dict = DICTIONARIES[lang];
  const raw = dict[`${base}.${rule}`] ?? dict[`${base}.other`];
  return raw.replace('{count}', String(count));
}

interface LanguageValue {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: MessageKey, params?: Params) => string;
  /** Like t(), but placeholders may be React nodes (e.g. <strong>). */
  tn: (key: MessageKey, params: Record<string, ReactNode>) => ReactNode;
  /** "3 items" / "٣ أصناف" with the right plural form. */
  items: (count: number) => string;
  price: (amount: number) => string;
}

const LanguageContext = createContext<LanguageValue | null>(null);

function initialLang(): Lang {
  // A ?lang=ar link (e.g. an Arabic QR code) wins over the saved choice.
  try {
    const param = new URLSearchParams(window.location.search).get('lang');
    if (isLang(param)) return param;
  } catch {
    /* ignore */
  }
  const saved = readJSON<unknown>(STORAGE_KEYS.lang);
  return isLang(saved) ? saved : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    writeJSON(STORAGE_KEYS.lang, l);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    writeJSON(STORAGE_KEYS.lang, lang);
  }, [lang]);

  const value = useMemo<LanguageValue>(() => {
    const t = (key: MessageKey, params?: Params) => translate(lang, key, params);
    const tn = (key: MessageKey, params: Record<string, ReactNode>) => {
      const parts = translate(lang, key).split(/(\{\w+\})/g);
      return parts.map((part, i) => {
        const m = /^\{(\w+)\}$/.exec(part);
        return <Fragment key={i}>{m && m[1] in params ? params[m[1]] : part}</Fragment>;
      });
    };
    return {
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      setLang,
      toggleLang: () => setLang(lang === 'ar' ? 'en' : 'ar'),
      t,
      tn,
      items: (count: number) => translatePlural(lang, 'items', count),
      price: (amount: number) => formatPrice(amount, lang),
    };
  }, [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useI18n must be used inside <LanguageProvider>');
  return ctx;
}
