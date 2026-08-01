import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";

import { colors, fonts, spacing, radius } from "@/src/theme";
import DragCarousel from "@/src/components/DragCarousel";
import { OptionItem, Trio } from "@/src/data/conjugation";
import { Sentence } from "@/src/data/verbs";
import { STRINGS } from "@/src/i18n";

const BACKEND = process.env.EXPO_PUBLIC_BACKEND_URL;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type UIT = (typeof STRINGS)["en"];

export type PracticeConfig = {
  moduleLabel: string;
  title: string;
  optionTitle: string;
  options: OptionItem[];
  optionItemWidth: number;
  optionAccent: string;
  verbs?: string[];
  divided?: { regular: string[]; irregular: string[] };
  defaultVerb: string;
  build: (subjectLabel: string, optionKey: string, verb: string) => Trio;
  subjects: { label: string; emoji: string }[];
  t: UIT;
};

function OptionPill({ label, active }: { label: string; active: boolean }) {
  return (
    <View style={styles.pill}>
      <Text
        style={[styles.pillText, active && styles.pillTextActive]}
        numberOfLines={2}
        adjustsFontSizeToFit
      >
        {label}
      </Text>
    </View>
  );
}

function SubjectItem({ emoji, label }: { emoji: string; label: string }) {
  return (
    <View style={styles.subjectCard}>
      <Text style={styles.subjectEmoji}>{emoji}</Text>
      <Text style={styles.subjectLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function SentenceText({
  sentence,
  color,
  small,
}: {
  sentence: Sentence;
  color: string;
  small?: boolean;
}) {
  return (
    <Text style={small ? styles.sentenceSm : styles.sentence}>
      {sentence.pre}
      <Text style={{ color, fontFamily: fonts.extrabold }}>{sentence.hl}</Text>
      {sentence.post}
    </Text>
  );
}

function SpeakButton({
  onPress,
  color,
  bg,
  testID,
}: {
  onPress: () => void;
  color: string;
  bg: string;
  testID: string;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        styles.speakBtn,
        { backgroundColor: bg },
        pressed && { transform: [{ scale: 0.92 }] },
      ]}
      hitSlop={8}
    >
      <Ionicons name="volume-high" size={18} color={color} />
    </Pressable>
  );
}

export default function PracticeScreen(cfg: PracticeConfig) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [subj, setSubj] = useState(0);
  const [opt, setOpt] = useState(0);
  const [verb, setVerb] = useState<string>(cfg.defaultVerb);
  const [verbModal, setVerbModal] = useState(false);
  const [verbTab, setVerbTab] = useState<"regular" | "irregular">("regular");
  const [search, setSearch] = useState("");
  const [cards, setCards] = useState<Trio | null>(null);

  const player = useAudioPlayer(null);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  useEffect(() => {
    setCards(cfg.build(cfg.subjects[0].label, cfg.options[0].key, cfg.defaultVerb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tick = useCallback((setter: (i: number) => void) => {
    return (i: number) => {
      Haptics.selectionAsync().catch(() => {});
      setter(i);
    };
  }, []);

  const generate = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setCards(cfg.build(cfg.subjects[subj].label, cfg.options[opt].key, verb));
  }, [cfg, subj, opt, verb]);

  const speak = useCallback(
    (text: string) => {
      const uri = `${BACKEND}/api/tts?text=${encodeURIComponent(text)}`;
      player.replace({ uri });
      player.seekTo(0);
      player.play();
    },
    [player],
  );

  const base = cfg.divided
    ? verbTab === "regular"
      ? cfg.divided.regular
      : cfg.divided.irregular
    : cfg.verbs ?? [];
  const q = search.trim().toLowerCase();
  const verbList = q ? base.filter((v) => v.includes(q)) : base;

  return (
    <LinearGradient colors={[colors.bgTop, colors.bgBottom]} style={styles.flex}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          paddingBottom: insets.bottom + spacing.xl,
          paddingHorizontal: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.roundBtn} onPress={() => router.back()} testID="back-button">
            <Ionicons name="arrow-back" size={22} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.kicker}>{cfg.moduleLabel}</Text>
            <Text style={styles.headerTitle}>{cfg.title}</Text>
          </View>
          <View style={styles.roundBtn}>
            <Ionicons name="bookmark-outline" size={20} color={colors.primary} />
          </View>
        </View>

        {/* Subject carousel */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{cfg.t.chooseSubject}</Text>
          <DragCarousel
            testID="carousel-subject"
            data={cfg.subjects}
            index={subj}
            onChange={tick(setSubj)}
            itemWidth={78}
            itemHeight={92}
            accent={colors.primary}
            renderItem={(item) => <SubjectItem emoji={item.emoji} label={item.label} />}
          />
        </View>

        {/* Option carousel (auxiliary or tense) */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{cfg.optionTitle}</Text>
          <DragCarousel
            testID="carousel-option"
            data={cfg.options}
            index={opt}
            onChange={tick(setOpt)}
            itemWidth={cfg.optionItemWidth}
            itemHeight={58}
            accent={cfg.optionAccent}
            renderItem={(item, active) => <OptionPill label={item.label} active={active} />}
          />
        </View>

        {/* Verb selector */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{cfg.t.chooseVerb}</Text>
          <Pressable
            testID="verb-selector-button"
            onPress={() => setVerbModal(true)}
            style={({ pressed }) => [styles.verbButton, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.verbButtonText}>{cap(verb)}</Text>
            <Ionicons name="chevron-down" size={20} color={colors.question} />
          </Pressable>
        </View>

        {/* Generate */}
        <Pressable
          testID="generate-button"
          onPress={generate}
          style={({ pressed }) => [styles.generateBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }]}
        >
          <Ionicons name="sparkles" size={18} color="#fff" />
          <Text style={styles.generateText}>{cfg.t.generate}</Text>
        </Pressable>

        {cards ? (
          <View style={{ marginTop: spacing.md }}>
            <View style={[styles.card, styles.cardAff]} testID="card-affirmative">
              <View style={styles.cardHeaderRow}>
                <View style={[styles.tag, { backgroundColor: colors.affirmativeBg }]}>
                  <Text style={[styles.tagText, { color: colors.affirmative }]}>{cfg.t.aff}</Text>
                </View>
                <View style={[styles.statusCircle, { backgroundColor: colors.affirmative }]}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              </View>
              <SentenceText sentence={cards.affirmative} color={colors.affirmative} />
              <SpeakButton
                onPress={() => speak(cards.affirmative.full)}
                color={colors.affirmative}
                bg={colors.affirmativeBg}
                testID="speak-affirmative"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.card, styles.cardHalf]} testID="card-negative">
                <View style={[styles.tag, { backgroundColor: colors.negativeBg, alignSelf: "flex-start" }]}>
                  <Text style={[styles.tagText, { color: colors.negative }]}>{cfg.t.neg}</Text>
                </View>
                <View style={styles.statusRow}>
                  <View style={[styles.statusCircleSm, { backgroundColor: colors.negative }]}>
                    <Ionicons name="close" size={13} color="#fff" />
                  </View>
                  <SentenceText sentence={cards.negative} color={colors.negative} small />
                </View>
                <SpeakButton
                  onPress={() => speak(cards.negative.full)}
                  color={colors.negative}
                  bg={colors.negativeBg}
                  testID="speak-negative"
                />
              </View>

              <View style={[styles.card, styles.cardHalf]} testID="card-question">
                <View style={[styles.tag, { backgroundColor: colors.questionBg, alignSelf: "flex-start" }]}>
                  <Text style={[styles.tagText, { color: colors.question }]}>{cfg.t.que}</Text>
                </View>
                <View style={styles.statusRow}>
                  <View style={[styles.statusCircleSm, { backgroundColor: colors.question }]}>
                    <Ionicons name="help" size={13} color="#fff" />
                  </View>
                  <SentenceText sentence={cards.question} color={colors.question} small />
                </View>
                <SpeakButton
                  onPress={() => speak(cards.question.full)}
                  color={colors.question}
                  bg={colors.questionBg}
                  testID="speak-question"
                />
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Verb list modal */}
      <Modal
        visible={verbModal}
        animationType="slide"
        transparent
        onRequestClose={() => setVerbModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setVerbModal(false)} />
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
            <View style={styles.sheetHandle} />
            {cfg.divided ? (
              <View style={styles.tabRow}>
                <Pressable
                  testID="tab-regular"
                  style={[styles.tab, verbTab === "regular" && styles.tabActive]}
                  onPress={() => setVerbTab("regular")}
                >
                  <Text style={[styles.tabText, verbTab === "regular" && styles.tabTextActive]}>
                    {cfg.t.regular}
                  </Text>
                </Pressable>
                <Pressable
                  testID="tab-irregular"
                  style={[styles.tab, verbTab === "irregular" && styles.tabActive]}
                  onPress={() => setVerbTab("irregular")}
                >
                  <Text style={[styles.tabText, verbTab === "irregular" && styles.tabTextActive]}>
                    {cfg.t.irregular}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.sheetTitle}>{cfg.t.sheetTitle}</Text>
            )}
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color={colors.inkSoft} />
              <TextInput
                testID="verb-search"
                placeholder={cfg.t.search}
                placeholderTextColor={colors.inkSoft}
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
            <FlatList
              data={verbList}
              keyExtractor={(item) => item}
              numColumns={3}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{ gap: 8 }}
              contentContainerStyle={{ gap: 8, paddingTop: 12, paddingBottom: 8 }}
              renderItem={({ item }) => (
                <Pressable
                  testID={`verb-option-${item}`}
                  style={[styles.verbChip, item === verb && styles.verbChipActive]}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setVerb(item);
                    setVerbModal(false);
                    setSearch("");
                  }}
                >
                  <Text style={[styles.verbChipText, item === verb && styles.verbChipTextActive]}>
                    {cap(item)}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const shadow = {
  shadowColor: "#8A90A6",
  shadowOpacity: 0.15,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  roundBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  kicker: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1, color: colors.primary },
  headerTitle: { fontFamily: fonts.extrabold, fontSize: 20, color: colors.ink, textAlign: "center" },
  panel: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    ...shadow,
  },
  panelTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subjectCard: { flex: 1, alignItems: "center", justifyContent: "center" },
  subjectEmoji: { fontSize: 34 },
  subjectLabel: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, marginTop: 2 },
  pill: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
  pillText: { fontFamily: fonts.bold, fontSize: 16, color: colors.inkSoft, textAlign: "center" },
  pillTextActive: { color: colors.ink, fontFamily: fonts.extrabold },
  verbButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: spacing.md,
    backgroundColor: colors.questionBg,
    borderRadius: radius.md,
    paddingVertical: 12,
  },
  verbButtonText: { fontFamily: fonts.extrabold, fontSize: 20, color: colors.question },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 15,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  generateText: { fontFamily: fonts.extrabold, fontSize: 17, color: "#fff" },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, ...shadow },
  cardAff: { alignItems: "center", marginBottom: spacing.md },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  statusCircle: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  statusCircleSm: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: spacing.sm },
  row: { flexDirection: "row", gap: spacing.md },
  cardHalf: { flex: 1 },
  sentence: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.ink,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  sentenceSm: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, flexShrink: 1 },
  tag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill },
  tagText: { fontFamily: fonts.extrabold, fontSize: 10, letterSpacing: 0.5 },
  speakBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    alignSelf: "center",
  },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(20,22,40,0.4)", justifyContent: "flex-end" },
  sheet: {
    height: "82%",
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingTop: 10,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  sheetTitle: {
    fontFamily: fonts.extrabold,
    fontSize: 18,
    color: colors.ink,
    textAlign: "center",
  },
  tabRow: { flexDirection: "row", backgroundColor: "#F1F3F9", borderRadius: radius.md, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: radius.sm, alignItems: "center" },
  tabActive: {
    backgroundColor: colors.card,
    shadowColor: "#8A90A6",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabText: { fontFamily: fonts.bold, fontSize: 15, color: colors.inkSoft },
  tabTextActive: { color: colors.ink, fontFamily: fonts.extrabold },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F5F6FA",
    borderRadius: radius.md,
    paddingHorizontal: 12,
    height: 44,
    marginTop: spacing.md,
  },
  searchInput: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.ink, paddingVertical: 0 },
  verbChip: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.md,
    backgroundColor: "#F5F6FA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  verbChipActive: { backgroundColor: colors.question },
  verbChipText: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, textAlign: "center" },
  verbChipTextActive: { color: "#fff", fontFamily: fonts.extrabold },
});
