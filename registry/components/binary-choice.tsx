import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { ChoiceCard } from "@popapp/components/choice-card";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface BinaryOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface BinaryChoiceProps {
  /** Exactly two options to choose between. */
  options: [BinaryOption, BinaryOption];
  /** Currently selected value, or null if none. */
  value: string | null;
  /** Called when a selection changes. */
  onChange: (value: string) => void;
  /** Trigger haptic feedback on press. Default: true */
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BinaryChoice({
  options,
  value,
  onChange,
  haptic = true,
  style,
}: BinaryChoiceProps) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option) => (
        <ChoiceCard
          key={option.value}
          title={option.label}
          icon={option.icon}
          selected={value === option.value}
          onPress={() => onChange(option.value)}
          haptic={haptic}
        />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
  },
});
