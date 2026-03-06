import React from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "@popapp/theme/use-theme";
import { IconSymbol } from "@popapp/components/icon-symbol";
import { Touchable } from "@popapp/components/touchable";
import { impactLight } from "@popapp/utils/haptics";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface OptionCardProps {
  /** Option label text. */
  label: string;
  /** Optional description below the label. */
  description?: string;
  /** Optional icon element rendered to the left. */
  icon?: React.ReactNode;
  /** Whether this option is selected. */
  selected: boolean;
  /** Called when the option is pressed. */
  onPress: () => void;
  /** Show a checkbox indicator on the left. Default: false */
  showCheckbox?: boolean;
  /** Trigger haptic feedback on press. Default: true */
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OptionCard({
  label,
  description,
  icon,
  selected,
  onPress,
  showCheckbox = false,
  haptic = true,
  style,
}: OptionCardProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    if (haptic) impactLight();
    onPress();
  };

  return (
    <Touchable
      onPress={handlePress}
      style={[
        styles.container,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: colors.card,
        },
        style,
      ]}
    >
      {showCheckbox && (
        <View
          style={[
            styles.checkbox,
            {
              borderColor: selected ? colors.primary : colors.border,
              backgroundColor: selected
                ? colors.primary
                : colors.backgroundSecondary,
            },
          ]}
        >
          {selected && (
            <IconSymbol name="checkmark" weight="bold" size={14} color={colors.primaryForeground} />
          )}
        </View>
      )}
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: colors.foreground }]}>
          {label}
        </Text>
        {description && (
          <Text
            style={[styles.description, { color: colors.foregroundSecondary }]}
          >
            {description}
          </Text>
        )}
      </View>
    </Touchable>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    marginTop: 2,
  },
});
