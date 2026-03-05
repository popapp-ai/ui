import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@popapp/theme/use-theme";
import { OnboardingScreen } from "@popapp/components/onboarding";
import { IconSymbol } from "@popapp/components/icon-symbol";
import { useData } from "./_layout";

export default function CompleteStep() {
  const { colors } = useTheme();
  const goal = useData((d) => d.goal);

  return (
    <OnboardingScreen
      options={{
        title: "All Set!",
        subtitle: "You're ready to go.",
        disabled: false,
        continueLabel: "Done",
      }}
    >
      <View style={styles.container}>
        <View style={[styles.checkContainer, { backgroundColor: colors.accent + "20" }]}>
          <IconSymbol name="checkmark.circle.fill" size={64} color={colors.accent} />
        </View>
        <Text style={[styles.heading, { color: colors.foreground }]}>
          Great choice!
        </Text>
        <Text style={[styles.body, { color: colors.foregroundSecondary }]}>
          You selected{" "}
          <Text style={{ fontWeight: "700", color: colors.foreground }}>
            {goal?.charAt(0).toUpperCase()}{goal?.slice(1)}
          </Text>
          . In a real app, this data would be saved and used to personalize your experience.
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
  checkContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
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
