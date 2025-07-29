// Initialize i18n
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationsEn from './locales/en.json'
import translationsFi from './locales/fi.json'

i18n.use(initReactI18next).init({
  resources: {
    fi: {
      translation: translationsFi,
    },
  },
  lng: 'fi', // default language
  fallbackLng: 'fi',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
})

export default i18n
