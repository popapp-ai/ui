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
  /** Optional icon element rendered to the left (or above in center align). */
  icon?: React.ReactNode;
  /** Whether this option is selected. */
  selected: boolean;
  /** Called when the option is pressed. */
  onPress: () => void;
  /** Show a checkbox indicator on the left. Default: false */
  showCheckbox?: boolean;
  /** Layout alignment. "left" is row-based, "center" stacks vertically. Default: "left" */
  align?: "left" | "center";
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
  align = "left",
  haptic = true,
  style,
}: OptionCardProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    if (haptic) impactLight();
    onPress();
  };

  const centered = align === "center";

  return (
    <Touchable
      onPress={handlePress}
      style={[
        centered ? styles.containerCenter : styles.container,
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
      {icon && (
        <View style={centered ? styles.iconContainerCenter : styles.iconContainer}>
          {icon}
        </View>
      )}
      <View style={centered ? undefined : styles.textContainer}>
        <Text
          style={[
            styles.label,
            centered && styles.labelCenter,
            { color: colors.foreground },
          ]}
        >
          {label}
        </Text>
        {description && (
          <Text
            style={[
              styles.description,
              centered && styles.descriptionCenter,
              { color: colors.foregroundSecondary },
            ]}
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
    borderWidth: 1,
  },
  containerCenter: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
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
  iconContainerCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  labelCenter: {
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    marginTop: 2,
  },
  descriptionCenter: {
    textAlign: "center",
    marginTop: -4,
    marginBottom: 6,
  },
});
