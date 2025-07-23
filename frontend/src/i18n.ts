// Initialize i18n
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationsEn from './locales/en.json'
import translationsFi from './locales/fi.json'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationsEn,
      },
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
