import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { Button } from "@popapp/components/button";
import { OTPInput } from "@popapp/components/otp-input";
import { ActionIcon } from "@popapp/components/action-icon";

export default function VerifyCodeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [otp, setOtp] = useState("");

  return (
    <Screen>
      <ScreenHeader
        title="Email"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
      />
      <ScreenContent
        centerContent
        stickyButton={{
          title: "Verify",
          onPress: () => router.back(),
          disabled: otp.length < 6,
        }}
      >
        <View style={styles.content}>
          {/* title and subtitle */}
          <Text style={[styles.title, { color: colors.foreground }]}>Verify Email</Text>
          <Text style={[styles.subtitle, { color: colors.foregroundSecondary }]}>
            We sent a 6-digit code to jane@company.com
          </Text>
          <OTPInput value={otp} onChange={setOtp} length={6} autoFocus={false} />
          <Button title="Resend Code" variant="ghost" size="sm" onPress={() => setOtp("")} />
        </View>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "bold", marginBottom: -8 },
  subtitle: { fontSize: 15, marginBottom: 16 },
  content: { alignItems: "center", gap: 20 },
});
