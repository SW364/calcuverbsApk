import PracticeScreen from "@/src/components/PracticeScreen";
import { getPracticeConfig } from "@/src/data/modules";
import { useLanguage } from "@/src/context/LanguageContext";

export default function M1A() {
  const { lang, mixed } = useLanguage();
  return <PracticeScreen {...getPracticeConfig("m1a", lang, mixed)} />;
}
