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
import {
  SUBJECTS,
  AUXILIARIES,
  REGULAR_VERBS,
  IRREGULAR_VERBS,
  buildSentences,
  Sentence,
} from "@/src/data/verbs";

const BACKEND = process.env.EXPO_PUBLIC_BACKEND_URL;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Pill({ label, active }: { label: string; active: boolean }) {
  return (
    <View style={styles.pill}>
      <Text style={[styles.pillText, active && styles.pillTextActive]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function SubjectItem({
  emoji,
  label,
  active,
}: {
  emoji: string;
  label: string;
  active: boolean;
}) {
  return (
    <View style={[styles.subjectCard, active ? styles.subjectActive : styles.subjectIdle]}>
      <Text style={styles.subjectEmoji}>{emoji}</Text>
      <Text style={styles.subjectLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export default function M1A() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [subj, setSubj] = useState(0);
  const [aux, setAux] = useState(0);
  const [verb, setVerb] = useState<string>("cut");
  const [verbModal, setVerbModal] = useState(false);
  const [verbTab, setVerbTab] = useState<"regular" | "irregular">("regular");
  const [search, setSearch] = useState("");
  const [cards, setCards] = useState<ReturnType<typeof buildSentences> | null>(null);

  const player = useAudioPlayer(null);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  // Start with "I can cut." generated.
  useEffect(() => {
    setCards(buildSentences(SUBJECTS[0], AUXILIARIES[0], "cut"));
  }, []);

  const tick = useCallback((setter: (i: number) => void) => {
    return (i: number) => {
      Haptics.selectionAsync().catch(() => {});
      setter(i);
    };
  }, []);

  const generate = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setCards(buildSentences(SUBJECTS[subj], AUXILIARIES[aux], verb));
  }, [subj, aux, verb]);

  const speak = useCallback(
    (text: string) => {
      const uri = `${BACKEND}/api/tts?text=${encodeURIComponent(text)}`;
      player.replace({ uri });
      player.seekTo(0);
      player.play();
    },
    [player],
  );

  const base = verbTab === "regular" ? REGULAR_VERBS : IRREGULAR_VERBS;
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
        {/* Header (no progress bar, no points/star/percent) */}
        <View style={styles.header}>
          <Pressable style={styles.roundBtn} onPress={() => router.back()} testID="back-button">
            <Ionicons name="arrow-back" size={22} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.kicker}>MÓDULO 1</Text>
            <Text style={styles.headerTitle}>Verbos Básicos</Text>
          </View>
          <View style={styles.roundBtn}>
            <Ionicons name="bookmark-outline" size={20} color={colors.primary} />
          </View>
        </View>

        {/* Subject carousel */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Elige tu sujeto</Text>
          <DragCarousel
            testID="carousel-subject"
            data={SUBJECTS}
            index={subj}
            onChange={tick(setSubj)}
            itemWidth={78}
            itemHeight={92}
            accent={colors.primary}
            renderItem={(item, active) => (
              <SubjectItem emoji={item.emoji} label={item.label} active={active} />
            )}
          />
        </View>

        {/* Auxiliary carousel */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Elige tu verbo auxiliar</Text>
          <DragCarousel
            testID="carousel-auxiliary"
            data={AUXILIARIES}
            index={aux}
            onChange={tick(setAux)}
            itemWidth={94}
            itemHeight={52}
            accent={colors.affirmative}
            renderItem={(item, active) => <Pill label={item.label} active={active} />}
          />
        </View>

        {/* Verb selector (opens Regular/Irregular list) */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Elige tu verbo</Text>
          <Pressable
            testID="verb-selector-button"
            onPress={() => setVerbModal(true)}
            style={({ pressed }) => [styles.verbButton, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.verbButtonText}>{cap(verb)}</Text>
            <Ionicons name="chevron-down" size={20} color={colors.question} />
          </Pressable>
        </View>

        {/* Generate button */}
        <Pressable
          testID="generate-button"
          onPress={generate}
          style={({ pressed }) => [styles.generateBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }]}
        >
          <Ionicons name="sparkles" size={18} color="#fff" />
          <Text style={styles.generateText}>Generar</Text>
        </Pressable>

        {/* Generated cards */}
        {cards ? (
          <View style={{ marginTop: spacing.md }}>
            {/* Affirmative */}
            <View style={[styles.card, styles.cardAff]} testID="card-affirmative">
              <View style={styles.cardHeaderRow}>
                <View style={[styles.tag, { backgroundColor: colors.affirmativeBg }]}>
                  <Text style={[styles.tagText, { color: colors.affirmative }]}>AFIRMATIVA</Text>
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
              {/* Negative */}
              <View style={[styles.card, styles.cardHalf, styles.cardNeg]} testID="card-negative">
                <View style={[styles.tag, { backgroundColor: colors.negativeBg, alignSelf: "flex-start" }]}>
                  <Text style={[styles.tagText, { color: colors.negative }]}>NEGATIVA</Text>
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

              {/* Question */}
              <View style={[styles.card, styles.cardHalf, styles.cardQ]} testID="card-question">
                <View style={[styles.tag, { backgroundColor: colors.questionBg, alignSelf: "flex-start" }]}>
                  <Text style={[styles.tagText, { color: colors.question }]}>PREGUNTA</Text>
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

      {/* Verb list modal (Regular / Irregular tabs) */}
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
            <View style={styles.tabRow}>
              <Pressable
                testID="tab-regular"
                style={[styles.tab, verbTab === "regular" && styles.tabActive]}
                onPress={() => setVerbTab("regular")}
              >
                <Text style={[styles.tabText, verbTab === "regular" && styles.tabTextActive]}>
                  Regulares
                </Text>
              </Pressable>
              <Pressable
                testID="tab-irregular"
                style={[styles.tab, verbTab === "irregular" && styles.tabActive]}
                onPress={() => setVerbTab("irregular")}
              >
                <Text style={[styles.tabText, verbTab === "irregular" && styles.tabTextActive]}>
                  Irregulares
                </Text>
              </Pressable>
            </View>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color={colors.inkSoft} />
              <TextInput
                testID="verb-search"
                placeholder="Buscar verbo…"
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
    <Text style={[small ? styles.sentenceSm : styles.sentence]}>
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

const shadow = {
  shadowColor: "#8A90A6",
  shadowOpacity: 0.15,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  roundBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  kicker: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.primary,
  },
  headerTitle: {
    fontFamily: fonts.extrabold,
    fontSize: 20,
    color: colors.ink,
  },
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
  subjectCard: {
    flex: 1,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  subjectActive: { borderColor: "transparent", backgroundColor: "transparent" },
  subjectIdle: { borderColor: "transparent", backgroundColor: "transparent" },
  subjectEmoji: { fontSize: 34 },
  subjectLabel: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.ink,
    marginTop: 2,
  },
  pill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.inkSoft,
  },
  pillTextActive: {
    color: colors.ink,
    fontFamily: fonts.extrabold,
  },
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
  generateText: {
    fontFamily: fonts.extrabold,
    fontSize: 17,
    color: "#fff",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow,
  },
  cardAff: { alignItems: "center", marginBottom: spacing.md },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  statusCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  statusCircleSm: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  cardHalf: { flex: 1 },
  cardNeg: {},
  cardQ: {},
  sentence: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.ink,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  sentenceSm: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.ink,
    flexShrink: 1,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  tagText: {
    fontFamily: fonts.extrabold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  speakBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    alignSelf: "center",
  },
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
  verbButtonText: {
    fontFamily: fonts.extrabold,
    fontSize: 20,
    color: colors.question,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(20,22,40,0.4)",
    justifyContent: "flex-end",
  },
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
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#F1F3F9",
    borderRadius: radius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: colors.card,
    shadowColor: "#8A90A6",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.inkSoft,
  },
  tabTextActive: {
    color: colors.ink,
    fontFamily: fonts.extrabold,
  },
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
  searchInput: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 0,
  },
  verbChip: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.md,
    backgroundColor: "#F5F6FA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  verbChipActive: {
    backgroundColor: colors.question,
  },
  verbChipText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  verbChipTextActive: {
    color: "#fff",
    fontFamily: fonts.extrabold,
  },
});
