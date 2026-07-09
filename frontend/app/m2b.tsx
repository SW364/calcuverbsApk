import PracticeScreen from "@/src/components/PracticeScreen";
import { TENSES_PROG, buildM2B, M1A_VERBS } from "@/src/data/conjugation";

export default function M2B() {
  return (
    <PracticeScreen
      moduleLabel="MÓDULO 2"
      title="Tiempos continuos"
      optionTitle="Elige el tiempo"
      options={TENSES_PROG}
      optionItemWidth={120}
      optionAccent="#F0654A"
      verbs={M1A_VERBS}
      defaultVerb="add"
      build={buildM2B}
    />
  );
}
