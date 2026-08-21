import React, { createContext, useContext, useEffect, useState } from "react";
import { storage } from "@/src/utils/storage";

export type LearnLang = "en" | "es";

type Ctx = {
  lang: LearnLang;
  setLang: (l: LearnLang) => void;
  mixed: boolean;
  setMixed: (m: boolean) => void;
};
const LanguageContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  mixed: false,
  setMixed: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LearnLang>("en");
  const [mixed, setMixedState] = useState<boolean>(false);

  useEffect(() => {
    storage.getItem("learnLang", "en").then((v) => {
      if (v === "es" || v === "en") setLangState(v);
    });
    storage.getItem("mixedMode", "false").then((v) => {
      if (v === "true") setMixedState(true);
    });
  }, []);

  const setLang = (l: LearnLang) => {
    setLangState(l);
    storage.setItem("learnLang", l);
  };

  const setMixed = (m: boolean) => {
    setMixedState(m);
    storage.setItem("mixedMode", m ? "true" : "false");
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, mixed, setMixed }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
