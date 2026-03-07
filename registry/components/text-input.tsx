import React, { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@popapp/theme/use-theme";

// ---------------------------------------------------------------------------
// Size tokens
// ---------------------------------------------------------------------------

const SIZE_TOKENS = {
  xs: { height: 36, borderRadius: 10, fontSize: 14, lineHeight: 18, paddingHorizontal: 12 },
  sm: { height: 44, borderRadius: 12, fontSize: 15, lineHeight: 18, paddingHorizontal: 14 },
  md: { height: 48, borderRadius: 14, fontSize: 16, lineHeight: undefined, paddingHorizontal: 16 },
  lg: { height: 56, borderRadius: 16, fontSize: 16, lineHeight: undefined, paddingHorizontal: 16 },
  xl: { height: 64, borderRadius: 16, fontSize: 18, lineHeight: undefined, paddingHorizontal: 20 },
} as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  label?: string;
  error?: string;
  variant?: "filled" | "outline";
  shape?: "pill" | "rounded";
  size?: keyof typeof SIZE_TOKENS;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      error,
      variant = "filled",
      shape = "rounded",
      size = "lg",
      leftSection,
      rightSection,
      disabled = false,
      containerStyle,
      inputStyle,
      ...rest
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const tokens = SIZE_TOKENS[size];

    const isFilled = variant === "filled";

    const containerColors = isFilled
      ? {
          backgroundColor: colors.backgroundSecondary,
          borderWidth: 0,
          borderColor: "transparent",
        }
      : {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: error ? colors.destructive : colors.border,
        };

    return (
      <View style={[disabled && styles.disabled, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: colors.foregroundSecondary }]}>
            {label}
          </Text>
        )}
        <View
          style={[
            styles.inputContainer,
            {
              height: tokens.height,
              borderRadius: shape === "pill" ? tokens.height / 2 : tokens.borderRadius,
              paddingHorizontal: tokens.paddingHorizontal,
              ...containerColors,
            },
            inputStyle,
          ]}
        >
          {leftSection && <View style={styles.leftSection}>{leftSection}</View>}

          <RNTextInput
            ref={ref}
            editable={!disabled}
            placeholderTextColor={colors.mutedForeground}
            {...rest}
            style={[
              styles.input,
              { fontSize: tokens.fontSize, lineHeight: tokens.lineHeight, color: colors.foreground },
            ]}
          />

          {rightSection && (
            <View style={styles.rightSection}>{rightSection}</View>
          )}
        </View>
        {error && (
          <Text style={[styles.error, { color: colors.destructive }]}>
            {error}
          </Text>
        )}
      </View>
    );
  },
);

TextInput.displayName = "TextInput";

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    marginHorizontal: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    lineHeight: 20,
  },
  leftSection: {
    marginRight: 6,
  },
  rightSection: {
    marginLeft: 6,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
