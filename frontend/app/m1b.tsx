import PracticeScreen from "@/src/components/PracticeScreen";
import { AUX_OPTIONS, buildM1B, M1A_VERBS } from "@/src/data/conjugation";
import { colors } from "@/src/theme";

export default function M1B() {
  return (
    <PracticeScreen
      moduleLabel="MÓDULO 1"
      title="Gerundio (be + -ing)"
      optionTitle="Elige tu verbo auxiliar"
      options={AUX_OPTIONS}
      optionItemWidth={94}
      optionAccent={colors.affirmative}
      verbs={M1A_VERBS}
      defaultVerb="add"
      build={buildM1B}
    />
  );
}
