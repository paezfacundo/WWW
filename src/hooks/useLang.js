import es from "../lang/es.json";
import en from "../lang/en.json";

const translations = { es, en };

export const useLang = (lang = "es") => {
  return translations[lang];
};
