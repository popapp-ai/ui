import React from "react";
import { StyleSheet, Text, View, type ViewProps, type ViewStyle } from "react-native";
import { useTheme } from "@popapp/theme/use-theme";

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

export interface CardProps extends ViewProps {
  style?: ViewStyle;
}

export function Card({ children, style, ...rest }: CardProps) {
  const { colors } = useTheme();

  return (
    <View
      {...rest}
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// CardHeader
// ---------------------------------------------------------------------------

export interface CardHeaderProps extends ViewProps {
  style?: ViewStyle;
}

export function CardHeader({ children, style, ...rest }: CardHeaderProps) {
  return (
    <View {...rest} style={[styles.header, style]}>
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// CardTitle
// ---------------------------------------------------------------------------

export interface CardTitleProps {
  children: string | React.ReactNode;
  style?: ViewStyle;
}

export function CardTitle({ children, style }: CardTitleProps) {
  const { colors } = useTheme();

  return (
    <Text style={[styles.title, { color: colors.foreground }, style]}>
      {children}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// CardDescription
// ---------------------------------------------------------------------------

export interface CardDescriptionProps {
  children: string | React.ReactNode;
  style?: ViewStyle;
}

export function CardDescription({ children, style }: CardDescriptionProps) {
  const { colors } = useTheme();

  return (
    <Text style={[styles.description, { color: colors.foregroundSecondary }, style]}>
      {children}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// CardContent
// ---------------------------------------------------------------------------

export interface CardContentProps extends ViewProps {
  style?: ViewStyle;
}

export function CardContent({ children, style, ...rest }: CardContentProps) {
  return (
    <View {...rest} style={[styles.content, style]}>
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// CardFooter
// ---------------------------------------------------------------------------

export interface CardFooterProps extends ViewProps {
  style?: ViewStyle;
}

export function CardFooter({ children, style, ...rest }: CardFooterProps) {
  return (
    <View {...rest} style={[styles.footer, style]}>
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    padding: 16,
    paddingBottom: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 0,
  },
});
