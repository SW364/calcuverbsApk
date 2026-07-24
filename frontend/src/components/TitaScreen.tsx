import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
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
import { Sentence } from "@/src/data/verbs";
import {
  QUANTITIES,
  COLORS,
  OBJECTS,
  CATEGORIES,
  Categoria,
  buildTita,
  Trio,
} from "@/src/data/tita";

const BACKEND = process.env.EXPO_PUBLIC_BACKEND_URL;

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

function SpeakButton({ onPress, color, bg, testID }: { onPress: () => void; color: string; bg: string; testID: string }) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [styles.speakBtn, { backgroundColor: bg }, pressed && { transform: [{ scale: 0.92 }] }]}
      hitSlop={8}
    >
      <Ionicons name="volume-high" size={18} color={color} />
    </Pressable>
  );
}

export default function TitaScreen({
  tense,
  moduleLabel,
  title,
}: {
  tense: "present" | "past";
  moduleLabel: string;
  title: string;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [qty, setQty] = useState(0);
  const [color, setColor] = useState(3); // Red
  const [objKey, setObjKey] = useState("apple");
  const [objModal, setObjModal] = useState(false);
  const [cat, setCat] = useState<Categoria>("Fruits");
  const [cards, setCards] = useState<Trio | null>(null);

  const player = useAudioPlayer(null);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  useEffect(() => {
    setCards(buildTita(tense, QUANTITIES[0].key, COLORS[3].name, "apple"));
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
    setCards(buildTita(tense, QUANTITIES[qty].key, COLORS[color].name, objKey));
  }, [tense, qty, color, objKey]);

  const speak = useCallback(
    (text: string) => {
      const uri = `${BACKEND}/api/tts?text=${encodeURIComponent(text)}`;
      player.replace({ uri });
      player.seekTo(0);
      player.play();
    },
    [player],
  );

  const selectedObj = OBJECTS.find((o) => o.key === objKey)!;
  const catObjects = OBJECTS.filter((o) => o.category === cat);

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
        <View style={styles.header}>
          <Pressable style={styles.roundBtn} onPress={() => router.back()} testID="back-button">
            <Ionicons name="arrow-back" size={22} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.kicker}>{moduleLabel}</Text>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
          <View style={styles.roundBtn}>
            <Ionicons name="bookmark-outline" size={20} color={colors.primary} />
          </View>
        </View>

        {/* Quantity carousel */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Elige la cantidad</Text>
          <DragCarousel
            testID="carousel-quantity"
            data={QUANTITIES}
            index={qty}
            onChange={tick(setQty)}
            itemWidth={76}
            itemHeight={92}
            accent={colors.primary}
            renderItem={(item) => (
              <View style={styles.qtyCard}>
                <View style={styles.qtyCircle}>
                  <Text style={styles.qtyNum}>{item.key}</Text>
                </View>
                <Text style={styles.qtyLabel}>{item.label}</Text>
              </View>
            )}
          />
        </View>

        {/* Color carousel */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Elige el color</Text>
          <DragCarousel
            testID="carousel-color"
            data={COLORS}
            index={color}
            onChange={tick(setColor)}
            itemWidth={112}
            itemHeight={58}
            accent="#8B5CF6"
            renderItem={(item) => (
              <View style={styles.colorItem}>
                <View style={[styles.colorDot, { backgroundColor: item.hex }]} />
                <Text style={styles.colorName}>{item.name}</Text>
              </View>
            )}
          />
        </View>

        {/* Object selector */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Elige el objeto</Text>
          <Pressable
            testID="object-selector-button"
            onPress={() => setObjModal(true)}
            style={({ pressed }) => [styles.objButton, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.objEmoji}>{selectedObj.emoji}</Text>
            <Text style={styles.objButtonText}>{selectedObj.label}</Text>
            <Ionicons name="chevron-down" size={20} color={colors.question} />
          </Pressable>
        </View>

        <Pressable
          testID="generate-button"
          onPress={generate}
          style={({ pressed }) => [styles.generateBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }]}
        >
          <Ionicons name="sparkles" size={18} color="#fff" />
          <Text style={styles.generateText}>Generar</Text>
        </Pressable>

        {cards ? (
          <View style={{ marginTop: spacing.md }}>
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
              <SpeakButton onPress={() => speak(cards.affirmative.full)} color={colors.affirmative} bg={colors.affirmativeBg} testID="speak-affirmative" />
            </View>

            <View style={styles.row}>
              <View style={[styles.card, styles.cardHalf]} testID="card-negative">
                <View style={[styles.tag, { backgroundColor: colors.negativeBg, alignSelf: "flex-start" }]}>
                  <Text style={[styles.tagText, { color: colors.negative }]}>NEGATIVA</Text>
                </View>
                <View style={styles.statusRow}>
                  <View style={[styles.statusCircleSm, { backgroundColor: colors.negative }]}>
                    <Ionicons name="close" size={13} color="#fff" />
                  </View>
                  <SentenceText sentence={cards.negative} color={colors.negative} small />
                </View>
                <SpeakButton onPress={() => speak(cards.negative.full)} color={colors.negative} bg={colors.negativeBg} testID="speak-negative" />
              </View>

              <View style={[styles.card, styles.cardHalf]} testID="card-question">
                <View style={[styles.tag, { backgroundColor: colors.questionBg, alignSelf: "flex-start" }]}>
                  <Text style={[styles.tagText, { color: colors.question }]}>PREGUNTA</Text>
                </View>
                <View style={styles.statusRow}>
                  <View style={[styles.statusCircleSm, { backgroundColor: colors.question }]}>
                    <Ionicons name="help" size={13} color="#fff" />
                  </View>
                  <SentenceText sentence={cards.question} color={colors.question} small />
                </View>
                <SpeakButton onPress={() => speak(cards.question.full)} color={colors.question} bg={colors.questionBg} testID="speak-question" />
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Object modal with category tabs */}
      <Modal visible={objModal} animationType="slide" transparent onRequestClose={() => setObjModal(false)}>
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setObjModal(false)} />
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
            <View style={styles.sheetHandle} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.catRow}
            >
              {CATEGORIES.map((c) => (
                <Pressable
                  key={c}
                  testID={`cat-${c}`}
                  onPress={() => setCat(c)}
                  style={[styles.catChip, cat === c && styles.catChipActive]}
                >
                  <Text style={[styles.catText, cat === c && styles.catTextActive]}>{c}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 12, paddingBottom: 8 }}>
              <View style={styles.objGrid}>
                {catObjects.map((o) => (
                  <Pressable
                    key={o.key}
                    testID={`object-option-${o.key}`}
                    style={[styles.objChip, o.key === objKey && styles.objChipActive]}
                    onPress={() => {
                      Haptics.selectionAsync().catch(() => {});
                      setObjKey(o.key);
                      setObjModal(false);
                    }}
                  >
                    <Text style={styles.objChipEmoji}>{o.emoji}</Text>
                    <Text style={[styles.objChipText, o.key === objKey && styles.objChipTextActive]}>{o.label}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
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
  qtyCard: { flex: 1, alignItems: "center", justifyContent: "center" },
  qtyCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FE",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyNum: { fontFamily: fonts.extrabold, fontSize: 22, color: colors.primary },
  qtyLabel: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginTop: 4 },
  colorItem: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  colorDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)" },
  colorName: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
  objButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: spacing.md,
    backgroundColor: colors.questionBg,
    borderRadius: radius.md,
    paddingVertical: 12,
  },
  objEmoji: { fontSize: 24 },
  objButtonText: { fontFamily: fonts.extrabold, fontSize: 20, color: colors.question },
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
  cardHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" },
  statusCircle: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  statusCircleSm: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: spacing.sm },
  row: { flexDirection: "row", gap: spacing.md },
  cardHalf: { flex: 1 },
  sentence: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink, textAlign: "center", marginTop: spacing.sm },
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
    maxHeight: "78%",
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
  catRow: { gap: 8, paddingRight: spacing.md },
  catChip: {
    flexShrink: 0,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: "#F1F3F9",
    alignItems: "center",
    justifyContent: "center",
  },
  catChipActive: { backgroundColor: colors.ink },
  catText: { fontFamily: fonts.bold, fontSize: 14, color: colors.inkSoft },
  catTextActive: { color: "#fff", fontFamily: fonts.extrabold },
  objGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  objChip: {
    width: "31%",
    minHeight: 82,
    borderRadius: radius.md,
    backgroundColor: "#F5F6FA",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  objChipActive: { backgroundColor: colors.questionBg, borderWidth: 2, borderColor: colors.question },
  objChipEmoji: { fontSize: 30, marginBottom: 4 },
  objChipText: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  objChipTextActive: { color: colors.question, fontFamily: fonts.extrabold },
});
