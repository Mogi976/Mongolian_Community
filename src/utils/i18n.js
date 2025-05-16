import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "../locales/translations.json";

i18n.use(initReactI18next).init({
  resources: translations,
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false, // Disable suspense for simplicity
  },
});

export default i18n;