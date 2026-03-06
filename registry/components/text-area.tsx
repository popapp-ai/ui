import React, { forwardRef, useState } from "react";
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
      minHeight = 120,
      maxHeight,
      disabled = false,
      containerStyle,
      inputStyle,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const [focused, setFocused] = useState(false);

    const borderColor = error
      ? colors.destructive
      : focused
        ? colors.primary
        : colors.border;

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
          placeholderTextColor={colors.muted}
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.input,
            {
              minHeight,
              maxHeight,
              borderColor,
              backgroundColor: colors.background,
              color: colors.foreground,
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
    borderWidth: 2,
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
