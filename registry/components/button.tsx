import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
  View,
} from "react-native";
import { useTheme } from "@popapp/theme/use-theme";
import { impactMedium } from "@popapp/utils/haptics";
import { SafeGlassView, isGlassAvailable } from "@popapp/utils/glass";
import { Touchable } from "./touchable";
import { IconSymbolName } from "./icon-symbol.types";
import { IconSymbol } from "./icon-symbol";

// ---------------------------------------------------------------------------
// Size tokens
// ---------------------------------------------------------------------------

const SIZE_TOKENS = {
  xs: { height: 36, borderRadius: 10, fontSize: 14, paddingHorizontal: 12 },
  sm: { height: 44, borderRadius: 12, fontSize: 14, paddingHorizontal: 12 },
  md: { height: 48, borderRadius: 14, fontSize: 16, paddingHorizontal: 16 },
  lg: { height: 56, borderRadius: 16, fontSize: 16, paddingHorizontal: 24 },
  xl: { height: 64, borderRadius: 16, fontSize: 18, paddingHorizontal: 28 },
} as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ButtonProps extends TouchableOpacityProps {
  /** Button label text. */
  title: string;
  variant?: "solid" | "outline" | "ghost" | "subtle" | "destructive";
  shape?: "pill" | "rounded";
  size?: keyof typeof SIZE_TOKENS;
  isLoading?: boolean;
  leftIcon?: React.ReactNode | IconSymbolName;
  rightIcon?: React.ReactNode | IconSymbolName;
  /** Trigger haptic feedback on press. */
  haptic?: boolean;
  fullWidth?: boolean;
  /** Enable Liquid Glass effect (iOS 26+). Default: false */
  glass?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Button({
  onPress,
  title,
  variant = "solid",
  shape = "pill",
  size = "lg",
  isLoading = false,
  style,
  leftIcon,
  rightIcon,
  disabled,
  haptic = true,
  fullWidth = false,
  glass = true,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();
  const tokens = SIZE_TOKENS[size];

  const useGlass = glass && isGlassAvailable() && variant !== "ghost" && variant !== "outline";

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
      borderColor = 'transparent';
      break;
    case "subtle":
      bg = useGlass ? colors.card : colors.cardSecondary;
      fg = colors.foreground;
      borderColor = colors.cardSecondary;
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

  const borderRadius = shape === "pill" ? tokens.height / 2 : tokens.borderRadius;

  const handlePress = (e: any) => {
    if (haptic) impactMedium();
    onPress?.(e);
  };

  const TouchableComponent = useGlass ? TouchableOpacity : Touchable;

  const buttonContent = (
    <TouchableComponent
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      onPress={handlePress}
      {...rest}
      style={[!useGlass && style, fullWidth && { width: "100%" }]}
    >
      <View
        style={[
          styles.button,
          {
            borderRadius,
            backgroundColor: useGlass ? "transparent" : bg,
            borderColor: useGlass ? "transparent" : borderColor,
            height: tokens.height,            
            paddingHorizontal: tokens.paddingHorizontal,
          },
        ]}
      >
        <View style={styles.content}>
          {leftIcon && !isLoading && (
            <View style={styles.iconLeft}>{typeof leftIcon === "string" ? <IconSymbol name={leftIcon} size={tokens.fontSize} color={fg} /> : leftIcon}</View>
          )}

          {isLoading ? (
            <ActivityIndicator size="small" color={fg} />
          ) : (
            <Text style={[styles.text, { color: fg, fontSize: tokens.fontSize }]}>
              {title}
            </Text>
          )}

          {rightIcon && !isLoading && (
            <View style={styles.iconRight}>{typeof rightIcon === "string" ? <IconSymbol name={rightIcon} size={tokens.fontSize} color={fg} /> : rightIcon}</View>
          )}
        </View>
      </View>
    </TouchableComponent>
  );

  if (useGlass) {
    return (
      <SafeGlassView
        tintColor={bg}
        isInteractive={!disabled}
        style={[style, { borderRadius, height: tokens.height }]}
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
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
