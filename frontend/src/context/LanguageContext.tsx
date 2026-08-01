import React, { createContext, useContext, useEffect, useState } from "react";
import { storage } from "@/src/utils/storage";

export type LearnLang = "en" | "es";

type Ctx = { lang: LearnLang; setLang: (l: LearnLang) => void };
const LanguageContext = createContext<Ctx>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LearnLang>("en");

  useEffect(() => {
    storage.getItem("learnLang", "en").then((v) => {
      if (v === "es" || v === "en") setLangState(v);
    });
  }, []);

  const setLang = (l: LearnLang) => {
    setLangState(l);
    storage.setItem("learnLang", l);
  };

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
