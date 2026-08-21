import PracticeScreen from "@/src/components/PracticeScreen";
import { getPracticeConfig } from "@/src/data/modules";
import { useLanguage } from "@/src/context/LanguageContext";

export default function M2A() {
  const { lang, mixed } = useLanguage();
  return <PracticeScreen {...getPracticeConfig("m2a", lang, mixed)} />;
}
