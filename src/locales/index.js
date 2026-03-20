import { createI18n } from 'vue-i18n'
import ar from './ar.json'
import en from './en.json'

const getInitialLocale = () => {
  if (typeof window !== 'undefined' && localStorage.getItem('locale')) {
    return localStorage.getItem('locale')
  }
  return 'ar'
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    ar,
    en
  }
})

export default i18n
