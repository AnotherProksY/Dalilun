import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from '@/locales/ru'
import en from '@/locales/en'
import ar from '@/locales/ar'

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
})

export default i18n
