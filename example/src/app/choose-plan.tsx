import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { ChoiceCard } from "@popapp/components/choice-card";
import { IconSymbol } from "@popapp/components/icon-symbol";
import { ActionIcon } from "@popapp/components/action-icon";

export default function ChoosePlanScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [plan, setPlan] = useState<string | null>(null);

  return (
    <Screen>
      <ScreenHeader
        title="Choose Your Plan"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
        bottomSection={
          <Text style={[styles.subtitle, { color: colors.foregroundSecondary }]}>
            Select the plan that works best for you
          </Text>
        }
      />
      <ScreenContent
        stickyButton={{
          title: plan ? `Continue with ${plan.charAt(0).toUpperCase() + plan.slice(1)}` : "Select a plan",
          onPress: () => router.back(),
          disabled: !plan,
        }}
      >
        <View style={styles.list}>
          <ChoiceCard
            title="Free"
            subtitle="5 projects, 1 GB storage"
            icon={<IconSymbol name="gift.fill" size={24} color={colors.foreground} />}
            selected={plan === "free"}
            onPress={() => setPlan("free")}
          />
          <ChoiceCard
            title="Pro"
            subtitle="Unlimited projects, 100 GB storage"
            icon={<IconSymbol name="bolt.fill" size={24} color={colors.foreground} />}
            selected={plan === "pro"}
            onPress={() => setPlan("pro")}
          />
          <ChoiceCard
            title="Team"
            subtitle="Everything in Pro + team features"
            icon={<IconSymbol name="person.3.fill" size={24} color={colors.foreground} />}
            selected={plan === "team"}
            onPress={() => setPlan("team")}
          />
        </View>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 15, marginBottom: 4 },
  list: { gap: 12 },
});
