import { LearnLang } from "@/src/context/LanguageContext";
import { STRINGS, uiLangOf, MODULE_TITLES } from "@/src/i18n";
import { PracticeConfig } from "@/src/components/PracticeScreen";
import { colors } from "@/src/theme";

import { SUBJECTS, REGULAR_VERBS, IRREGULAR_VERBS } from "@/src/data/verbs";
import {
  AUX_OPTIONS, TENSES, TENSES_PROG,
  buildM1A, buildM1B, buildM2A, buildM2B, buildM3A, buildM4A,
  M1A_VERBS, M2A_VERBS, M3A_VERBS, M4A_VERBS,
} from "@/src/data/conjugation";
import {
  SUBJECTS_ES, TENSES_ES, TENSES_PROG_ES, AUX_OPTIONS_ES,
  buildM1AEs, buildM1BEs, buildM2BEs, buildTenseEs,
  ES_VERBS, ES_REGULAR, ES_IRREGULAR, ES_MIX,
} from "@/src/data/conjugation_es";

type Id = "m1a" | "m1b" | "m2a" | "m2b" | "m3a" | "m4a";

const CODE: Record<Id, string> = {
  m1a: "M1.A", m1b: "M1.B", m2a: "M2.A", m2b: "M2.B", m3a: "M3.A", m4a: "M4.A",
};
const NUM: Record<Id, number> = { m1a: 1, m1b: 1, m2a: 2, m2b: 2, m3a: 3, m4a: 4 };
const ACCENT: Record<Id, string> = {
  m1a: colors.affirmative, m1b: colors.affirmative,
  m2a: "#8B5CF6", m2b: "#F0654A", m3a: "#8B5CF6", m4a: "#22B573",
};

export function getPracticeConfig(id: Id, learn: LearnLang): PracticeConfig {
  const ui = uiLangOf(learn);
  const t = STRINGS[ui];
  const es = learn === "es";
  const subjects = es ? SUBJECTS_ES : SUBJECTS;
  const moduleLabel = (ui === "es" ? "MÓDULO " : "MODULE ") + NUM[id];
  const title = MODULE_TITLES[learn][CODE[id]];

  const tense = (b: (l: string, k: string, v: string) => any) => b;

  switch (id) {
    case "m1a":
      return {
        moduleLabel, title, t, subjects,
        optionTitle: t.chooseAux, options: es ? AUX_OPTIONS_ES : AUX_OPTIONS, optionItemWidth: 94, optionAccent: ACCENT.m1a,
        ...(es
          ? { verbs: ES_VERBS, defaultVerb: "cortar", build: buildM1AEs }
          : { divided: { regular: REGULAR_VERBS, irregular: IRREGULAR_VERBS }, defaultVerb: "cut", build: buildM1A }),
      };
    case "m1b":
      return {
        moduleLabel, title, t, subjects,
        optionTitle: t.chooseAux, options: es ? AUX_OPTIONS_ES : AUX_OPTIONS, optionItemWidth: 94, optionAccent: ACCENT.m1b,
        verbs: es ? ES_VERBS : M1A_VERBS,
        defaultVerb: es ? "cortar" : "add",
        build: es ? buildM1BEs : buildM1B,
      };
    case "m2a":
      return {
        moduleLabel, title, t, subjects,
        optionTitle: t.chooseTense, options: es ? TENSES_ES : TENSES, optionItemWidth: 120, optionAccent: ACCENT.m2a,
        verbs: es ? ES_MIX : M2A_VERBS,
        defaultVerb: es ? "hablar" : "hit",
        build: es ? tense(buildTenseEs) : buildM2A,
      };
    case "m2b":
      return {
        moduleLabel, title, t, subjects,
        optionTitle: t.chooseTense, options: es ? TENSES_PROG_ES : TENSES_PROG, optionItemWidth: 120, optionAccent: ACCENT.m2b,
        verbs: es ? ES_VERBS : M1A_VERBS,
        defaultVerb: es ? "cortar" : "add",
        build: es ? buildM2BEs : buildM2B,
      };
    case "m3a":
      return {
        moduleLabel, title, t, subjects,
        optionTitle: t.chooseTense, options: es ? TENSES_ES : TENSES, optionItemWidth: 120, optionAccent: ACCENT.m3a,
        verbs: es ? ES_REGULAR : M3A_VERBS,
        defaultVerb: es ? "hablar" : "believe",
        build: es ? tense(buildTenseEs) : buildM3A,
      };
    case "m4a":
      return {
        moduleLabel, title, t, subjects,
        optionTitle: t.chooseTense, options: es ? TENSES_ES : TENSES, optionItemWidth: 120, optionAccent: ACCENT.m4a,
        verbs: es ? ES_IRREGULAR : M4A_VERBS,
        defaultVerb: es ? "tener" : "awake",
        build: es ? tense(buildTenseEs) : buildM4A,
      };
  }
}
