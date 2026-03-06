import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@popapp/theme/use-theme";
import { useColorScheme } from "@popapp/hooks/use-color-scheme";
import { SafeGlassView, isGlassAvailable } from "@popapp/utils/glass";
import { impactMedium, selectionChanged } from "@popapp/utils/haptics";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { Button } from "@popapp/components/button";
import { Card } from "@popapp/components/card";
import { IconSymbol } from "@popapp/components/icon-symbol";
import { ActionIcon } from "@popapp/components/action-icon";
import { ThemeIcon } from "@popapp/components/theme-icon";
import {
  Card as CardComp,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@popapp/components/card";
import { Badge } from "@popapp/components/badge";
import { Separator } from "@popapp/components/separator";
import { Skeleton } from "@popapp/components/skeleton";
import { Touchable } from "@popapp/components/touchable";
import { ProgressRing } from "@popapp/components/progress-ring";
import { Ticker } from "@popapp/components/ticker";
import { Markdown } from "@popapp/components/markdown";
import { BottomSheet } from "@popapp/components/bottom-sheet";
import { RulerSlider } from "@popapp/components/ruler-slider";
import { DemoSection } from "@/components/demo-section";

// ── Icons ────────────────────────────────────────────────────────────
const SAMPLE_ICONS = [
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
] as const;

function ColorSwatch({ name, color }: { name: string; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={swatch.row}>
      <View style={[swatch.box, { backgroundColor: color }]} />
      <Text style={[swatch.label, { color: colors.foreground }]}>{name}</Text>
      <Text style={[swatch.value, { color: colors.foregroundSecondary }]}>
        {color}
      </Text>
    </View>
  );
}

const swatch = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  box: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.1)",
  },
  label: { fontSize: 13, fontWeight: "600", flex: 1 },
  value: { fontSize: 12, fontFamily: "monospace" },
});

export default function ComponentsScreen() {
  const { colors, colorScheme } = useTheme();
  const systemScheme = useColorScheme();
  const tokenEntries = Object.entries(colors).slice(0, 16);

  const [tickerValue, setTickerValue] = useState(1234);
  const [progress, setProgress] = useState(72);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <Screen>
      <ScreenContent>
        {/* ── Foundation ────────────────────────────────────────── */}
        <DemoSection
          title="Color Scheme"
          description="Current scheme detection"
        >
          <Card style={styles.infoCard}>
            <Text style={{ color: colors.foreground, fontSize: 15 }}>
              Theme: <Text style={{ fontWeight: "700" }}>{colorScheme}</Text>
            </Text>
            <Text style={{ color: colors.foregroundSecondary, fontSize: 14 }}>
              System reports: {systemScheme}
            </Text>
          </Card>
        </DemoSection>

        <DemoSection title="Color Tokens" description="Theme color palette">
          <Card style={styles.tokenGrid}>
            {tokenEntries.map(([name, value]) => (
              <ColorSwatch key={name} name={name} color={value} />
            ))}
          </Card>
        </DemoSection>

        <DemoSection title="Haptics" description="Trigger haptic feedback">
          <View style={styles.row}>
            <Button
              title="Impact Medium"
              variant="outline"
              size="sm"
              onPress={() => impactMedium()}
            />
            <Button
              title="Selection"
              variant="outline"
              size="sm"
              onPress={() => selectionChanged()}
            />
          </View>
        </DemoSection>

        <DemoSection
          title="Glass Effect"
          description={
            isGlassAvailable()
              ? "Liquid Glass is available"
              : "Liquid Glass not available (fallback)"
          }
        >
          <SafeGlassView style={styles.glassDemo} tintColor={colors.primary}>
            <Text
              style={{ color: colors.primaryForeground, fontWeight: "600" }}
            >
              SafeGlassView
            </Text>
          </SafeGlassView>
        </DemoSection>

        {/* ── Icons ─────────────────────────────────────────────── */}
        <DemoSection
          title="IconSymbol"
          description="SF Symbols on iOS, Material Icons on Android"
        >
          <View style={styles.iconGrid}>
            {SAMPLE_ICONS.map((name) => (
              <View key={name} style={styles.iconItem}>
                <IconSymbol name={name} size={28} color={colors.foreground} />
                <Text
                  style={[
                    styles.iconLabel,
                    { color: colors.foregroundSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </View>
            ))}
          </View>
        </DemoSection>

        <DemoSection
          title="ActionIcon"
          description="Circular icon buttons with optional glass"
        >
          <View style={styles.row}>
            <ActionIcon name="plus" size="sm" onPress={() => {}} />
            <ActionIcon name="heart.fill" size="md" onPress={() => {}} />
            <ActionIcon
              name="trash.fill"
              size="lg"
              variant="solid"
              onPress={() => {}}
            />
            <ActionIcon
              name="square.and.arrow.up"
              size="md"
              glass
              onPress={() => {}}
            />
          </View>
        </DemoSection>

        <DemoSection
          title="ThemeIcon"
          description="Icon in tinted circle background"
        >
          <View style={styles.row}>
            <ThemeIcon name="star.fill" color="#FF9500" />
            <ThemeIcon name="heart.fill" color="#FF2D55" />
            <ThemeIcon name="bell.fill" color="#007AFF" />
            <ThemeIcon name="leaf.fill" color="#34C759" square />
          </View>
        </DemoSection>

        {/* ── Display ───────────────────────────────────────────── */}
        <DemoSection title="Card" description="Composable card layout">
          <CardComp>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>
                A brief description of the card content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text style={{ color: colors.foreground }}>
                This is the main content area of the card component.
              </Text>
            </CardContent>
            <CardFooter>
              <Button title="Action" size="sm" onPress={() => {}} />
            </CardFooter>
          </CardComp>
        </DemoSection>

        <DemoSection title="Badge" description="Status indicators">
          <View style={styles.row}>
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="outline">Outline</Badge>
          </View>
        </DemoSection>

        <DemoSection title="Separator" description="Horizontal divider">
          <View style={{ gap: 12 }}>
            <Text style={{ color: colors.foreground }}>Above</Text>
            <Separator />
            <Text style={{ color: colors.foreground }}>Below</Text>
          </View>
        </DemoSection>

        <DemoSection title="Skeleton" description="Loading placeholders">
          <View style={{ gap: 12 }}>
            <Skeleton width="100%" height={20} borderRadius={4} />
            <Skeleton width="75%" height={20} borderRadius={4} />
            <View style={styles.row}>
              <Skeleton width={48} height={48} borderRadius={24} />
              <View style={{ flex: 1, gap: 8 }}>
                <Skeleton width="60%" height={16} borderRadius={4} />
                <Skeleton width="40%" height={14} borderRadius={4} />
              </View>
            </View>
          </View>
        </DemoSection>

        <DemoSection
          title="TouchableScale"
          description="Animated pressable with spring"
        >
          <Touchable onPress={() => {}}>
            <View
              style={[
                styles.touchableDemo,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={{ color: colors.foreground, fontWeight: "600" }}>
                Press and hold me
              </Text>
            </View>
          </Touchable>
        </DemoSection>

        <DemoSection
          title="ProgressRing"
          description="Animated circular progress"
        >
          <View style={styles.centered}>
            <ProgressRing
              value={progress}
              maxValue={100}
              size={120}
              strokeWidth={10}
              centerLabel={
                <Ticker
                  value={progress}
                  fontSize={24}
                  decimals={0}
                  unit="%"
                />
              }
            />
          </View>
          <View style={styles.row}>
            <Button
              title="-10"
              variant="outline"
              size="sm"
              onPress={() => setProgress((p) => Math.max(0, p - 10))}
            />
            <Button
              title="+10"
              variant="outline"
              size="sm"
              onPress={() => setProgress((p) => Math.min(100, p + 10))}
            />
          </View>
        </DemoSection>

        <DemoSection title="Ticker" description="Animated number display">
          <View style={styles.centered}>
            <Ticker value={tickerValue} decimals={0} fontSize={48} />
          </View>
          <View style={styles.row}>
            <Button
              title="Random"
              variant="outline"
              size="sm"
              onPress={() =>
                setTickerValue(Math.floor(Math.random() * 10000))
              }
            />
            <Button
              title="+111"
              variant="outline"
              size="sm"
              onPress={() => setTickerValue((v) => v + 111)}
            />
          </View>
        </DemoSection>

        <DemoSection title="Markdown" description="Themed markdown renderer">
          <Markdown>
            {`# Heading 1\n\nThis is **bold** and *italic* text.\n\n- List item one\n- List item two\n- List item three\n\n\`inline code\` and:\n\n\`\`\`\ncode block\nwith multiple lines\n\`\`\``}
          </Markdown>
        </DemoSection>

        <DemoSection
          title="BottomSheet"
          description="Pan-to-dismiss modal sheet"
        >
          <Button
            title="Open Bottom Sheet"
            onPress={() => setSheetOpen(true)}
          />
        </DemoSection>
      </ScreenContent>

      <BottomSheet paddingBottom={-44} visible={sheetOpen} onDismiss={() => setSheetOpen(false)}>
        <View style={{ paddingHorizontal: 20, gap: 16 }}>
          <Text
            style={{
              color: colors.foreground,
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            Bottom Sheet
          </Text>
          <Text style={{ color: colors.foregroundSecondary, fontSize: 15 }}>
            This is a pan-to-dismiss bottom sheet with spring animations. Swipe
            down or tap the backdrop to dismiss.
          </Text>
          <RulerSlider
            value={sliderValue}
            onValueChange={setSliderValue}
            min={0}
            max={100}
            step={1}
            majorStep={10}
            midStep={5}
            unit="ML"
          />
          <Button title="Close" onPress={() => setSheetOpen(false)} />
        </View>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    gap: 4,
  },
  tokenGrid: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  },
  glassDemo: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  iconItem: {
    width: 72,
    alignItems: "center",
    gap: 4,
  },
  iconLabel: {
    fontSize: 9,
    textAlign: "center",
  },
  centered: {
    alignItems: "center",
  },
  touchableDemo: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
