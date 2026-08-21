// English conjugation engine for modules M1.B, M2.A, M2.B, M3.A, M4.A.
// Produces grammatically correct affirmative / negative / question sentences.

import {
  SUBJECTS,
  AUXILIARIES,
  REGULAR_VERBS,
  IRREGULAR_VERBS,
  Sentence,
} from "./verbs";

export type OptionItem = { key: string; label: string };
export type Trio = { affirmative: Sentence; negative: Sentence; question: Sentence };

// ---- Subject person data ----
type Person = { s3: boolean; be: string; bePast: string; doW: string; have: string };
const PERSON: Record<string, Person> = {
  I: { s3: false, be: "am", bePast: "was", doW: "do", have: "have" },
  You: { s3: false, be: "are", bePast: "were", doW: "do", have: "have" },
  He: { s3: true, be: "is", bePast: "was", doW: "does", have: "has" },
  She: { s3: true, be: "is", bePast: "was", doW: "does", have: "has" },
  It: { s3: true, be: "is", bePast: "was", doW: "does", have: "has" },
  We: { s3: false, be: "are", bePast: "were", doW: "do", have: "have" },
  They: { s3: false, be: "are", bePast: "were", doW: "do", have: "have" },
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const isVowel = (c: string) => "aeiou".includes(c);

function syllables(v: string): number {
  let n = 0;
  let prev = false;
  for (const c of v) {
    const vv = isVowel(c);
    if (vv && !prev) n++;
    prev = vv;
  }
  return n;
}

function isCVC(v: string): boolean {
  if (v.length < 3) return false;
  const a = v[v.length - 3];
  const b = v[v.length - 2];
  const c = v[v.length - 1];
  return !isVowel(a) && isVowel(b) && !isVowel(c) && !"wxy".includes(c);
}

const STRESSED_DOUBLE = new Set([
  "prefer", "refer", "occur", "admit", "permit", "commit", "control",
  "regret", "equip", "begin",
]);

// ---- Spelling helpers ----
export function thirdPerson(v: string): string {
  if (v === "have") return "has";
  if (v === "be") return "is";
  if (/(s|ss|sh|ch|x|z|o)$/.test(v)) return v + "es";
  if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + "ies";
  return v + "s";
}

export function regularPast(v: string): string {
  if (v.endsWith("e")) return v + "d";
  if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + "ied";
  if (isCVC(v) && (syllables(v) === 1 || STRESSED_DOUBLE.has(v))) {
    return v + v[v.length - 1] + "ed";
  }
  return v + "ed";
}

export function gerund(v: string): string {
  if (v === "be") return "being";
  if (v.endsWith("ie")) return v.slice(0, -2) + "ying";
  if (v.endsWith("ee") || v.endsWith("ye") || v.endsWith("oe")) return v + "ing";
  if (v.endsWith("e")) return v.slice(0, -1) + "ing";
  if (isCVC(v) && (syllables(v) === 1 || STRESSED_DOUBLE.has(v))) {
    return v + v[v.length - 1] + "ing";
  }
  return v + "ing";
}

// ---- Verb datasets ----
export const M1A_VERBS = [...REGULAR_VERBS, ...IRREGULAR_VERBS].sort();

export const M2A_VERBS = [
  "bet", "broadcast", "burst", "cast", "cost", "cut", "fit", "forecast", "hit",
  "hurt", "let", "miscast", "offset", "put", "quit", "recast", "reset",
  "retrofit", "set", "shed", "shut", "slid", "split", "spread", "sublet",
  "typecast", "undercut", "upset", "wed", "wet",
];

export const M3A_VERBS = [
  "act", "add", "answer", "arrive", "ask", "beg", "believe", "belong", "brush",
  "call", "change", "charge", "clean", "close", "cook", "cry", "dance", "die",
  "dress", "dry", "enjoy", "explain", "finish", "follow", "happen", "help",
  "hope", "imagine", "kill", "kiss", "laugh", "like", "look", "marry", "miss",
  "open", "play", "prefer", "promise", "rain", "remember", "repeat", "smile",
  "smoke", "stop", "study", "talk", "thank", "touch", "use", "visit", "wait",
  "walk", "want", "wash", "watch", "wish", "work",
];

const IRREGULAR_FORMS: Record<string, { past: string; pp: string }> = {
  be: { past: "was", pp: "been" },
  awake: { past: "awoke", pp: "awoken" },
  become: { past: "became", pp: "become" },
  bite: { past: "bit", pp: "bitten" },
  break: { past: "broke", pp: "broken" },
  bring: { past: "brought", pp: "brought" },
  buy: { past: "bought", pp: "bought" },
  creep: { past: "crept", pp: "crept" },
  do: { past: "did", pp: "done" },
  drink: { past: "drank", pp: "drunk" },
  eat: { past: "ate", pp: "eaten" },
  feel: { past: "felt", pp: "felt" },
  fly: { past: "flew", pp: "flown" },
  forget: { past: "forgot", pp: "forgotten" },
  go: { past: "went", pp: "gone" },
  have: { past: "had", pp: "had" },
  hear: { past: "heard", pp: "heard" },
  know: { past: "knew", pp: "known" },
  lay: { past: "laid", pp: "laid" },
  learn: { past: "learned", pp: "learned" },
  leave: { past: "left", pp: "left" },
  light: { past: "lit", pp: "lit" },
  lose: { past: "lost", pp: "lost" },
  make: { past: "made", pp: "made" },
  pay: { past: "paid", pp: "paid" },
  ring: { past: "rang", pp: "rung" },
  run: { past: "ran", pp: "run" },
  say: { past: "said", pp: "said" },
  see: { past: "saw", pp: "seen" },
  sell: { past: "sold", pp: "sold" },
  send: { past: "sent", pp: "sent" },
  shake: { past: "shook", pp: "shaken" },
  sing: { past: "sang", pp: "sung" },
  sleep: { past: "slept", pp: "slept" },
  smell: { past: "smelled", pp: "smelled" },
  spend: { past: "spent", pp: "spent" },
  steal: { past: "stole", pp: "stolen" },
  strike: { past: "struck", pp: "struck" },
  swim: { past: "swam", pp: "swum" },
  teach: { past: "taught", pp: "taught" },
  understand: { past: "understood", pp: "understood" },
  win: { past: "won", pp: "won" },
};
export const M4A_VERBS = Object.keys(IRREGULAR_FORMS).sort();

// ---- Option lists ----
export const AUX_OPTIONS: OptionItem[] = AUXILIARIES.map((a) => ({
  key: a.label,
  label: a.label,
}));

export const TENSES: OptionItem[] = [
  { key: "sp", label: "Presente\nsimple" },
  { key: "pa", label: "Pasado\nsimple" },
  { key: "pp", label: "Presente\nperfecto" },
  { key: "pap", label: "Pasado\nperfecto" },
];

export const TENSES_PROG: OptionItem[] = [
  { key: "sp", label: "Presente\ncontinuo" },
  { key: "pa", label: "Pasado\ncontinuo" },
  { key: "pp", label: "Pres. perf.\ncontinuo" },
  { key: "pap", label: "Pas. perf.\ncontinuo" },
];

// ---- Sentence builders ----
function s(pre: string, hl: string, post: string): Sentence {
  return { pre, hl, post, full: `${pre}${hl}${post}` };
}

function qsubjOf(label: string): string {
  return label === "I" ? "I" : label.toLowerCase();
}

// M1.A — modal auxiliary + base verb
export function buildM1A(subjLabel: string, auxKey: string, verb: string): Trio {
  const aux = AUXILIARIES.find((a) => a.label === auxKey)!;
  const q = qsubjOf(subjLabel);
  return {
    affirmative: s(`${subjLabel} `, aux.label.toLowerCase(), ` ${verb}.`),
    negative: s(`${subjLabel} `, aux.neg, ` ${verb}.`),
    question: s("", aux.label, ` ${q} ${verb}?`),
  };
}

// M1.B — modal auxiliary + be + gerund
export function buildM1B(subjLabel: string, auxKey: string, verb: string): Trio {
  const aux = AUXILIARIES.find((a) => a.label === auxKey)!;
  const g = gerund(verb);
  const q = qsubjOf(subjLabel);
  return {
    affirmative: s(`${subjLabel} `, aux.label.toLowerCase(), ` be ${g}.`),
    negative: s(`${subjLabel} `, aux.neg, ` be ${g}.`),
    question: s("", aux.label, ` ${q} be ${g}?`),
  };
}

// Non-progressive tenses (M2.A invariant, M3.A regular, M4.A irregular)
function buildTense(
  subjLabel: string,
  tenseKey: string,
  base: string,
  past: string,
  pp: string,
): Trio {
  const p = PERSON[subjLabel];
  const q = qsubjOf(subjLabel);
  const isBe = base === "be";

  if (tenseKey === "sp") {
    if (isBe) {
      return {
        affirmative: s(`${subjLabel} `, p.be, "."),
        negative: s(`${subjLabel} `, `${p.be} not`, "."),
        question: s("", cap(p.be), ` ${q}?`),
      };
    }
    const vw = p.s3 ? thirdPerson(base) : base;
    return {
      affirmative: s(`${subjLabel} `, vw, "."),
      negative: s(`${subjLabel} `, `${p.doW} not ${base}`, "."),
      question: s("", cap(p.doW), ` ${q} ${base}?`),
    };
  }

  if (tenseKey === "pa") {
    if (isBe) {
      return {
        affirmative: s(`${subjLabel} `, p.bePast, "."),
        negative: s(`${subjLabel} `, `${p.bePast} not`, "."),
        question: s("", cap(p.bePast), ` ${q}?`),
      };
    }
    return {
      affirmative: s(`${subjLabel} `, past, "."),
      negative: s(`${subjLabel} `, `did not ${base}`, "."),
      question: s("", "Did", ` ${q} ${base}?`),
    };
  }

  const ppf = isBe ? "been" : pp;
  if (tenseKey === "pp") {
    return {
      affirmative: s(`${subjLabel} `, `${p.have} ${ppf}`, "."),
      negative: s(`${subjLabel} `, `${p.have} not ${ppf}`, "."),
      question: s("", cap(p.have), ` ${q} ${ppf}?`),
    };
  }
  // pap
  return {
    affirmative: s(`${subjLabel} `, `had ${ppf}`, "."),
    negative: s(`${subjLabel} `, `had not ${ppf}`, "."),
    question: s("", "Had", ` ${q} ${ppf}?`),
  };
}

// Progressive tenses (M2.B) — be + gerund
function buildTenseProgressive(subjLabel: string, tenseKey: string, verb: string): Trio {
  const p = PERSON[subjLabel];
  const q = qsubjOf(subjLabel);
  const g = gerund(verb);

  if (tenseKey === "sp") {
    return {
      affirmative: s(`${subjLabel} `, p.be, ` ${g}.`),
      negative: s(`${subjLabel} `, `${p.be} not`, ` ${g}.`),
      question: s("", cap(p.be), ` ${q} ${g}?`),
    };
  }
  if (tenseKey === "pa") {
    return {
      affirmative: s(`${subjLabel} `, p.bePast, ` ${g}.`),
      negative: s(`${subjLabel} `, `${p.bePast} not`, ` ${g}.`),
      question: s("", cap(p.bePast), ` ${q} ${g}?`),
    };
  }
  if (tenseKey === "pp") {
    return {
      affirmative: s(`${subjLabel} `, `${p.have} been`, ` ${g}.`),
      negative: s(`${subjLabel} `, `${p.have} not been`, ` ${g}.`),
      question: s("", cap(p.have), ` ${q} been ${g}?`),
    };
  }
  // pap
  return {
    affirmative: s(`${subjLabel} `, "had been", ` ${g}.`),
    negative: s(`${subjLabel} `, "had not been", ` ${g}.`),
    question: s("", "Had", ` ${q} been ${g}?`),
  };
}

// Module-specific builders (verb form resolution baked in)
export function buildM2A(subjLabel: string, tenseKey: string, verb: string): Trio {
  return buildTense(subjLabel, tenseKey, verb, verb, verb); // invariant
}
export function buildM3A(subjLabel: string, tenseKey: string, verb: string): Trio {
  const past = regularPast(verb);
  return buildTense(subjLabel, tenseKey, verb, past, past);
}
export function buildM4A(subjLabel: string, tenseKey: string, verb: string): Trio {
  const f = IRREGULAR_FORMS[verb];
  return buildTense(subjLabel, tenseKey, verb, f.past, f.pp);
}
export function buildM2B(subjLabel: string, tenseKey: string, verb: string): Trio {
  return buildTenseProgressive(subjLabel, tenseKey, verb);
}

// ---- General-purpose English tense builder (used for Mixed Mode reference) ----
// Correctly conjugates ANY verb regardless of module category by resolving its
// forms from the irregular DB, an extra irregular set, an invariant set, or the
// regular spelling rules.
const EXTRA_IRREGULAR_EN: Record<string, { past: string; pp: string }> = {
  speak: { past: "spoke", pp: "spoken" },
  come: { past: "came", pp: "come" },
  give: { past: "gave", pp: "given" },
  take: { past: "took", pp: "taken" },
  get: { past: "got", pp: "gotten" },
  write: { past: "wrote", pp: "written" },
  drive: { past: "drove", pp: "driven" },
  ride: { past: "rode", pp: "ridden" },
  meet: { past: "met", pp: "met" },
  begin: { past: "began", pp: "begun" },
  choose: { past: "chose", pp: "chosen" },
  sit: { past: "sat", pp: "sat" },
  stand: { past: "stood", pp: "stood" },
  fall: { past: "fell", pp: "fallen" },
  find: { past: "found", pp: "found" },
  keep: { past: "kept", pp: "kept" },
  build: { past: "built", pp: "built" },
  catch: { past: "caught", pp: "caught" },
  fight: { past: "fought", pp: "fought" },
  think: { past: "thought", pp: "thought" },
  bring: { past: "brought", pp: "brought" },
  wear: { past: "wore", pp: "worn" },
  throw: { past: "threw", pp: "thrown" },
  grow: { past: "grew", pp: "grown" },
  draw: { past: "drew", pp: "drawn" },
  fly: { past: "flew", pp: "flown" },
  feel: { past: "felt", pp: "felt" },
  leave: { past: "left", pp: "left" },
  lose: { past: "lost", pp: "lost" },
  pay: { past: "paid", pp: "paid" },
  sell: { past: "sold", pp: "sold" },
  tell: { past: "told", pp: "told" },
  send: { past: "sent", pp: "sent" },
  spend: { past: "spent", pp: "spent" },
  sleep: { past: "slept", pp: "slept" },
  teach: { past: "taught", pp: "taught" },
  understand: { past: "understood", pp: "understood" },
  win: { past: "won", pp: "won" },
  hear: { past: "heard", pp: "heard" },
};

const INVARIANT_EN = new Set([
  "cut", "put", "hit", "set", "cost", "let", "shut", "bet", "hurt", "read",
  "spread", "split", "quit", "wet", "wed", "shed", "burst", "cast", "fit",
  "broadcast", "forecast", "offset", "upset", "undercut", "sublet", "recast",
  "reset", "retrofit", "miscast", "typecast",
]);

export function buildTenseGeneralEn(subjLabel: string, tenseKey: string, verb: string): Trio {
  if (verb === "be") return buildTense(subjLabel, tenseKey, "be", "was", "been");

  let past: string;
  let pp: string;
  if (INVARIANT_EN.has(verb)) {
    past = verb;
    pp = verb;
  } else {
    const irr = IRREGULAR_FORMS[verb] ?? EXTRA_IRREGULAR_EN[verb];
    if (irr) {
      past = irr.past;
      pp = irr.pp;
    } else {
      past = regularPast(verb);
      pp = regularPast(verb);
    }
  }
  return buildTense(subjLabel, tenseKey, verb, past, pp);
}

export { SUBJECTS };
