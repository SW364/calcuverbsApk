import PracticeScreen from "@/src/components/PracticeScreen";
import { TENSES, buildM2A, M2A_VERBS } from "@/src/data/conjugation";

export default function M2A() {
  return (
    <PracticeScreen
      moduleLabel="MÓDULO 2"
      title="Tiempos verbales"
      optionTitle="Elige el tiempo"
      options={TENSES}
      optionItemWidth={120}
      optionAccent="#8B5CF6"
      verbs={M2A_VERBS}
      defaultVerb="hit"
      build={buildM2A}
    />
  );
}
