import PracticeScreen from "@/src/components/PracticeScreen";
import { TENSES, buildM4A, M4A_VERBS } from "@/src/data/conjugation";

export default function M4A() {
  return (
    <PracticeScreen
      moduleLabel="MÓDULO 4"
      title="Verbos irregulares"
      optionTitle="Elige el tiempo"
      options={TENSES}
      optionItemWidth={120}
      optionAccent="#22B573"
      verbs={M4A_VERBS}
      defaultVerb="awake"
      build={buildM4A}
    />
  );
}
