import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { ActionIcon } from "@popapp/components/action-icon";
import { IconSymbol } from "@popapp/components/icon-symbol";
import { ThemeIcon } from "@popapp/components/theme-icon";
import { Card, CardContent } from "@popapp/components/card";
import { Separator } from "@popapp/components/separator";
import { DemoSection } from "@/components/demo-section";

const ICON_GALLERY = [
  "house.fill",
  "heart.fill",
  "star.fill",
  "bell.fill",
  "gear",
  "magnifyingglass",
  "person.fill",
  "envelope.fill",
  "camera.fill",
  "photo.fill",
  "map.fill",
  "bookmark.fill",
  "cart.fill",
  "lock.fill",
  "wifi",
  "bolt.fill",
  "flame.fill",
  "leaf.fill",
  "globe",
  "music.note",
] as const;

const SETTINGS_ITEMS = [
  { icon: "wifi", color: "#007AFF", label: "Wi-Fi", value: "Home Network" },
  { icon: "antenna.radiowaves.left.and.right", color: "#34C759", label: "Cellular", value: "5G" },
  { icon: "battery.100.bolt", color: "#34C759", label: "Battery", value: "87%" },
  { icon: "bell.badge.fill", color: "#FF3B30", label: "Notifications", value: "On" },
  { icon: "moon.fill", color: "#5856D6", label: "Focus", value: "Off" },
  { icon: "display", color: "#007AFF", label: "Display", value: "Auto" },
] as const;

export default function IconsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <ScreenHeader
        title="Icons & Symbols"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
      />
      <ScreenContent>
        {/* ── Real-world: Settings Menu ───────────────────────── */}
        <DemoSection title="In Context" description="ThemeIcon in a settings-style menu">
          <Card>
            <CardContent>
              <View style={styles.settingsList}>
                {SETTINGS_ITEMS.map((item, i) => (
                  <View key={item.label}>
                    <View style={styles.settingsRow}>
                      <ThemeIcon name={item.icon} color={item.color} />
                      <Text style={[styles.settingsLabel, { color: colors.foreground }]}>
                        {item.label}
                      </Text>
                      <Text style={[styles.settingsValue, { color: colors.foregroundSecondary }]}>
                        {item.value}
                      </Text>
                      <IconSymbol name="chevron.right" size={12} color={colors.muted} weight="semibold" />
                    </View>
                    {i < SETTINGS_ITEMS.length - 1 && (
                      <View style={[styles.settingsDivider, { backgroundColor: colors.border }]} />
                    )}
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── IconSymbol Gallery ──────────────────────────────── */}
        <DemoSection title="IconSymbol" description="SF Symbols on iOS, Material Icons on Android">
          <View style={styles.iconGrid}>
            {ICON_GALLERY.map((name) => (
              <View key={name} style={styles.iconItem}>
                <IconSymbol name={name} size={28} color={colors.foreground} />
                <Text
                  style={[styles.iconLabel, { color: colors.foregroundSecondary }]}
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </View>
            ))}
          </View>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── Icon Weights ────────────────────────────────────── */}
        <DemoSection title="Weights" description="SF Symbol weight variants">
          <View style={styles.weightsRow}>
            {(["ultraLight", "light", "regular", "medium", "semibold", "bold", "heavy"] as const).map(
              (weight) => (
                <View key={weight} style={styles.weightItem}>
                  <IconSymbol name="star.fill" size={24} color={colors.foreground} weight={weight} />
                  <Text style={[styles.weightLabel, { color: colors.foregroundSecondary }]}>
                    {weight}
                  </Text>
                </View>
              ),
            )}
          </View>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── Icon Sizes ──────────────────────────────────────── */}
        <DemoSection title="Sizes">
          <View style={styles.sizesRow}>
            {[14, 18, 24, 32, 40, 48].map((size) => (
              <View key={size} style={styles.sizeItem}>
                <IconSymbol name="heart.fill" size={size} color={colors.primary} />
                <Text style={[styles.sizeLabel, { color: colors.foregroundSecondary }]}>
                  {size}px
                </Text>
              </View>
            ))}
          </View>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── ThemeIcon ───────────────────────────────────────── */}
        <DemoSection title="ThemeIcon" description="Icon with colored background">
          <Text style={[styles.subLabel, { color: colors.foregroundSecondary }]}>Round</Text>
          <View style={styles.themeIconRow}>
            <ThemeIcon name="star.fill" color="#FF9500" />
            <ThemeIcon name="heart.fill" color="#FF2D55" />
            <ThemeIcon name="bell.fill" color="#007AFF" />
            <ThemeIcon name="leaf.fill" color="#34C759" />
            <ThemeIcon name="flame.fill" color="#FF3B30" />
            <ThemeIcon name="bolt.fill" color="#5856D6" />
          </View>

          <Text style={[styles.subLabel, { color: colors.foregroundSecondary }]}>Square</Text>
          <View style={styles.themeIconRow}>
            <ThemeIcon name="doc.fill" color="#007AFF" square />
            <ThemeIcon name="folder.fill" color="#FF9500" square />
            <ThemeIcon name="trash.fill" color="#FF3B30" square />
            <ThemeIcon name="lock.fill" color="#5856D6" square />
          </View>
        </DemoSection>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  iconItem: { width: 64, alignItems: "center", gap: 4 },
  iconLabel: { fontSize: 8, textAlign: "center" },
  weightsRow: { flexDirection: "row", flexWrap: "wrap", gap: 16, justifyContent: "center" },
  weightItem: { alignItems: "center", gap: 6 },
  weightLabel: { fontSize: 10 },
  sizesRow: { flexDirection: "row", alignItems: "flex-end", gap: 16, justifyContent: "center" },
  sizeItem: { alignItems: "center", gap: 4 },
  sizeLabel: { fontSize: 11 },
  themeIconRow: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  subLabel: { fontSize: 13, fontWeight: "600", marginTop: 4 },
  settingsList: { gap: 0 },
  settingsRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 },
  settingsLabel: { flex: 1, fontSize: 16 },
  settingsValue: { fontSize: 15 },
  settingsDivider: { height: StyleSheet.hairlineWidth, marginLeft: 48 },
});
