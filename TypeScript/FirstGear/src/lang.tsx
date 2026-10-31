import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { dict, type Dict, type Lang } from './content'

const STORAGE_KEY = 'fg-demo-lang'

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl === 'ar' || fromUrl === 'en') return fromUrl
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'ar' || stored === 'en') return stored
  } catch {
    // Storage blocked (private mode): fall through to the default.
  }
  return 'en'
}

interface LangValue {
  lang: Lang
  t: Dict
  toggle: () => void
}

const LangContext = createContext<LangValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)
  const t = dict[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = t.dir
    document.title =
      lang === 'ar'
        ? 'فيرست جير لتلميع وتنظيف السيارات، عجمان (نموذج غير رسمي)'
        : 'First Gear Car Polish & Cleaning, Ajman (unofficial demo)'
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Non-essential preference; ignore.
    }
    // Keep a shared or reloaded link in the language the visitor chose.
    const url = new URL(window.location.href)
    if (url.searchParams.has('lang') && url.searchParams.get('lang') !== lang) {
      url.searchParams.set('lang', lang)
      window.history.replaceState(null, '', url)
    }
  }, [lang, t.dir])

  const toggle = () => setLang((l) => (l === 'en' ? 'ar' : 'en'))

  return <LangContext value={{ lang, t, toggle }}>{children}</LangContext>
}

export function useLang(): LangValue {
  const value = use(LangContext)
  if (!value) throw new Error('useLang must be used inside LangProvider')
  return value
}
