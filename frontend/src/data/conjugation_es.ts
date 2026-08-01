// Spanish conjugation engine + datasets + builders for all modules (learn = "es").
// Persons index: 0=yo, 1=tú, 2=él/ella/ello, 3=nosotros, 4=ellos.

import { Sentence } from "./verbs";
import { OptionItem, Trio } from "./conjugation";

export type EsSubject = { label: string; emoji: string };
export const SUBJECTS_ES: EsSubject[] = [
  { label: "Yo", emoji: "🧒" },
  { label: "Tú", emoji: "🧑" },
  { label: "Él", emoji: "👦" },
  { label: "Ella", emoji: "👧" },
  { label: "Ello", emoji: "🐱" },
  { label: "Nosotros", emoji: "👨‍👩‍👦" },
  { label: "Ellos", emoji: "👥" },
];

const PERSON_ES: Record<string, number> = {
  Yo: 0, Tú: 1, Él: 2, Ella: 2, Ello: 2, Nosotros: 3, Ellos: 4,
};

const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const sen = (pre: string, hl: string, post: string): Sentence => ({
  pre, hl, post, full: `${pre}${hl}${post}`,
});

// ---- Regular conjugation ----
const stemOf = (inf: string) => inf.slice(0, -2);
const endOf = (inf: string) => inf.slice(-2);
const endsVowel = (s: string) => /[aeiouáéíóú]$/.test(s);

function regPres(inf: string): string[] {
  const s = stemOf(inf), e = endOf(inf);
  if (e === "ar") return [s + "o", s + "as", s + "a", s + "amos", s + "an"];
  if (e === "er") return [s + "o", s + "es", s + "e", s + "emos", s + "en"];
  return [s + "o", s + "es", s + "e", s + "imos", s + "en"];
}
function regPret(inf: string): string[] {
  const s = stemOf(inf), e = endOf(inf);
  if (e === "ar") {
    let yo = s + "é";
    if (inf.endsWith("car")) yo = s.slice(0, -1) + "qué";
    else if (inf.endsWith("gar")) yo = s.slice(0, -1) + "gué";
    else if (inf.endsWith("zar")) yo = s.slice(0, -1) + "cé";
    return [yo, s + "aste", s + "ó", s + "amos", s + "aron"];
  }
  if (endsVowel(s)) return [s + "í", s + "íste", s + "yó", s + "ímos", s + "yeron"];
  return [s + "í", s + "iste", s + "ió", s + "imos", s + "ieron"];
}
function regPart(inf: string): string {
  const s = stemOf(inf), e = endOf(inf);
  if (e === "ar") return s + "ado";
  return (endsVowel(s) ? s + "ído" : s + "ido");
}
function regGer(inf: string): string {
  const s = stemOf(inf), e = endOf(inf);
  if (e === "ar") return s + "ando";
  return (endsVowel(s) ? s + "yendo" : s + "iendo");
}

// ---- Irregular database ----
type EsForms = { pres?: string[]; pret?: string[]; part?: string; ger?: string };
const IRREGULAR_ES: Record<string, EsForms> = {
  ser: { pres: ["soy", "eres", "es", "somos", "son"], pret: ["fui", "fuiste", "fue", "fuimos", "fueron"], part: "sido", ger: "siendo" },
  ir: { pres: ["voy", "vas", "va", "vamos", "van"], pret: ["fui", "fuiste", "fue", "fuimos", "fueron"], part: "ido", ger: "yendo" },
  tener: { pres: ["tengo", "tienes", "tiene", "tenemos", "tienen"], pret: ["tuve", "tuviste", "tuvo", "tuvimos", "tuvieron"], part: "tenido", ger: "teniendo" },
  hacer: { pres: ["hago", "haces", "hace", "hacemos", "hacen"], pret: ["hice", "hiciste", "hizo", "hicimos", "hicieron"], part: "hecho", ger: "haciendo" },
  decir: { pres: ["digo", "dices", "dice", "decimos", "dicen"], pret: ["dije", "dijiste", "dijo", "dijimos", "dijeron"], part: "dicho", ger: "diciendo" },
  poder: { pres: ["puedo", "puedes", "puede", "podemos", "pueden"], pret: ["pude", "pudiste", "pudo", "pudimos", "pudieron"], part: "podido", ger: "pudiendo" },
  poner: { pres: ["pongo", "pones", "pone", "ponemos", "ponen"], pret: ["puse", "pusiste", "puso", "pusimos", "pusieron"], part: "puesto", ger: "poniendo" },
  querer: { pres: ["quiero", "quieres", "quiere", "queremos", "quieren"], pret: ["quise", "quisiste", "quiso", "quisimos", "quisieron"], part: "querido", ger: "queriendo" },
  venir: { pres: ["vengo", "vienes", "viene", "venimos", "vienen"], pret: ["vine", "viniste", "vino", "vinimos", "vinieron"], part: "venido", ger: "viniendo" },
  ver: { pres: ["veo", "ves", "ve", "vemos", "ven"], pret: ["vi", "viste", "vio", "vimos", "vieron"], part: "visto", ger: "viendo" },
  dar: { pres: ["doy", "das", "da", "damos", "dan"], pret: ["di", "diste", "dio", "dimos", "dieron"], part: "dado", ger: "dando" },
  saber: { pres: ["sé", "sabes", "sabe", "sabemos", "saben"], pret: ["supe", "supiste", "supo", "supimos", "supieron"], part: "sabido", ger: "sabiendo" },
  salir: { pres: ["salgo", "sales", "sale", "salimos", "salen"], pret: ["salí", "saliste", "salió", "salimos", "salieron"], part: "salido", ger: "saliendo" },
  traer: { pres: ["traigo", "traes", "trae", "traemos", "traen"], pret: ["traje", "trajiste", "trajo", "trajimos", "trajeron"], part: "traído", ger: "trayendo" },
  dormir: { pres: ["duermo", "duermes", "duerme", "dormimos", "duermen"], pret: ["dormí", "dormiste", "durmió", "dormimos", "durmieron"], part: "dormido", ger: "durmiendo" },
  jugar: { pres: ["juego", "juegas", "juega", "jugamos", "juegan"], pret: ["jugué", "jugaste", "jugó", "jugamos", "jugaron"], part: "jugado", ger: "jugando" },
};

type Forms = { pres: string[]; pret: string[]; part: string; ger: string };
function getForms(inf: string): Forms {
  const irr = IRREGULAR_ES[inf];
  return {
    pres: irr?.pres ?? regPres(inf),
    pret: irr?.pret ?? regPret(inf),
    part: irr?.part ?? regPart(inf),
    ger: irr?.ger ?? regGer(inf),
  };
}

// ---- Auxiliaries (fixed) ----
const HABER_PRES = ["he", "has", "ha", "hemos", "han"];
const HABER_IMPF = ["había", "habías", "había", "habíamos", "habían"];
const ESTAR_PRES = ["estoy", "estás", "está", "estamos", "están"];
const ESTAR_IMPF = ["estaba", "estabas", "estaba", "estábamos", "estaban"];

const poderPres = ["puedo", "puedes", "puede", "podemos", "pueden"];
const poderCond = ["podría", "podrías", "podría", "podríamos", "podrían"];
const deberPres = ["debo", "debes", "debe", "debemos", "deben"];
const deberCond = ["debería", "deberías", "debería", "deberíamos", "deberían"];
const quererCond = ["querría", "querrías", "querría", "querríamos", "querrían"];
const irPres = ["voy", "vas", "va", "vamos", "van"];

const MODAL_ES: Record<string, { conj: string[]; will?: boolean }> = {
  Can: { conj: poderPres },
  Could: { conj: poderCond },
  Would: { conj: quererCond },
  Should: { conj: deberCond },
  May: { conj: poderPres },
  Might: { conj: poderCond },
  Must: { conj: deberPres },
  Will: { conj: irPres, will: true },
};

// ---- Datasets ----
export const ES_REGULAR = [
  "hablar", "comer", "vivir", "trabajar", "estudiar", "cantar", "bailar",
  "cocinar", "caminar", "escuchar", "comprar", "mirar", "ayudar", "nadar",
  "saltar", "beber", "aprender", "viajar", "lavar", "preguntar", "contestar",
  "necesitar", "correr", "subir",
].sort();

export const ES_IRREGULAR = [
  "ser", "ir", "tener", "hacer", "decir", "poder", "poner", "querer", "venir",
  "ver", "dar", "saber", "salir", "traer", "dormir", "jugar",
].sort();

export const ES_MIX = [
  "hablar", "comer", "vivir", "tener", "hacer", "ir", "ser", "ver", "poder",
  "querer", "decir", "dar",
].sort();

export const ES_VERBS = [
  "cortar", "hablar", "comer", "vivir", "trabajar", "estudiar", "cantar",
  "bailar", "cocinar", "caminar", "comprar", "nadar", "saltar", "beber",
  "aprender", "jugar", "dormir", "tener", "hacer", "decir", "poder", "querer",
  "ver", "dar", "ir", "ser", "salir", "leer",
].sort();

// ---- Builders ----
export function buildTenseEs(label: string, tenseKey: string, inf: string): Trio {
  const p = PERSON_ES[label];
  const f = getForms(inf);
  const qsub = label.toLowerCase();
  let vp: string;
  if (tenseKey === "sp") vp = f.pres[p];
  else if (tenseKey === "pa") vp = f.pret[p];
  else if (tenseKey === "pp") vp = `${HABER_PRES[p]} ${f.part}`;
  else vp = `${HABER_IMPF[p]} ${f.part}`;
  return {
    affirmative: sen(`${label} `, vp, "."),
    negative: sen(`${label} `, `no ${vp}`, "."),
    question: sen("¿", capFirst(vp), ` ${qsub}?`),
  };
}

export function buildM1AEs(label: string, auxKey: string, inf: string): Trio {
  const p = PERSON_ES[label];
  const m = MODAL_ES[auxKey];
  const mc = m.conj[p];
  const qsub = label.toLowerCase();
  const mid = m.will ? " a " : " ";
  return {
    affirmative: sen(`${label} `, mc, `${mid}${inf}.`),
    negative: sen(`${label} `, `no ${mc}`, `${mid}${inf}.`),
    question: sen("¿", capFirst(mc), ` ${qsub}${mid}${inf}?`),
  };
}

export function buildM1BEs(label: string, auxKey: string, inf: string): Trio {
  const p = PERSON_ES[label];
  const m = MODAL_ES[auxKey];
  const mc = m.conj[p];
  const g = getForms(inf).ger;
  const qsub = label.toLowerCase();
  const mid = m.will ? " a estar " : " estar ";
  return {
    affirmative: sen(`${label} `, mc, `${mid}${g}.`),
    negative: sen(`${label} `, `no ${mc}`, `${mid}${g}.`),
    question: sen("¿", capFirst(mc), ` ${qsub}${mid}${g}?`),
  };
}

export function buildM2BEs(label: string, tenseKey: string, inf: string): Trio {
  const p = PERSON_ES[label];
  const g = getForms(inf).ger;
  const qsub = label.toLowerCase();
  let vp: string;
  if (tenseKey === "sp") vp = ESTAR_PRES[p];
  else if (tenseKey === "pa") vp = ESTAR_IMPF[p];
  else if (tenseKey === "pp") vp = `${HABER_PRES[p]} estado`;
  else vp = `${HABER_IMPF[p]} estado`;
  return {
    affirmative: sen(`${label} `, vp, ` ${g}.`),
    negative: sen(`${label} `, `no ${vp}`, ` ${g}.`),
    question: sen("¿", capFirst(vp), ` ${qsub} ${g}?`),
  };
}

// Tense option labels in Spanish content are the same keys; labels provided by i18n/config.
export const TENSES_ES: OptionItem[] = [
  { key: "sp", label: "Presente" },
  { key: "pa", label: "Pretérito" },
  { key: "pp", label: "Pretérito\nperfecto" },
  { key: "pap", label: "Pluscuam-\nperfecto" },
];

export const TENSES_PROG_ES: OptionItem[] = [
  { key: "sp", label: "Presente\ncontinuo" },
  { key: "pa", label: "Pasado\ncontinuo" },
  { key: "pp", label: "Perfecto\ncontinuo" },
  { key: "pap", label: "Plusc.\ncontinuo" },
];
