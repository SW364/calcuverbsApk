import PracticeScreen from "@/src/components/PracticeScreen";
import { getPracticeConfig } from "@/src/data/modules";
import { useLanguage } from "@/src/context/LanguageContext";

export default function M3A() {
  const { lang } = useLanguage();
  return <PracticeScreen {...getPracticeConfig("m3a", lang)} />;
}
