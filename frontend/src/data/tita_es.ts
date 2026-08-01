// Spanish data + grammar for Tita I (Hay) and Tita II (Había).
import { Sentence } from "./verbs";
import { Trio } from "./conjugation";
import { Categoria, CATEGORIES } from "./tita";

export { CATEGORIES };
export type { Categoria };

export const QUANTITIES_ES = [
  { key: 1, label: "Uno" },
  { key: 2, label: "Dos" },
  { key: 3, label: "Tres" },
  { key: 4, label: "Cuatro" },
  { key: 5, label: "Cinco" },
  { key: 6, label: "Seis" },
  { key: 7, label: "Siete" },
  { key: 8, label: "Ocho" },
];
const NUM_WORD = ["", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho"];

export type ColorEs = { name: string; hex: string; ms: string; fs: string; mp: string; fp: string };
export const COLORS_ES: ColorEs[] = [
  { name: "Azul", hex: "#4A7DF0", ms: "azul", fs: "azul", mp: "azules", fp: "azules" },
  { name: "Verde", hex: "#22B573", ms: "verde", fs: "verde", mp: "verdes", fp: "verdes" },
  { name: "Amarillo", hex: "#F5C518", ms: "amarillo", fs: "amarilla", mp: "amarillos", fp: "amarillas" },
  { name: "Rojo", hex: "#F0574A", ms: "rojo", fs: "roja", mp: "rojos", fp: "rojas" },
  { name: "Naranja", hex: "#F5A623", ms: "naranja", fs: "naranja", mp: "naranjas", fp: "naranjas" },
];

export type ObjEs = {
  key: string;
  label: string;
  emoji: string;
  gender: "m" | "f";
  sing: string;
  plur: string;
  category: Categoria;
};
export const OBJECTS_ES: ObjEs[] = [
  { key: "apple", label: "Manzana", emoji: "🍎", gender: "f", sing: "manzana", plur: "manzanas", category: "Fruits" },
  { key: "orange", label: "Naranja", emoji: "🍊", gender: "f", sing: "naranja", plur: "naranjas", category: "Fruits" },
  { key: "peach", label: "Durazno", emoji: "🍑", gender: "m", sing: "durazno", plur: "duraznos", category: "Fruits" },
  { key: "carrot", label: "Zanahoria", emoji: "🥕", gender: "f", sing: "zanahoria", plur: "zanahorias", category: "Vegetables" },
  { key: "onion", label: "Cebolla", emoji: "🧅", gender: "f", sing: "cebolla", plur: "cebollas", category: "Vegetables" },
  { key: "garlic", label: "Ajo", emoji: "🧄", gender: "m", sing: "ajo", plur: "ajos", category: "Vegetables" },
  { key: "tomato", label: "Tomate", emoji: "🍅", gender: "m", sing: "tomate", plur: "tomates", category: "Vegetables" },
  { key: "square", label: "Cuadrado", emoji: "🟦", gender: "m", sing: "cuadrado", plur: "cuadrados", category: "Shapes" },
  { key: "triangle", label: "Triángulo", emoji: "🔺", gender: "m", sing: "triángulo", plur: "triángulos", category: "Shapes" },
  { key: "circle", label: "Círculo", emoji: "🔵", gender: "m", sing: "círculo", plur: "círculos", category: "Shapes" },
  { key: "cat", label: "Gato", emoji: "🐱", gender: "m", sing: "gato", plur: "gatos", category: "Animals" },
  { key: "dog", label: "Perro", emoji: "🐶", gender: "m", sing: "perro", plur: "perros", category: "Animals" },
  { key: "fish", label: "Pez", emoji: "🐟", gender: "m", sing: "pez", plur: "peces", category: "Animals" },
  { key: "turtle", label: "Tortuga", emoji: "🐢", gender: "f", sing: "tortuga", plur: "tortugas", category: "Animals" },
  { key: "ear", label: "Oreja", emoji: "👂", gender: "f", sing: "oreja", plur: "orejas", category: "Senses" },
  { key: "eye", label: "Ojo", emoji: "👁️", gender: "m", sing: "ojo", plur: "ojos", category: "Senses" },
  { key: "hand", label: "Mano", emoji: "✋", gender: "f", sing: "mano", plur: "manos", category: "Senses" },
  { key: "nose", label: "Nariz", emoji: "👃", gender: "f", sing: "nariz", plur: "narices", category: "Senses" },
  { key: "mouth", label: "Boca", emoji: "👄", gender: "f", sing: "boca", plur: "bocas", category: "Senses" },
];

const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const sen = (pre: string, hl: string, post: string): Sentence => ({ pre, hl, post, full: `${pre}${hl}${post}` });

export function buildTitaEs(
  tense: "present" | "past",
  qtyKey: number,
  colorName: string,
  objKey: string,
): Trio {
  const obj = OBJECTS_ES.find((o) => o.key === objKey)!;
  const color = COLORS_ES.find((c) => c.name === colorName)!;
  const singular = qtyKey === 1;
  const fem = obj.gender === "f";

  const num = singular ? (fem ? "una" : "un") : NUM_WORD[qtyKey];
  const noun = singular ? obj.sing : obj.plur;
  const colorForm = singular ? (fem ? color.fs : color.ms) : (fem ? color.fp : color.mp);
  const exist = tense === "present" ? "hay" : "había";

  const tail = ` ${num} ${noun} ${colorForm}`;
  return {
    affirmative: sen("", capFirst(exist), `${tail}.`),
    negative: sen("", `No ${exist}`, `${tail}.`),
    question: sen("¿", capFirst(exist), `${tail}?`),
  };
}
