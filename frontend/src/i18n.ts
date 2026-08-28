import { LearnLang } from "@/src/context/LanguageContext";

// UI language is the OPPOSITE of the language being learned.
export const uiLangOf = (learn: LearnLang): "en" | "es" => (learn === "en" ? "es" : "en");

type UIStrings = {
  chooseSubject: string;
  chooseAux: string;
  chooseTense: string;
  chooseVerb: string;
  chooseQty: string;
  chooseColor: string;
  chooseObject: string;
  generate: string;
  aff: string;
  neg: string;
  que: string;
  search: string;
  regular: string;
  irregular: string;
  sheetTitle: string;
  // Home
  homeTitle: string;
  homeSubtitle: string;
  languageMenu: string;
  langEnglish: string;
  langSpanish: string;
  langMixed: string;
  mixedEnEs: string;
  mixedEsEn: string;
  tenses: string;
};

export const STRINGS: Record<"en" | "es", UIStrings> = {
  es: {
    chooseSubject: "Elige tu sujeto",
    chooseAux: "Elige tu verbo auxiliar",
    chooseTense: "Elige el tiempo",
    chooseVerb: "Elige tu verbo",
    chooseQty: "Elige la cantidad",
    chooseColor: "Elige el color",
    chooseObject: "Elige el objeto",
    generate: "Generar",
    aff: "AFIRMATIVA",
    neg: "NEGATIVA",
    que: "PREGUNTA",
    search: "Buscar verbo…",
    regular: "Regulares",
    irregular: "Irregulares",
    sheetTitle: "Elige un verbo",
    homeTitle: "Módulos",
    homeSubtitle: "Elige un módulo para comenzar",
    languageMenu: "Lenguaje para aprender",
    langEnglish: "Inglés",
    langSpanish: "Español",
    langMixed: "Mixto",
    mixedEnEs: "Inglés → Español",
    mixedEsEn: "Español → Inglés",
    tenses: "tiempos",
  },
  en: {
    chooseSubject: "Choose your subject",
    chooseAux: "Choose your auxiliary verb",
    chooseTense: "Choose the tense",
    chooseVerb: "Choose your verb",
    chooseQty: "Choose the quantity",
    chooseColor: "Choose the color",
    chooseObject: "Choose the object",
    generate: "Generate",
    aff: "AFFIRMATIVE",
    neg: "NEGATIVE",
    que: "QUESTION",
    search: "Search verb…",
    regular: "Regular",
    irregular: "Irregular",
    sheetTitle: "Choose a verb",
    homeTitle: "Modules",
    homeSubtitle: "Choose a module to start",
    languageMenu: "Language to learn",
    langEnglish: "English",
    langSpanish: "Spanish",
    langMixed: "Mixed",
    mixedEnEs: "English → Spanish",
    mixedEsEn: "Spanish → English",
    tenses: "tenses",
  },
};

// Module card titles per learning language (shown on Home).
export const MODULE_TITLES: Record<LearnLang, Record<string, string>> = {
  en: {
    "M1.A": "Verbos Básicos",
    "M1.B": "Gerundio (be + -ing)",
    "M2.A": "Tiempos verbales",
    "M2.B": "Tiempos continuos",
    "M3.A": "Verbos regulares",
    "M4.A": "Verbos irregulares",
    "Tita I": "There is / There are",
    "Tita II": "There was / There were",
  },
  es: {
    "M1.A": "Basic verbs",
    "M1.B": "Gerund (estar + -ndo)",
    "M2.A": "Verb tenses",
    "M2.B": "Continuous tenses",
    "M3.A": "Regular verbs",
    "M4.A": "Irregular verbs",
    "Tita I": "Hay (presente)",
    "Tita II": "Había (pasado)",
  },
};
