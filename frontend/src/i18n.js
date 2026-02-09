import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import hi from './locales/hi';
import ta from './locales/ta';
import ur from './locales/ur';
import ml from './locales/ml';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ...en,
      ...hi,
      ...ta,
      ...ur,
      ...ml
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
