import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { ActionIcon } from "@popapp/components/action-icon";
import { Badge } from "@popapp/components/badge";
import { Separator } from "@popapp/components/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@popapp/components/card";
import { IconSymbol } from "@popapp/components/icon-symbol.ios";

const UPDATES = [
  {
    version: "2.4.0",
    date: "Mar 5, 2026",
    badge: "Latest" as const,
    items: [
      "Added Screen component with composable header, content, and footer",
      "New gradient fading for smooth content transitions",
      "Keyboard-aware scrolling with sticky button support",
      "ScreenStickyButton for quick call-to-action patterns",
    ],
  },
  {
    version: "2.3.0",
    date: "Feb 20, 2026",
    badge: undefined,
    items: [
      "Introduced List component with navigation, toggle, and action cells",
      "Settings-style grouped sections with dividers",
      "SF Symbol icon support for list cells",
      "Destructive action cell variant",
    ],
  },
  {
    version: "2.2.0",
    date: "Feb 8, 2026",
    badge: undefined,
    items: [
      "Card component with composable header, content, and footer",
      "Badge component with multiple variants",
      "Skeleton loading placeholders",
      "ProgressRing circular indicator",
    ],
  },
  {
    version: "2.1.0",
    date: "Jan 25, 2026",
    badge: undefined,
    items: [
      "OptionGroup with vertical and horizontal layouts",
      "OptionCard with left/center alignment and checkbox",
      "Improved touch feedback with spring animations",
    ],
  },
  {
    version: "2.0.0",
    date: "Jan 10, 2026",
    badge: undefined,
    items: [
      "Complete redesign of the component library",
      "New theme system with light and dark mode",
      "Reanimated-powered animations throughout",
      "Gesture-based slider and ruler components",
      "Bottom sheet with pan-to-dismiss",
    ],
  },
];

export default function ScrollableContentExample() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <ScreenHeader
        title="Release Notes"
        leftSection={
          <ActionIcon name="chevron.left" onPress={() => router.back()} />
        }
        rightSection={
          <ActionIcon name="square.and.arrow.up" onPress={() => {}} />
        }
      />
      <ScreenContent>
        {UPDATES.map((release, index) => (
          <View key={release.version}>
            <View style={styles.releaseHeader}>
              <View style={styles.versionRow}>
                <Text style={[styles.version, { color: colors.foreground }]}>
                  v{release.version}
                </Text>
                {release.badge && (
                  <Badge label={release.badge} variant="default" />
                )}
              </View>
              <Text style={[styles.date, { color: colors.foregroundSecondary }]}>
                {release.date}
              </Text>
            </View>

            <Card>
              <CardContent>
                <View style={styles.itemList}>
                  {release.items.map((item, i) => (
                    <View key={i} style={styles.itemRow}>
                      <IconSymbol
                        name="circle.fill"
                        size={6}
                        color={colors.primary}
                        style={styles.bullet}
                      />
                      <Text style={[styles.itemText, { color: colors.foreground }]}>
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>

            {index < UPDATES.length - 1 && (
              <Separator style={styles.separator} />
            )}
          </View>
        ))}
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  releaseHeader: {
    gap: 4,
    marginBottom: 12,
  },
  versionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  version: {
    fontSize: 20,
    fontWeight: "700",
  },
  date: {
    fontSize: 13,
  },
  itemList: {
    gap: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bullet: {
    marginTop: 7,
  },
  itemText: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  separator: {
    marginVertical: 24,
  },
});
