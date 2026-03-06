import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { ActionIcon } from "@popapp/components/action-icon";
import { TextInput } from "@popapp/components/text-input";
import { OptionGroup } from "@popapp/components/option-group";
import { IconSymbol } from "@popapp/components/icon-symbol.ios";

const ITEMS = [
  { value: "design", label: "Design System", description: "Component library and tokens" },
  { value: "analytics", label: "Analytics", description: "Usage metrics and insights" },
  { value: "notifications", label: "Notifications", description: "Alerts and push settings" },
  { value: "integrations", label: "Integrations", description: "Third-party connections" },
  { value: "security", label: "Security", description: "Auth and permissions" },
  { value: "storage", label: "Storage", description: "Files and media assets" },
];

export default function CustomHeaderExample() {
  const { colors } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = ITEMS.filter(
    (item) =>
      search.length === 0 ||
      item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Screen>
      <ScreenHeader
        title="Dashboard"
        leftSection={
          <ActionIcon name="chevron.left" onPress={() => router.back()} />
        }
        rightSection={
          <ActionIcon name="bell.fill" onPress={() => {}} />
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
        {filtered.length > 0 ? (
          <OptionGroup
            mode="multi"
            options={filtered}
            value={selected}
            onChange={setSelected}
          />
        ) : (
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
