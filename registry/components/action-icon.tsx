import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import { useTheme } from "@popapp/theme/use-theme";
import { IconSymbol } from "@popapp/components/icon-symbol";
import type { IconSymbolName } from "@popapp/components/icon-symbol.types";
import { impactMedium } from "@popapp/utils/haptics";
import { SafeGlassView, isGlassAvailable } from "@popapp/utils/glass";

// ---------------------------------------------------------------------------
// Size tokens
// ---------------------------------------------------------------------------

const SIZE_TOKENS = {
  xs: { width: 32, height: 32, borderRadius: 16, iconSize: 16 },
  sm: { width: 38, height: 38, borderRadius: 19, iconSize: 18 },
  md: { width: 44, height: 44, borderRadius: 22, iconSize: 22 },
  lg: { width: 56, height: 56, borderRadius: 28, iconSize: 26 },
} as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ActionIconProps extends TouchableOpacityProps {
  /** SF Symbol name (iOS) / Material Icon mapping (Android). */
  name: IconSymbolName;
  /** Visual variant. Default: "subtle" */
  variant?: "solid" | "outline" | "ghost" | "subtle" | "destructive";
  /** Icon button size. Default: "md" */
  size?: keyof typeof SIZE_TOKENS;
  /** Disabled state. */
  disabled?: boolean;
  /** Show a loading spinner instead of the icon. */
  isLoading?: boolean;
  /** Trigger haptic feedback on press. */
  haptic?: boolean;
  /** Enable Liquid Glass effect (iOS 26+). Default: false */
  glass?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ActionIcon({
  onPress,
  name,
  variant = "subtle",
  size = "md",
  disabled = false,
  isLoading = false,
  haptic = true,
  glass = true,
  style,
  ...rest
}: ActionIconProps) {
  const { colors } = useTheme();
  const tokens = SIZE_TOKENS[size];

  const useGlass = glass && isGlassAvailable() && variant !== "ghost";

  // Resolve variant colours
  let bg: string;
  let fg: string;
  let borderColor: string | undefined;

  switch (variant) {
    case "outline":
      bg = "transparent";
      fg = colors.primary;
      borderColor = colors.primary;
      break;
    case "ghost":
      bg = "transparent";
      fg = colors.primary;
      borderColor = "transparent";
      break;
    case "subtle":
      bg = useGlass ? colors.card : colors.cardSecondary;
      fg = colors.foreground;
      borderColor = colors.border;
      break;
    case "destructive":
      bg = colors.destructive;
      fg = colors.destructiveForeground;
      borderColor = colors.destructive;
      break;
    case "solid":
    default:
      bg = disabled ? colors.muted : colors.primary;
      fg = disabled ? colors.background : colors.primaryForeground;
      borderColor = disabled ? colors.muted : colors.primary;
      break;
  }

  const handlePress = (e: any) => {
    if (haptic) impactMedium();
    onPress?.(e);
  };

  const buttonContent = (
    <TouchableOpacity
      activeOpacity={useGlass ? 1 : 0.8}
      disabled={disabled || isLoading}
      onPress={handlePress}
      {...rest}
      style={[
        styles.wrapper,
        {
          width: tokens.width,
          height: tokens.height,
          borderRadius: tokens.borderRadius,
          backgroundColor: useGlass ? "transparent" : bg,
          borderColor: useGlass ? "transparent" : borderColor,
        },
        disabled && { opacity: 0.5 },
        !useGlass && style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        <IconSymbol name={name} size={tokens.iconSize} color={fg} />
      )}
    </TouchableOpacity>
  );

  if (useGlass) {
    return (
      <SafeGlassView
        tintColor={bg}
        isInteractive={!disabled}
        style={[{ borderRadius: tokens.borderRadius }, style]}
      >
        {buttonContent}
      </SafeGlassView>
    );
  }

  return buttonContent;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
  },
});
