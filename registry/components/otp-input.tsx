import React, { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@popapp/theme/use-theme";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface OTPInputProps {
  /** Current OTP value string. */
  value: string;
  /** Called when user types a digit. */
  onChange: (value: string) => void;
  /** Number of digits. Default: 6 */
  length?: number;
  /** Auto-focus the input on mount. Default: true */
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OTPInput({
  value,
  onChange,
  length = 6,
  autoFocus = true,
  style,
}: OTPInputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={[styles.container, style]}>
      <TextInput
        autoFocus={autoFocus}
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={(text) => onChange(text.slice(0, length))}
        keyboardType="number-pad"
        autoComplete="one-time-code"
        maxLength={length}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessibilityLabel="Verification code input"
        contextMenuHidden={false}
      />
      <Pressable
        style={styles.boxesContainer}
        onPress={() => inputRef.current?.focus()}
      >
        {Array(length)
          .fill(0)
          .map((_, index) => {
            const isCurrentBox = isFocused && index === value.length;
            const isFilledBox = index < value.length;

            return (
              <View
                key={index}
                style={[
                  styles.box,
                  {
                    backgroundColor: colors.cardSecondary,
                    borderColor: isCurrentBox
                      ? colors.primary
                      : isFilledBox
                        ? "transparent"
                        : colors.border,
                  },
                ]}
              >
                <Text style={[styles.digit, { color: colors.foreground }]}>
                  {value[index] || ""}
                </Text>
              </View>
            );
          })}
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0.02,
    fontSize: 0.1,
    height: 60,
    width: "100%",
    left: 0,
    top: 0,
    zIndex: 1,
  },
  boxesContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  box: {
    width: 48,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 2,
  },
  digit: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
