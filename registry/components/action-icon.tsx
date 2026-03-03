import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import { useTheme } from "@popapp/theme/use-theme";
import { IconSymbol } from "@popapp/components/icon-symbol";
import type { IconSymbolName } from "@popapp/components/icon-symbol.types";
import { SafeGlassView, isGlassAvailable } from "@popapp/utils/glass";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ActionIconProps extends TouchableOpacityProps {
  /** SF Symbol name (iOS) / Material Icon mapping (Android). */
  name: IconSymbolName;
  /** Enable Liquid Glass effect. Default: true */
  glass?: boolean;
  /** Icon button size. Default: "medium" */
  size?: "small" | "medium" | "large";
  /** Disabled state. */
  disabled?: boolean;
  /** Color variant. Default: "secondary" */
  variant?: "secondary" | "primary";
}

// ---------------------------------------------------------------------------
// Size map
// ---------------------------------------------------------------------------

const SIZE_MAP = {
  small: { width: 38, height: 38 },
  medium: { width: 44, height: 44 },
  large: { width: 56, height: 56 },
} as const;

const ICON_SIZE_MAP = {
  small: 18,
  medium: 22,
  large: 26,
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ActionIcon({
  onPress,
  name,
  glass = true,
  size = "medium",
  disabled = false,
  variant = "secondary",
  style,
  ...rest
}: ActionIconProps) {
  const { colors } = useTheme();

  const sizeStyle = SIZE_MAP[size];
  const iconSize = ICON_SIZE_MAP[size];
  const useGlass = glass && isGlassAvailable();

  const bgColor = variant === "primary" ? colors.primary : colors.card;
  const textColor =
    variant === "primary" ? colors.primaryForeground : colors.foreground;

  const inner = (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={useGlass ? 1 : 0.8}
      style={[
        styles.wrapper,
        sizeStyle,
        !useGlass && { backgroundColor: bgColor },
        disabled && { opacity: 0.5 },
        style,
      ]}
      disabled={disabled}
      {...rest}
    >
      <IconSymbol name={name} size={iconSize} color={textColor} />
    </TouchableOpacity>
  );

  if (useGlass) {
    return (
      <SafeGlassView
        isInteractive={!disabled}
        tintColor={bgColor}
        style={{ borderRadius: 100 }}
      >
        {inner}
      </SafeGlassView>
    );
  }

  return inner;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
});
