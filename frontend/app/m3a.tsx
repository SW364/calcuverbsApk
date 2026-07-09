import PracticeScreen from "@/src/components/PracticeScreen";
import { TENSES, buildM3A, M3A_VERBS } from "@/src/data/conjugation";

export default function M3A() {
  return (
    <PracticeScreen
      moduleLabel="MÓDULO 3"
      title="Verbos regulares"
      optionTitle="Elige el tiempo"
      options={TENSES}
      optionItemWidth={120}
      optionAccent="#8B5CF6"
      verbs={M3A_VERBS}
      defaultVerb="believe"
      build={buildM3A}
    />
  );
}
