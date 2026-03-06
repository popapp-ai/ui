import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent, ScreenFooter } from "@popapp/components/screen";
import { ActionIcon } from "@popapp/components/action-icon";
import { Button } from "@popapp/components/button";
import { OptionGroup } from "@popapp/components/option-group";
import { IconSymbol } from "@popapp/components/icon-symbol.ios";

export default function CustomFooterExample() {
  const { colors } = useTheme();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const plans = [
    {
      value: "free",
      label: "Free",
      description: "Basic features, 1 project, community support",
    },
    {
      value: "pro",
      label: "Pro — $9/mo",
      description: "Unlimited projects, priority support, analytics",
    },
    {
      value: "team",
      label: "Team — $29/mo",
      description: "Everything in Pro, plus team collaboration & SSO",
    },
    {
      value: "enterprise",
      label: "Enterprise",
      description: "Custom pricing, dedicated support, SLA guarantee",
    },
  ];

  return (
    <Screen>
      <ScreenHeader
        title="Choose Plan"
        leftSection={
          <ActionIcon name="chevron.left" size="sm" onPress={() => router.back()} />
        }
      />
      <ScreenContent>
        <View style={styles.hero}>
          <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
            <IconSymbol name="crown.fill" size={28} color={colors.primary} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>
            Upgrade Your Experience
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.foregroundSecondary }]}>
            Select the plan that best fits your needs. You can change anytime.
          </Text>
        </View>

        <OptionGroup
          mode="single"
          options={plans}
          value={selected}
          onChange={setSelected}
        />
      </ScreenContent>

      <ScreenFooter>
        <View style={styles.footerRow}>
          <View style={styles.footerButton}>
            <Button
              title="Skip"
              variant="ghost"
              onPress={() => router.back()}
              fullWidth
            />
          </View>
          <View style={styles.footerButton}>
            <Button
              title="Continue"
              onPress={() => router.back()}
              disabled={!selected}
              fullWidth
            />
          </View>
        </View>
      </ScreenFooter>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  footerRow: {
    flexDirection: "row",
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
});
