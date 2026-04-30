import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from '@/locales/ru'
import en from '@/locales/en'
import ar from '@/locales/ar'

const LANG_STORAGE_KEY = 'dalilun-language'
const SUPPORTED_LANGS = ['ru', 'en', 'ar'] as const

function readStoredLanguage(): (typeof SUPPORTED_LANGS)[number] {
  try {
    const raw = localStorage.getItem(LANG_STORAGE_KEY)
    if (raw && (SUPPORTED_LANGS as readonly string[]).includes(raw)) {
      return raw as (typeof SUPPORTED_LANGS)[number]
    }
  } catch {
    /* private mode / disabled storage */
  }
  return 'ru'
}

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: readStoredLanguage(),
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  const base = lng.split('-')[0]
  if (!(SUPPORTED_LANGS as readonly string[]).includes(base)) return
  try {
    localStorage.setItem(LANG_STORAGE_KEY, base)
  } catch {
    /* ignore */
  }
})

export default i18n
