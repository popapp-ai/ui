import type { ReactNode } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Card } from "@popapp/components/card";
import { IconSymbol } from "@popapp/components/icon-symbol";
import type { IconSymbolName } from "@popapp/components/icon-symbol.types";
import { Touchable } from "@popapp/components/touchable";
import { useTheme } from "@popapp/theme/use-theme";

// ---------------------------------------------------------------------------
// ListSection
// ---------------------------------------------------------------------------

export interface ListSectionProps {
  title?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ListSection({ title, children, style }: ListSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.sectionWrapper, style]}>
      {title && (
        <Text style={[styles.sectionTitle, { color: colors.foregroundSecondary }]}>
          {title.toUpperCase()}
        </Text>
      )}
      <Card style={styles.sectionContent}>
        <View style={styles.sectionContentInner}>{children}</View>
      </Card>
    </View>
  );
}

// ---------------------------------------------------------------------------
// ListDivider
// ---------------------------------------------------------------------------

export interface ListDividerProps {
  fullWidth?: boolean;
}

export function ListDivider({ fullWidth = false }: ListDividerProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: colors.border },
        fullWidth && styles.dividerFull,
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// ListNavigationCell
// ---------------------------------------------------------------------------

export type ListCellIcon = IconSymbolName;

export interface ListNavigationCellProps {
  icon: ListCellIcon;
  label: string;
  value?: string;
  onPress?: () => void;
  last?: boolean;
}

export function ListNavigationCell({
  icon,
  label,
  value,
  onPress,
  last = false,
}: ListNavigationCellProps) {
  const { colors } = useTheme();

  return (
    <>
      <TouchableHighlight
        underlayColor={colors.backgroundSecondary}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.cellContainer}>
          <IconSymbol name={icon} size={20} color={colors.primary} />
          <Text numberOfLines={1} style={[styles.cellLabel, { color: colors.foreground }]}>
            {label}
          </Text>
          {value && (
            <Text
              numberOfLines={1}
              style={[styles.cellValue, { color: colors.foregroundSecondary }]}
            >
              {value}
            </Text>
          )}
          {onPress && (
            <IconSymbol name="chevron.right" size={12} color={colors.muted} weight="semibold" />
          )}
        </View>
      </TouchableHighlight>
      {!last && <ListDivider />}
    </>
  );
}

// ---------------------------------------------------------------------------
// ListToggleCell
// ---------------------------------------------------------------------------

export interface ListToggleCellProps {
  icon: ListCellIcon;
  label: string;
  value: boolean;
  onToggle: (newValue: boolean) => void;
  last?: boolean;
}

export function ListToggleCell({ icon, label, value, onToggle, last = false }: ListToggleCellProps) {
  const { colors } = useTheme();

  return (
    <>
      <View style={styles.cellContainer}>
        <IconSymbol name={icon} size={20} color={colors.primary} />
        <Text numberOfLines={1} style={[styles.cellLabel, { color: colors.foreground }]}>
          {label}
        </Text>
        <Switch
          style={styles.switch}
          value={value}
          onValueChange={onToggle}
          trackColor={{ true: colors.accent, false: colors.muted }}
        />
      </View>
      {!last && <ListDivider />}
    </>
  );
}

// ---------------------------------------------------------------------------
// ListActionCell
// ---------------------------------------------------------------------------

export interface ListActionCellProps {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  last?: boolean;
}

export function ListActionCell({
  label,
  onPress,
  destructive = false,
  last = false,
}: ListActionCellProps) {
  const { colors } = useTheme();

  return (
    <>
      <Touchable onPress={onPress}>
        <View style={[styles.cellContainer, styles.centeredCell]}>
          <Text
            numberOfLines={1}
            style={{ color: destructive ? colors.destructive : colors.foreground, fontSize: 16 }}
          >
            {label}
          </Text>
        </View>
      </Touchable>
      {!last && <ListDivider />}
    </>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const CARD_BORDER_RADIUS = 20;

const styles = StyleSheet.create({
  sectionWrapper: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 16,
  },
  sectionContent: {
    padding: 0,
  },
  sectionContentInner: {
    borderRadius: CARD_BORDER_RADIUS,
    overflow: "hidden",
  },
  cellContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 54,
    gap: 12,
  },
  centeredCell: {
    justifyContent: "center",
  },
  cellLabel: {
    flex: 1,
    fontSize: 16,
  },
  cellValue: {
    fontSize: 15,
    maxWidth: "40%",
    textAlign: "right",
  },
  switch: {
    marginVertical: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 48,
  },
  dividerFull: {
    marginLeft: 0,
  },
});
