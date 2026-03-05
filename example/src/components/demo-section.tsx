import React from "react";
import { View, Text, StyleSheet, type ViewStyle } from "react-native";
import { useTheme } from "@popapp/theme/use-theme";

interface DemoSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function DemoSection({
  title,
  description,
  children,
  style,
}: DemoSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      {description && (
        <Text style={[styles.description, { color: colors.foregroundSecondary }]}>
          {description}
        </Text>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
  },
  content: {
    gap: 12,
  },
});
