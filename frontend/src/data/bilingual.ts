// Mixed Mode helpers. Produces the "reference" translation for a sentence by
// reusing the existing EN / ES conjugation engines. The ONLY extra data needed
// is the cross-language equivalence of subjects and verbs — the grammar itself
// is never duplicated.

import { LearnLang } from "@/src/context/LanguageContext";
import {
  Trio,
  buildM1A,
  buildM1B,
  buildM2B,
  buildTenseGeneralEn,
} from "@/src/data/conjugation";
import {
  buildM1AEs,
  buildM1BEs,
  buildM2BEs,
  buildTenseEs,
} from "@/src/data/conjugation_es";
import { buildTita } from "@/src/data/tita";
import { buildTitaEs } from "@/src/data/tita_es";

export type ModuleId = "m1a" | "m1b" | "m2a" | "m2b" | "m3a" | "m4a";

// ---- Subject equivalence ----
const EN2ES_SUBJ: Record<string, string> = {
  I: "Yo",
  You: "Tú",
  He: "Él",
  She: "Ella",
  It: "Él",
  We: "Nosotros",
  They: "Ellos",
};

const ES2EN_SUBJ: Record<string, string> = {
  Yo: "I",
  Tú: "You",
  Él: "He",
  Ella: "She",
  Nosotros: "We",
  Ellos: "They",
};

// ---- Verb equivalence: English infinitive -> Spanish infinitive ----
const EN2ES_VERB: Record<string, string> = {
  // regular
  add: "añadir", answer: "contestar", apologise: "disculparse", arrest: "arrestar",
  arrive: "llegar", ask: "preguntar", attack: "atacar", believe: "creer",
  boil: "hervir", book: "reservar", borrow: "prestar", carry: "llevar",
  change: "cambiar", chop: "picar", clean: "limpiar", climb: "escalar",
  collect: "coleccionar", compose: "componer", cook: "cocinar", copy: "copiar",
  dance: "bailar", describe: "describir", destroy: "destruir", die: "morir",
  discover: "descubrir", discuss: "discutir", dream: "soñar", dye: "teñir",
  enjoy: "disfrutar", explode: "explotar", extinguish: "extinguir", fry: "freir",
  happen: "pasar", hate: "odiar", help: "ayudar", hire: "contratar",
  hope: "esperar", hunt: "cazar", imagine: "imaginar", invent: "inventar",
  invite: "invitar", jump: "saltar", kill: "matar", lift: "levantar",
  like: "gustar", listen: "escuchar", live: "vivir", look: "mirar",
  love: "amar", miss: "extrañar", offer: "ofrecer", open: "abrir",
  pack: "empacar", pass: "pasar", peel: "pelar", phone: "llamar",
  plan: "planear", play: "jugar", pour: "verter", prefer: "preferir",
  prepare: "preparar", push: "empujar", rain: "llover", reduce: "reducir",
  remember: "recordar", rent: "alquilar", rescue: "rescatar", return: "regresar",
  save: "guardar", scream: "gritar", search: "buscar", skate: "patinar",
  sky: "volar", smell: "oler", snore: "roncar", start: "empezar",
  stay: "quedar", stop: "parar", study: "estudiar", survive: "sobrevivir",
  talk: "hablar", thank: "agradecer", touch: "tocar", try: "intentar",
  use: "usar", visit: "visitar", wait: "esperar", walk: "caminar",
  want: "querer", warn: "advertir", wash: "lavar", watch: "mirar",
  work: "trabajar",
  // irregular
  be: "ser", become: "convertir", begin: "empezar", break: "romper",
  bring: "traer", build: "construir", buy: "comprar", catch: "atrapar",
  come: "venir", cut: "cortar", do: "hacer", draw: "dibujar",
  drink: "beber", drive: "conducir", eat: "comer", fall: "caer",
  feed: "alimentar", feel: "sentir", fight: "pelear", find: "encontrar",
  fly: "volar", forget: "olvidar", freeze: "congelar", give: "dar",
  go: "ir", grow: "crecer", have: "tener", hear: "oir",
  hurt: "lastimar", keep: "guardar", know: "saber", lay: "poner",
  leave: "salir", lend: "prestar", lie: "mentir", lose: "perder",
  make: "hacer", meet: "conocer", pay: "pagar", put: "poner",
  read: "leer", ring: "sonar", run: "correr", say: "decir",
  see: "ver", sell: "vender", send: "enviar", shine: "brillar",
  shoot: "disparar", shut: "cerrar", sing: "cantar", sit: "sentar",
  sleep: "dormir", speak: "hablar", spend: "gastar", steal: "robar",
  swim: "nadar", take: "tomar", teach: "enseñar", tell: "decir",
  think: "pensar", throw: "lanzar", understand: "entender", wear: "llevar",
  win: "ganar", write: "escribir",
  // M2.A invariant extras
  bet: "apostar", broadcast: "transmitir", burst: "estallar", cast: "lanzar",
  cost: "costar", fit: "caber", forecast: "pronosticar", hit: "golpear",
  let: "dejar", miscast: "asignar", offset: "compensar", quit: "renunciar",
  recast: "refundir", reset: "reiniciar", retrofit: "modernizar", set: "colocar",
  shed: "soltar", slid: "deslizar", split: "dividir", spread: "esparcir",
  sublet: "subarrendar", typecast: "encasillar", undercut: "socavar",
  upset: "molestar", wed: "casar", wet: "mojar",
  // M3.A extras
  act: "actuar", beg: "rogar", belong: "pertenecer", brush: "cepillar",
  call: "llamar", charge: "cobrar", close: "cerrar", cry: "llorar",
  dress: "vestir", dry: "secar", explain: "explicar", finish: "terminar",
  follow: "seguir", kiss: "besar", laugh: "reir", marry: "casar",
  promise: "prometer", repeat: "repetir", smile: "sonreir", smoke: "fumar",
  wish: "desear",
  // M4.A extras
  awake: "despertar", bite: "morder", creep: "arrastrar", learn: "aprender",
  light: "encender", shake: "sacudir", strike: "golpear",
};

// ---- Verb equivalence: Spanish infinitive -> English infinitive ----
// Targets are chosen so the general English builder conjugates them correctly.
const ES2EN_VERB: Record<string, string> = {
  hablar: "speak", comer: "eat", vivir: "live", trabajar: "work",
  estudiar: "study", cantar: "sing", bailar: "dance", cocinar: "cook",
  caminar: "walk", escuchar: "listen", comprar: "buy", mirar: "look",
  ayudar: "help", nadar: "swim", saltar: "jump", beber: "drink",
  aprender: "learn", viajar: "travel", lavar: "wash", preguntar: "ask",
  contestar: "answer", necesitar: "need", correr: "run", subir: "climb",
  ser: "be", ir: "go", tener: "have", hacer: "do",
  decir: "say", poder: "can", poner: "put", querer: "want",
  venir: "come", ver: "see", dar: "give", saber: "know",
  salir: "leave", traer: "bring", dormir: "sleep", jugar: "play",
  cortar: "cut", leer: "read",
};

function translateSubject(label: string, to: LearnLang): string {
  return to === "es" ? EN2ES_SUBJ[label] ?? label : ES2EN_SUBJ[label] ?? label;
}

function translateVerb(verb: string, from: LearnLang): string {
  const v = verb.toLowerCase();
  return from === "en" ? EN2ES_VERB[v] ?? v : ES2EN_VERB[v] ?? v;
}

function buildRefEs(id: ModuleId, subj: string, key: string, verb: string): Trio {
  if (id === "m1a") return buildM1AEs(subj, key, verb);
  if (id === "m1b") return buildM1BEs(subj, key, verb);
  if (id === "m2b") return buildM2BEs(subj, key, verb);
  return buildTenseEs(subj, key, verb);
}

function buildRefEn(id: ModuleId, subj: string, key: string, verb: string): Trio {
  if (id === "m1a") return buildM1A(subj, key, verb);
  if (id === "m1b") return buildM1B(subj, key, verb);
  if (id === "m2b") return buildM2B(subj, key, verb);
  return buildTenseGeneralEn(subj, key, verb);
}

export type MixedReference = {
  direction: string; // "EN → ES" | "ES → EN"
  build: (subjectLabel: string, optionKey: string, verb: string) => Trio;
};

// Given the module + the PRIMARY learning language, returns a builder that
// produces the reference sentences in the OTHER language, reusing the engines.
export function makeReference(id: ModuleId, learn: LearnLang): MixedReference {
  const other: LearnLang = learn === "en" ? "es" : "en";
  const direction = learn === "en" ? "EN → ES" : "ES → EN";
  const build = (subjectLabel: string, optionKey: string, verb: string): Trio => {
    const s = translateSubject(subjectLabel, other);
    const v = translateVerb(verb, learn);
    return other === "es"
      ? buildRefEs(id, s, optionKey, v)
      : buildRefEn(id, s, optionKey, v);
  };
  return { direction, build };
}

// ---- Tita (There is/are · There was/were) reference ----
// The Tita engines share objKey + qtyKey across languages; only the color name
// differs (it's referenced by display name), so we map it by index.
const EN2ES_COLOR: Record<string, string> = {
  Blue: "Azul", Green: "Verde", Yellow: "Amarillo", Red: "Rojo", Orange: "Naranja",
};
const ES2EN_COLOR: Record<string, string> = {
  Azul: "Blue", Verde: "Green", Amarillo: "Yellow", Rojo: "Red", Naranja: "Orange",
};

export type TitaReference = {
  direction: string;
  build: (tense: "present" | "past", qtyKey: number, colorName: string, objKey: string) => Trio;
};

export function makeTitaReference(learn: LearnLang): TitaReference {
  const other: LearnLang = learn === "en" ? "es" : "en";
  const direction = learn === "en" ? "EN → ES" : "ES → EN";
  const build = (
    tense: "present" | "past",
    qtyKey: number,
    colorName: string,
    objKey: string,
  ): Trio => {
    if (other === "es") {
      return buildTitaEs(tense, qtyKey, EN2ES_COLOR[colorName] ?? colorName, objKey);
    }
    return buildTita(tense, qtyKey, ES2EN_COLOR[colorName] ?? colorName, objKey);
  };
  return { direction, build };
}
