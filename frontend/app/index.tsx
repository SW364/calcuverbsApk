import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors, fonts, spacing, radius } from "@/src/theme";
import { useLanguage, LearnLang } from "@/src/context/LanguageContext";
import { STRINGS, uiLangOf, MODULE_TITLES } from "@/src/i18n";

type Module = {
  code: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  route?: string;
  badge?: string;
  tenses: number;
};

const MODULES: Module[] = [
  { code: "M1.A", icon: "book", color: "#4A7DF0", bg: "#E8F1FC", route: "/m1a", tenses: 9 },
  { code: "M1.B", icon: "chatbubble-ellipses", color: "#1FB6A6", bg: "#E4F6F3", route: "/m1b", tenses: 9 },
  { code: "M2.A", icon: "create", color: "#F5A623", bg: "#FDF3E1", route: "/m2a", tenses: 4 },
  { code: "M2.B", icon: "flash", color: "#F0654A", bg: "#FDECE8", route: "/m2b", tenses: 4 },
  { code: "M3.A", icon: "star", color: "#8B5CF6", bg: "#F0EAFB", route: "/m3a", tenses: 4 },
  { code: "Tita I", icon: "cube", color: "#EC4899", bg: "#FCE7F1", route: "/tita1", badge: "Nuevo", tenses: 2 },
  { code: "M4.A", icon: "flag", color: "#22B573", bg: "#E7F8EF", route: "/m4a", tenses: 4 },
  { code: "Tita II", icon: "time", color: "#3B82F6", bg: "#E7F0FD", route: "/tita2", badge: "Nuevo", tenses: 2 },
];

export default function Modules() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lang, setLang, mixed, setMixed } = useLanguage();
  const t = STRINGS[uiLangOf(lang)];
  const [menuOpen, setMenuOpen] = useState(false);

  const pickLang = (l: LearnLang) => {
    setLang(l);
    setMixed(false);
    setMenuOpen(false);
  };

  const pickMixed = (l: LearnLang) => {
    setLang(l);
    setMixed(true);
    setMenuOpen(false);
  };

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
          <Pressable style={styles.roundBtn} testID="menu-button" onPress={() => setMenuOpen(true)}>
            <Ionicons name="menu" size={22} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }} />
        </View>

        <Text style={styles.title}>{t.homeTitle}</Text>
        <Text style={styles.subtitle}>{t.homeSubtitle}</Text>

        <View style={styles.grid}>
          {MODULES.map((m) => (
            <Pressable
              key={m.code}
              testID={`module-${m.code}`}
              onPress={() => m.route && router.push(m.route as any)}
              style={({ pressed }) => [styles.cardModule, { backgroundColor: m.bg }, pressed && { transform: [{ scale: 0.97 }] }]}
            >
              {m.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{m.badge}</Text>
                </View>
              ) : null}
              <View style={[styles.iconCircle, { backgroundColor: m.color }]}>
                <Ionicons name={m.icon} size={22} color="#fff" />
              </View>
              <Text style={[styles.moduleCode, { color: m.color }]}>{m.code}</Text>
              <Text style={styles.moduleTitle} numberOfLines={2}>
                {MODULE_TITLES[lang][m.code]}
              </Text>
              <View style={styles.footerRow}>
                <View style={styles.hPill}>
                  <Text style={[styles.hPillText, { color: m.color }]}>{`H${m.tenses}`}</Text>
                </View>
                <Text style={styles.tensesText}>{`${m.tenses} ${t.tenses}`}</Text>
                <View style={{ flex: 1 }} />
                <Ionicons name="chevron-forward" size={18} color={m.color} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Language dropdown */}
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)}>
          <View style={[styles.menuCard, { top: insets.top + 58 }]}>
            <Text style={styles.menuTitle}>{t.languageMenu}</Text>
            <Pressable testID="lang-english" style={styles.menuItem} onPress={() => pickLang("en")}>
              <View style={styles.codeBadge}><Text style={styles.codeBadgeText}>EN</Text></View>
              <Text style={styles.menuItemText}>{t.langEnglish}</Text>
              {!mixed && lang === "en" ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable testID="lang-spanish" style={styles.menuItem} onPress={() => pickLang("es")}>
              <View style={styles.codeBadge}><Text style={styles.codeBadgeText}>ES</Text></View>
              <Text style={styles.menuItemText}>{t.langSpanish}</Text>
              {!mixed && lang === "es" ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
            </Pressable>

            <View style={styles.menuDivider} />
            <Text style={styles.menuSection}>🌎 {t.langMixed}</Text>
            <Pressable testID="lang-mixed-en-es" style={styles.menuItem} onPress={() => pickMixed("en")}>
              <View style={styles.codeBadge}><Text style={styles.codeBadgeText}>EN→ES</Text></View>
              <Text style={styles.menuItemText}>{t.mixedEnEs}</Text>
              {mixed && lang === "en" ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable testID="lang-mixed-es-en" style={styles.menuItem} onPress={() => pickMixed("es")}>
              <View style={styles.codeBadge}><Text style={styles.codeBadgeText}>ES→EN</Text></View>
              <Text style={styles.menuItemText}>{t.mixedEsEn}</Text>
              {mixed && lang === "es" ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm },
  roundBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#8A90A6", shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  title: { fontFamily: fonts.extrabold, fontSize: 30, color: colors.ink, textAlign: "center" },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkSoft, textAlign: "center", marginTop: 2, marginBottom: spacing.lg },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  cardModule: { width: "48%", borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, minHeight: 168 },
  iconCircle: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  moduleCode: { fontFamily: fonts.extrabold, fontSize: 22 },
  moduleTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkSoft, marginTop: 2 },
  footerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: "auto", paddingTop: spacing.sm },
  hPill: {
    backgroundColor: "rgba(255,255,255,0.75)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    minWidth: 30,
    alignItems: "center",
  },
  hPillText: { fontFamily: fonts.extrabold, fontSize: 12 },
  tensesText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkSoft },
  badge: { position: "absolute", top: 10, right: 10, backgroundColor: "#EC4899", paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill },
  badgeText: { fontFamily: fonts.bold, fontSize: 11, color: "#fff" },
  menuBackdrop: { flex: 1, backgroundColor: "rgba(20,22,40,0.25)" },
  menuCard: {
    position: "absolute", left: spacing.md, width: 264,
    backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.sm,
    shadowColor: "#2A2E45", shadowOpacity: 0.2, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  menuTitle: { fontFamily: fonts.extrabold, fontSize: 13, color: colors.inkSoft, paddingHorizontal: 10, paddingTop: 6, paddingBottom: 8 },
  menuSection: { fontFamily: fonts.extrabold, fontSize: 12, color: colors.inkSoft, paddingHorizontal: 10, paddingTop: 8, paddingBottom: 2, letterSpacing: 0.3 },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, paddingHorizontal: 10, borderRadius: radius.md },
  codeBadge: {
    minWidth: 30, paddingHorizontal: 6, height: 24, borderRadius: 7,
    backgroundColor: "#EEF2FE", alignItems: "center", justifyContent: "center",
  },
  codeBadgeText: { fontFamily: fonts.extrabold, fontSize: 11, letterSpacing: 0.5, color: colors.primary },
  menuFlag: { fontSize: 20 },
  menuItemText: { flex: 1, fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  menuSub: { fontFamily: fonts.bold, fontSize: 12, color: colors.primary, marginTop: 1 },
  menuDivider: { height: 1, backgroundColor: colors.border, marginHorizontal: 10 },
});
