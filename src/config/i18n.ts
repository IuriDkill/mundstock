import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import ptFile from "../locales/pt.json";
import enFile from "../locales/en.json";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    fallbackLng: "pt",
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
    debug: false,
    resources: {
      "pt": {translation: ptFile},
      "pt-BR": {translation: ptFile},
      "en": {translation: enFile},
    },
  });

export default i18n;
