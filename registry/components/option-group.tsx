import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { OptionCard } from "@popapp/components/option-card";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface OptionGroupOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface SingleSelectProps {
  options: OptionGroupOption[];
  mode: "single";
  value: string | null;
  onChange: (value: string) => void;
  /** Trigger haptic feedback. Default: true */
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface MultiSelectProps {
  options: OptionGroupOption[];
  mode: "multi";
  value: string[];
  onChange: (value: string[]) => void;
  /** Trigger haptic feedback. Default: true */
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
}

export type OptionGroupProps = SingleSelectProps | MultiSelectProps;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OptionGroup(props: OptionGroupProps) {
  const { options, mode, haptic = true, style } = props;

  const handlePress = (optionValue: string) => {
    if (mode === "single") {
      (props as SingleSelectProps).onChange(optionValue);
    } else {
      const current = (props as MultiSelectProps).value;
      const next = current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue];
      (props as MultiSelectProps).onChange(next);
    }
  };

  const isSelected = (optionValue: string): boolean => {
    if (mode === "single") {
      return (props as SingleSelectProps).value === optionValue;
    }
    return (props as MultiSelectProps).value.includes(optionValue);
  };

  return (
    <View style={[styles.container, style]}>
      {options.map((option) => (
        <OptionCard
          key={option.value}
          label={option.label}
          description={option.description}
          icon={option.icon}
          selected={isSelected(option.value)}
          onPress={() => handlePress(option.value)}
          showCheckbox={mode === "multi"}
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
    gap: 12,
  },
});
