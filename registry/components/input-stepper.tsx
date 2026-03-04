import React from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "@popapp/theme/use-theme";
import { Ticker } from "@popapp/components/ticker";
import { ActionIcon } from "@popapp/components/action-icon";
import { TouchableScale } from "@popapp/components/touchable-scale";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface InputStepperProps {
  style?: StyleProp<ViewStyle>;
  size?: "sm" | "md" | "lg";
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  decimals?: number;
  valueFormatter?: (value: number) => string;
  onValuePress?: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onDecrementLongPress?: () => void;
  onIncrementLongPress?: () => void;
}

// ---------------------------------------------------------------------------
// Size maps
// ---------------------------------------------------------------------------

const ACTION_ICON_SIZE = {
  sm: "small",
  md: "medium",
  lg: "large",
} as const;

const FONT_SIZE = {
  sm: 24,
  md: 40,
  lg: 48,
} as const;

const MIN_WIDTH = {
  sm: 56,
  md: 100,
  lg: 120,
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function InputStepper({
  style,
  size = "md",
  decimals = 0,
  value,
  min = 0,
  max,
  unit,
  valueFormatter,
  onValuePress,
  onIncrement,
  onDecrement,
  onDecrementLongPress,
  onIncrementLongPress,
}: InputStepperProps) {
  const { colors } = useTheme();

  const fontSize = FONT_SIZE[size];
  const minWidth = MIN_WIDTH[size];
  const displayValue = valueFormatter ? valueFormatter(value) : value;
  const isIncrementDisabled = max !== undefined ? value >= max : false;

  const valueContent = (
    <>
      <Ticker value={displayValue} fontSize={fontSize} decimals={decimals} />
      {unit && (
        <Text style={[styles.unit, { color: colors.foregroundSecondary }]}>
          {unit}
        </Text>
      )}
    </>
  );

  return (
    <View style={[styles.container, style]}>
      <ActionIcon
        size={ACTION_ICON_SIZE[size]}
        name="minus"
        onPress={onDecrement}
        onLongPress={onDecrementLongPress ?? undefined}
        disabled={value <= min}
      />

      {onValuePress ? (
        <TouchableScale
          onPress={onValuePress}
          style={[styles.valueContainer, styles.valuePressable, { minWidth }]}
        >
          {valueContent}
        </TouchableScale>
      ) : (
        <View style={[styles.valueContainer, { minWidth }]}>
          {valueContent}
        </View>
      )}

      <ActionIcon
        size={ACTION_ICON_SIZE[size]}
        name="plus"
        onPress={onIncrement}
        onLongPress={onIncrementLongPress ?? undefined}
        disabled={isIncrementDisabled}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  valueContainer: {
    alignItems: "center",
    minWidth: 100,
  },
  valuePressable: {
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  unit: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: -4,
  },
});
