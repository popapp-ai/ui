import React from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "@popapp/theme/use-theme";
import { TouchableScale } from "@popapp/components/touchable-scale";
import { impactLight } from "@popapp/utils/haptics";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ChoiceCardProps {
  /** Card title text. */
  title: string;
  /** Optional subtitle below the title. */
  subtitle?: string;
  /** Optional icon element rendered above the title. */
  icon?: React.ReactNode;
  /** Whether this card is currently selected. */
  selected?: boolean;
  /** Called when the card is pressed. */
  onPress: () => void;
  /** Trigger haptic feedback on press. Default: true */
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChoiceCard({
  title,
  subtitle,
  icon,
  selected,
  onPress,
  haptic = true,
  style,
}: ChoiceCardProps) {
  const { colors } = useTheme();

  const selectedBg = colors.primary + "10";

  const handlePress = () => {
    if (haptic) impactLight();
    onPress();
  };

  return (
    <TouchableScale
      onPress={handlePress}
      style={[
        styles.card,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? selectedBg : colors.card,
        },
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.label, { color: colors.foreground }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.foregroundSecondary }]}>
          {subtitle}
        </Text>
      )}
    </TouchableScale>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "400",
    textAlign: "center",
    marginTop: -4,
  },
});
