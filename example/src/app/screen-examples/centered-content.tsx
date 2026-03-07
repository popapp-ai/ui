import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { ActionIcon } from "@popapp/components/action-icon";
import { IconSymbol } from "@popapp/components/icon-symbol.ios";

export default function CenteredContentExample() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Screen variant="none">
      <ScreenHeader
        title=""
        rightSection={
          <ActionIcon name="xmark" onPress={() => router.back()} />
        }
      />
      <ScreenContent
        scroll={false}
        centerContent
        stickyButton={{
          title: "View Order",
          onPress: () => router.back(),
        }}
      >
        <View style={styles.content}>
          <View style={[styles.iconCircle, { backgroundColor: colors.successLight }]}>
            <IconSymbol name="checkmark" size={40} color={colors.success} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Payment Successful
          </Text>
          <Text style={[styles.subtitle, { color: colors.foregroundSecondary }]}>
            Your order has been confirmed and will be delivered within 3-5 business days.
          </Text>
          <View style={styles.amount}>
            <Text style={[styles.amountLabel, { color: colors.foregroundSecondary }]}>
              Amount Paid
            </Text>
            <Text style={[styles.amountValue, { color: colors.foreground }]}>
              $149.99
            </Text>
          </View>
        </View>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 70,
    gap: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  amount: {
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  amountLabel: {
    fontSize: 14,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: "700",
  },
});
