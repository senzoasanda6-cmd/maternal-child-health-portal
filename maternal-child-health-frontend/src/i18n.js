import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zu from "./locales/zu.json";
import xh from "./locales/xh.json";

const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
    lng: savedLanguage,
    resources: {
        en: { translation: en },
        zu: { translation: zu },
        xh: { translation: xh },
    },

    fallbackLng: "en",
    interpolation: { escapeValue: false },
});

export default i18n;
