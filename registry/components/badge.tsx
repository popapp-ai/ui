import React from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "@popapp/theme/use-theme";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface BadgeProps {
  children: string;
  variant?: "default" | "secondary" | "destructive" | "success" | "outline";
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Badge({ children, variant = "default", style }: BadgeProps) {
  const { colors } = useTheme();

  let bg: string;
  let fg: string;
  let borderColor: string | undefined;

  switch (variant) {
    case "secondary":
      bg = colors.cardSecondary;
      fg = colors.foreground;
      break;
    case "destructive":
      bg = colors.destructive;
      fg = colors.destructiveForeground;
      break;
    case "success":
      bg = colors.success;
      fg = colors.successForeground;
      break;
    case "outline":
      bg = "transparent";
      fg = colors.foreground;
      borderColor = colors.border;
      break;
    case "default":
    default:
      bg = colors.primary;
      fg = colors.primaryForeground;
      break;
  }

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg, borderColor: borderColor ?? "transparent" },
        style,
      ]}
    >
      <Text style={[styles.text, { color: fg }]}>{children}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
