import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      index: {
        moonPhase: "Moon Phase",
        moonrise: "Moonrise",
        moonset: "Moonset",
        moonIllumination: "Moon Illumination",
        isMoonUp: "Is the moon up?",
        phases: {
          "New Moon": "New Moon",
          "Waxing Crescent": "Waxing Crescent",
          "First Quarter": "First Quarter",
          "Waxing Gibbous": "Waxing Gibbous",
          "Full Moon": "Full Moon",
          "Waning Gibbous": "Waning Gibbous",
          "Last Quarter": "Last Quarter",
          "Waning Crescent": "Waning Crescent",
        },
      },
    },
  },
  fr: {
    translation: {
      index: {
        moonPhase: "Phase de la lune",
        moonrise: "Lever de la lune",
        moonset: "Coucher de la lune",
        moonIllumination: "Illumination lunaire",
        isMoonUp: "La lune est-elle visible ?",
        phases: {
          "New Moon": "Nouvelle Lune",
          "Waxing Crescent": "Premier Croissant",
          "First Quarter": "Premier Quartier",
          "Waxing Gibbous": "Gibbeuse Croissante",
          "Full Moon": "Pleine Lune",
          "Waning Gibbous": "Gibbeuse Décroissante",
          "Last Quarter": "Dernier Quartier",
          "Waning Crescent": "Dernier Croissant",
        },
      },
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
