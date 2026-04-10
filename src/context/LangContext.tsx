'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Lang = 'fr' | 'en' | 'es' | 'pt'

const VALID_LANGS: Lang[] = ['fr', 'en', 'es', 'pt']

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'fr',
  setLang: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved && VALID_LANGS.includes(saved)) setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}

// Translate helper: t('Accueil', 'Home', 'Inicio', 'Início')
// ES/PT are optional — falls back to EN if not provided
export function useT() {
  const { lang } = useLang()
  return (fr: string, en: string, es?: string, pt?: string): string => {
    if (lang === 'es') return es ?? en
    if (lang === 'pt') return pt ?? en
    if (lang === 'en') return en
    return fr
  }
}
