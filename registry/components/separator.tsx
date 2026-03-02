import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "@popapp/theme/use-theme";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SeparatorProps {
  /** Orientation of the separator. Default: "horizontal" */
  orientation?: "horizontal" | "vertical";
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Separator({
  orientation = "horizontal",
  style,
}: SeparatorProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        orientation === "horizontal" ? styles.horizontal : styles.vertical,
        { backgroundColor: colors.border },
        style,
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    height: "100%",
  },
});
