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

// Module M1.A verb pool (159 verbs), split for the list UI.
// Regular/irregular is only for organizing the list — M1.A sentences use
// the base form after a modal auxiliary, so grammar is unaffected.
export const REGULAR_VERBS: string[] = [
  "add", "answer", "apologise", "arrest", "arrive", "ask", "attack",
  "believe", "boil", "book", "borrow", "carry", "change", "chop", "clean",
  "climb", "collect", "compose", "cook", "copy", "dance", "describe",
  "destroy", "die", "discover", "discuss", "dream", "dye", "enjoy",
  "explode", "extinguish", "fry", "happen", "hate", "help", "hire", "hope",
  "hunt", "imagine", "invent", "invite", "jump", "kill", "lift", "like",
  "listen", "live", "look", "love", "miss", "offer", "open", "pack", "pass",
  "peel", "phone", "plan", "play", "pour", "prefer", "prepare", "push",
  "rain", "reduce", "remember", "rent", "rescue", "return", "save", "scream",
  "search", "skate", "sky", "smell", "snore", "start", "stay", "stop",
  "study", "survive", "talk", "thank", "touch", "try", "use", "visit",
  "wait", "walk", "want", "warn", "wash", "watch", "work",
];

export const IRREGULAR_VERBS: string[] = [
  "be", "become", "begin", "break", "bring", "build", "buy", "catch", "come",
  "cut", "do", "draw", "drink", "drive", "eat", "fall", "feed", "feel",
  "fight", "find", "fly", "forget", "freeze", "give", "go", "grow", "have",
  "hear", "hurt", "keep", "know", "lay", "leave", "lend", "lie", "lose",
  "make", "meet", "pay", "put", "read", "ring", "run", "say", "see", "sell",
  "send", "shine", "shoot", "shut", "sing", "sit", "sleep", "speak", "spend",
  "steal", "swim", "take", "teach", "tell", "think", "throw", "understand",
  "wear", "win", "write",
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
