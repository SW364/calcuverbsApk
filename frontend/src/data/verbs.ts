// Content + grammar helpers for Module 1 (M1.A). Local only.

export type Subject = { label: string; emoji: string };
export type Auxiliary = { label: string; neg: string };

export const SUBJECTS: Subject[] = [
  { label: "I", emoji: "🧒" },
  { label: "You", emoji: "🧑" },
  { label: "He", emoji: "👦" },
  { label: "She", emoji: "👧" },
  { label: "It", emoji: "🐱" },
  { label: "We", emoji: "👨‍👩‍👦" },
  { label: "They", emoji: "👥" },
];

export const AUXILIARIES: Auxiliary[] = [
  { label: "Can", neg: "cannot" },
  { label: "Could", neg: "could not" },
  { label: "Would", neg: "would not" },
  { label: "Should", neg: "should not" },
  { label: "May", neg: "may not" },
  { label: "Might", neg: "might not" },
  { label: "Must", neg: "must not" },
  { label: "Will", neg: "will not" },
];

export const VERBS: string[] = [
  "cut", "run", "eat", "go", "play", "read", "write",
  "sing", "swim", "jump", "work", "study", "dance", "cook", "drive",
];

export type Sentence = {
  pre: string; // text before the highlighted word
  hl: string; // highlighted (colored) word
  post: string; // text after
  full: string; // full sentence for TTS
};

export function buildSentences(
  subject: Subject,
  aux: Auxiliary,
  verb: string,
): { affirmative: Sentence; negative: Sentence; question: Sentence } {
  const s = subject.label;
  const qSubject = s === "I" ? "I" : s.toLowerCase();

  const affirmative: Sentence = {
    pre: `${s} `,
    hl: aux.label.toLowerCase(),
    post: ` ${verb}.`,
    full: `${s} ${aux.label.toLowerCase()} ${verb}.`,
  };

  const negative: Sentence = {
    pre: `${s} `,
    hl: aux.neg,
    post: ` ${verb}.`,
    full: `${s} ${aux.neg} ${verb}.`,
  };

  const question: Sentence = {
    pre: "",
    hl: aux.label,
    post: ` ${qSubject} ${verb}?`,
    full: `${aux.label} ${qSubject} ${verb}?`,
  };

  return { affirmative, negative, question };
}
