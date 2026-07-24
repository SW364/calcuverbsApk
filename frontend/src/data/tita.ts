// Data + grammar for Tita I (present) and Tita II (past).
// Structures: There is/are (present), There was/were (past).
// Quantity selects singular (One) vs plural (Two+). Number is NOT shown in the sentence.

import { Sentence } from "./verbs";

export type Trio = { affirmative: Sentence; negative: Sentence; question: Sentence };

export type Quantity = { key: number; label: string };
export const QUANTITIES: Quantity[] = [
  { key: 1, label: "One" },
  { key: 2, label: "Two" },
  { key: 3, label: "Three" },
  { key: 4, label: "Four" },
  { key: 5, label: "Five" },
  { key: 6, label: "Six" },
  { key: 7, label: "Seven" },
  { key: 8, label: "Eight" },
];

export type Color = { name: string; hex: string };
export const COLORS: Color[] = [
  { name: "Blue", hex: "#4A7DF0" },
  { name: "Green", hex: "#22B573" },
  { name: "Yellow", hex: "#F5C518" },
  { name: "Red", hex: "#F0574A" },
  { name: "Orange", hex: "#F5A623" },
];

export type Categoria = "Fruits" | "Vegetables" | "Shapes" | "Animals" | "Senses";
export const CATEGORIES: Categoria[] = ["Fruits", "Vegetables", "Shapes", "Animals", "Senses"];

export type Obj = {
  key: string;
  label: string; // display (singular, capitalized)
  emoji: string;
  singular: string; // lowercase noun
  plural: string; // lowercase plural
  category: Categoria;
};

export const OBJECTS: Obj[] = [
  { key: "apple", label: "Apple", emoji: "🍎", singular: "apple", plural: "apples", category: "Fruits" },
  { key: "orange", label: "Orange", emoji: "🍊", singular: "orange", plural: "oranges", category: "Fruits" },
  { key: "peach", label: "Peach", emoji: "🍑", singular: "peach", plural: "peaches", category: "Fruits" },
  { key: "carrot", label: "Carrot", emoji: "🥕", singular: "carrot", plural: "carrots", category: "Vegetables" },
  { key: "onion", label: "Onion", emoji: "🧅", singular: "onion", plural: "onions", category: "Vegetables" },
  { key: "garlic", label: "Garlic", emoji: "🧄", singular: "garlic", plural: "garlics", category: "Vegetables" },
  { key: "tomato", label: "Tomato", emoji: "🍅", singular: "tomato", plural: "tomatoes", category: "Vegetables" },
  { key: "square", label: "Square", emoji: "🟦", singular: "square", plural: "squares", category: "Shapes" },
  { key: "triangle", label: "Triangle", emoji: "🔺", singular: "triangle", plural: "triangles", category: "Shapes" },
  { key: "circle", label: "Circle", emoji: "🔵", singular: "circle", plural: "circles", category: "Shapes" },
  { key: "cat", label: "Cat", emoji: "🐱", singular: "cat", plural: "cats", category: "Animals" },
  { key: "dog", label: "Dog", emoji: "🐶", singular: "dog", plural: "dogs", category: "Animals" },
  { key: "fish", label: "Fish", emoji: "🐟", singular: "fish", plural: "fish", category: "Animals" },
  { key: "turtle", label: "Turtle", emoji: "🐢", singular: "turtle", plural: "turtles", category: "Animals" },
  { key: "ear", label: "Ear", emoji: "👂", singular: "ear", plural: "ears", category: "Senses" },
  { key: "eye", label: "Eye", emoji: "👁️", singular: "eye", plural: "eyes", category: "Senses" },
  { key: "hand", label: "Hand", emoji: "✋", singular: "hand", plural: "hands", category: "Senses" },
  { key: "nose", label: "Nose", emoji: "👃", singular: "nose", plural: "noses", category: "Senses" },
  { key: "mouth", label: "Mouth", emoji: "👄", singular: "mouth", plural: "mouths", category: "Senses" },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const sen = (pre: string, hl: string, post: string): Sentence => ({
  pre,
  hl,
  post,
  full: `${pre}${hl}${post}`,
});

export function buildTita(
  tense: "present" | "past",
  qtyKey: number,
  colorName: string,
  objKey: string,
): Trio {
  const obj = OBJECTS.find((o) => o.key === objKey)!;
  const quantity = QUANTITIES.find((q) => q.key === qtyKey)!;
  const numberWord = quantity.label.toLowerCase(); // one, two, three...
  const singular = qtyKey === 1;
  const color = colorName.toLowerCase();
  const noun = singular ? obj.singular : obj.plural;

  // be forms + negative word
  let be: string;
  let negWord: string;
  if (tense === "present") {
    be = singular ? "is" : "are";
    negWord = "no"; // "There is no ...", "There are no ..."
  } else {
    be = singular ? "was" : "were";
    negWord = singular ? "no" : "not"; // "There was no ..." / "There were not ..."
  }

  // Affirmative & question show the number (one, two, ...). Negative uses no/not.
  const posTail = ` ${numberWord} ${color} ${noun}`;

  return {
    affirmative: sen("", `There ${be}`, `${posTail}.`),
    negative: sen("", `There ${be}`, ` ${negWord} ${color} ${noun}.`),
    question: sen("", `${cap(be)} there`, `${posTail}?`),
  };
}
