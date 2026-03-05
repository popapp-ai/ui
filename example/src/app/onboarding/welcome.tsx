import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@popapp/theme/use-theme";
import { OnboardingScreen } from "@popapp/components/onboarding";
import { IconSymbol } from "@popapp/components/icon-symbol";

export default function WelcomeStep() {
  const { colors } = useTheme();

  return (
    <OnboardingScreen
      options={{
        title: "Welcome",
        subtitle: "Let's get you set up in just a few steps.",
        disabled: false,
        continueLabel: "Get Started",
      }}
    >
      <View style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + "20" }]}>
          <IconSymbol name="sparkles" size={48} color={colors.primary} />
        </View>
        <Text style={[styles.heading, { color: colors.foreground }]}>
          PopApp Components
        </Text>
        <Text style={[styles.body, { color: colors.foregroundSecondary }]}>
          This demo shows the onboarding system with animated transitions,
          progress tracking, and step navigation.
        </Text>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
    paddingVertical: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
  },
});
