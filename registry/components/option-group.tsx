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

interface BaseProps {
  options: OptionGroupOption[];
  /** Layout direction. Default: "vertical" */
  layout?: "vertical" | "horizontal";
  /** Trigger haptic feedback. Default: true */
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface SingleSelectProps extends BaseProps {
  mode: "single";
  value: string | null;
  onChange: (value: string) => void;
}

interface MultiSelectProps extends BaseProps {
  mode: "multi";
  value: string[];
  onChange: (value: string[]) => void;
}

export type OptionGroupProps = SingleSelectProps | MultiSelectProps;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OptionGroup(props: OptionGroupProps) {
  const { options, mode, layout = "vertical", haptic = true, style } = props;

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

  const isHorizontal = layout === "horizontal";

  return (
    <View style={[isHorizontal ? styles.horizontal : styles.vertical, style]}>
      {options.map((option) => (
        <OptionCard
          key={option.value}
          label={option.label}
          description={option.description}
          icon={option.icon}
          selected={isSelected(option.value)}
          onPress={() => handlePress(option.value)}
          showCheckbox={mode === "multi"}
          align={isHorizontal ? "center" : "left"}
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
  vertical: {
    gap: 12,
  },
  horizontal: {
    flexDirection: "row",
    gap: 12,
  },
});
