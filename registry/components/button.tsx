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

// ---------------------------------------------------------------------------
// Size tokens
// ---------------------------------------------------------------------------

const SIZE_TOKENS = {
  xs: { height: 36, borderRadius: 18, fontSize: 14, paddingHorizontal: 12 },
  sm: { height: 44, borderRadius: 22, fontSize: 14, paddingHorizontal: 12 },
  md: { height: 48, borderRadius: 24, fontSize: 16, paddingHorizontal: 16 },
  lg: { height: 56, borderRadius: 28, fontSize: 16, paddingHorizontal: 24 },
} as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ButtonProps extends TouchableOpacityProps {
  /** Button label text. */
  title: string;
  variant?: "solid" | "outline" | "ghost" | "subtle" | "destructive";
  size?: keyof typeof SIZE_TOKENS;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
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
  title,
  variant = "solid",
  size = "lg",
  isLoading = false,
  style,
  leftIcon,
  rightIcon,
  disabled,
  haptic = true,
  onPress,
  fullWidth = false,
  glass = false,
  ...rest
}: ButtonProps) {
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
      borderColor = 'transparent';
      break;
    case "subtle":
      bg = colors.cardSecondary;
      fg = colors.foreground;
      borderColor = colors.border;
      break;
    case "destructive":
      bg = colors.destructive;
      fg = colors.destructiveForeground;
      break;
    case "solid":
    default:
      bg = disabled ? colors.muted : colors.primary;
      fg = disabled ? colors.background : colors.primaryForeground;
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
      style={[style, fullWidth && { width: "100%" }]}
    >
      <View
        style={[
          styles.button,
          {
            borderRadius: tokens.borderRadius,
            backgroundColor: useGlass ? "transparent" : bg,
            borderColor: useGlass ? "transparent" : borderColor,
            height: tokens.height,
            paddingHorizontal: tokens.paddingHorizontal,
          },
        ]}
      >
        <View style={styles.content}>
          {leftIcon && !isLoading && (
            <View style={styles.iconLeft}>{leftIcon}</View>
          )}

          {isLoading ? (
            <ActivityIndicator size="small" color={fg} />
          ) : (
            <Text style={[styles.text, { color: fg, fontSize: tokens.fontSize }]}>
              {title}
            </Text>
          )}

          {rightIcon && !isLoading && (
            <View style={styles.iconRight}>{rightIcon}</View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (useGlass) {
    return (
      <SafeGlassView
        tintColor={bg}
        isInteractive={!disabled}
        style={{ borderRadius: tokens.borderRadius }}
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
    borderWidth: StyleSheet.hairlineWidth,
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
