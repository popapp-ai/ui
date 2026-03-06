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
// Props
// ---------------------------------------------------------------------------

export interface TextAreaProps
  extends Omit<RNTextInputProps, "style" | "multiline"> {
  label?: string;
  error?: string;
  variant?: "filled" | "outline";
  minHeight?: number;
  maxHeight?: number;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TextArea = forwardRef<RNTextInput, TextAreaProps>(
  (
    {
      label,
      error,
      variant = "filled",
      minHeight = 120,
      maxHeight,
      disabled = false,
      containerStyle,
      inputStyle,
      ...rest
    },
    ref,
  ) => {
    const { colors } = useTheme();

    const isFilled = variant === "filled";

    const inputColors = isFilled
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
        <RNTextInput
          ref={ref}
          multiline
          editable={!disabled}
          textAlignVertical="top"
          placeholderTextColor={colors.mutedForeground}
          {...rest}
          style={[
            styles.input,
            {
              minHeight,
              maxHeight,
              color: colors.foreground,
              ...inputColors,
            },
            inputStyle,
          ]}
        />
        {error && (
          <Text style={[styles.error, { color: colors.destructive }]}>
            {error}
          </Text>
        )}
      </View>
    );
  },
);

TextArea.displayName = "TextArea";

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
  input: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 20,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
