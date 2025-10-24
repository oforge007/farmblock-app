"use client"

import React, { createContext, useState, useEffect, useMemo } from "react"
import translations from "@/lang/translations"

type LanguageCode = string

type LanguageContextType = {
  language: LanguageCode
  setLanguage: (l: LanguageCode) => void
  t: (key: string) => string
  languageName: string
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "EN",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLanguage: () => {},
  t: (k: string) => k,
  languageName: "English",
})

const STORAGE_KEY = "farmblock:lang"

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("EN")

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setLanguageState(saved)
    } catch (e) {
      // ignore
    }
  }, [])

  const setLanguage = (l: LanguageCode) => {
    setLanguageState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch (e) {
      // ignore
    }
  }

  // reflect selected language on the document element for accessibility / SEO
  useEffect(() => {
    try {
      const htmlLang = (language || "EN").slice(0, 2).toLowerCase()
      if (typeof document !== "undefined") document.documentElement.lang = htmlLang
    } catch (e) {
      // ignore
    }
  }, [language])

  const t = (key: string) => {
    const langKey = language || "EN"
    // translations keys are stored uppercase codes like EN, ES
    const map = translations[langKey] || translations.EN || {}
    return (map as Record<string, string>)[key] || (translations.EN as Record<string, string>)[key] || key
  }

  const languageName = useMemo(() => {
    const map: Record<string, string> = {
      EN: "English",
      ES: "Español",
      FR: "Français",
    }
    return map[language] || language
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageName }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageProvider

export function useLanguage() {
  const ctx = React.useContext(LanguageContext)
  return ctx
}
