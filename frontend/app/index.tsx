import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors, fonts, spacing, radius } from "@/src/theme";

type Module = {
  code: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  route?: string;
  badge?: string;
};

const MODULES: Module[] = [
  { code: "M1.A", title: "Verbos Básicos I", icon: "book", color: "#4A7DF0", bg: "#E8F1FC", route: "/m1a" },
  { code: "M1.B", title: "Gerundio (be + -ing)", icon: "chatbubble-ellipses", color: "#1FB6A6", bg: "#E4F6F3", route: "/m1b" },
  { code: "M2.A", title: "Tiempos verbales", icon: "create", color: "#F5A623", bg: "#FDF3E1", route: "/m2a" },
  { code: "M2.B", title: "Tiempos continuos", icon: "flash", color: "#F0654A", bg: "#FDECE8", route: "/m2b" },
  { code: "M3.A", title: "Verbos regulares", icon: "star", color: "#8B5CF6", bg: "#F0EAFB", route: "/m3a" },
  { code: "M3.B", title: "Auxiliares II", icon: "shield-checkmark", color: "#EC4899", bg: "#FCE7F1", badge: "Nuevo" },
  { code: "M4.A", title: "Verbos irregulares", icon: "flag", color: "#22B573", bg: "#E7F8EF", route: "/m4a" },
  { code: "M4.B", title: "Frases y Preguntas II", icon: "trophy", color: "#3B82F6", bg: "#E7F0FD", badge: "Nuevo" },
];

export default function Modules() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!toast) return;
    Animated.timing(toastOpacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    const t = setTimeout(() => {
      Animated.timing(toastOpacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(
        () => setToast(null),
      );
    }, 1400);
    return () => clearTimeout(t);
  }, [toast, toastOpacity]);

  const handlePress = (m: Module) => {
    if (m.route) router.push(m.route as any);
    else setToast(`${m.code} · Próximamente`);
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.roundBtn} testID="menu-button">
            <Ionicons name="menu" size={22} color={colors.ink} />
          </View>
          <View style={{ flex: 1 }} />
          <View style={[styles.roundBtn, { backgroundColor: "#FFF3D6" }]} testID="star-button">
            <Ionicons name="star" size={20} color="#F5A623" />
          </View>
        </View>

        <Text style={styles.title}>Módulos</Text>
        <Text style={styles.subtitle}>Elige un módulo para comenzar</Text>

        {/* Grid */}
        <View style={styles.grid}>
          {MODULES.map((m) => (
            <Pressable
              key={m.code}
              testID={`module-${m.code}`}
              onPress={() => handlePress(m)}
              style={({ pressed }) => [
                styles.cardModule,
                { backgroundColor: m.bg },
                pressed && { transform: [{ scale: 0.97 }] },
              ]}
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
                {m.title}
              </Text>
              <View style={styles.chevRow}>
                <Ionicons name="chevron-forward" size={18} color={m.color} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {toast ? (
        <Animated.View
          style={[styles.toast, { bottom: insets.bottom + 24, opacity: toastOpacity }]}
          pointerEvents="none"
          testID="toast"
        >
          <Text style={styles.toastText}>{toast}</Text>
        </Animated.View>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8A90A6",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontFamily: fonts.extrabold,
    fontSize: 30,
    color: colors.ink,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.inkSoft,
    textAlign: "center",
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardModule: {
    width: "48%",
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 150,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  moduleCode: {
    fontFamily: fonts.extrabold,
    fontSize: 22,
  },
  moduleTitle: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 2,
  },
  chevRow: {
    alignItems: "flex-end",
    marginTop: spacing.sm,
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#EC4899",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: "#fff",
  },
  toast: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: colors.ink,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },
  toastText: {
    fontFamily: fonts.semibold,
    color: "#fff",
    fontSize: 14,
  },
});
