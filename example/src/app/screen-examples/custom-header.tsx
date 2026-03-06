import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { ActionIcon } from "@popapp/components/action-icon";
import { TextInput } from "@popapp/components/text-input";
import { Badge } from "@popapp/components/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@popapp/components/card";
import { IconSymbol } from "@popapp/components/icon-symbol.ios";

export default function CustomHeaderExample() {
  const { colors } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const items = [
    { title: "Design System", desc: "Component library and tokens", icon: "paintpalette.fill" as const, badge: "12 items" },
    { title: "Analytics", desc: "Usage metrics and insights", icon: "chart.bar.fill" as const, badge: "New" },
    { title: "Notifications", desc: "Alerts and push settings", icon: "bell.fill" as const, badge: "3" },
    { title: "Integrations", desc: "Third-party connections", icon: "link" as const, badge: "5 active" },
    { title: "Security", desc: "Auth and permissions", icon: "lock.shield.fill" as const, badge: undefined },
    { title: "Storage", desc: "Files and media assets", icon: "externaldrive.fill" as const, badge: "2.4 GB" },
  ];

  const filtered = items.filter(
    (item) =>
      search.length === 0 ||
      item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Screen>
      <ScreenHeader
        title="Dashboard"
        leftSection={
          <ActionIcon name="chevron.left" size="sm" onPress={() => router.back()} />
        }
        rightSection={
          <View style={styles.headerRight}>
            <ActionIcon name="bell.fill" size="sm" onPress={() => {}} />
            <ActionIcon name="plus" size="sm" onPress={() => {}} />
          </View>
        }
        bottomSection={
          <TextInput
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            size="sm"
            leftSection={
              <IconSymbol name="magnifyingglass" size={16} color={colors.foregroundSecondary} />
            }
          />
        }
      />
      <ScreenContent>
        <View style={styles.grid}>
          {filtered.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <View style={styles.cardTop}>
                  <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
                    <IconSymbol name={item.icon} size={20} color={colors.primary} />
                  </View>
                  {item.badge && <Badge label={item.badge} variant="secondary" />}
                </View>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </View>

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <IconSymbol name="magnifyingglass" size={32} color={colors.foregroundSecondary} />
            <Text style={[styles.emptyText, { color: colors.foregroundSecondary }]}>
              No results for "{search}"
            </Text>
          </View>
        )}
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    gap: 4,
  },
  grid: {
    gap: 12,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
  },
});
