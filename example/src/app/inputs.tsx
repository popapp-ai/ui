import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { TextInput } from "@popapp/components/text-input";
import { TextArea } from "@popapp/components/text-area";
import { ActionIcon } from "@popapp/components/action-icon";
import { IconSymbol } from "@popapp/components/icon-symbol";
import { Separator } from "@popapp/components/separator";
import { ListSection, ListNavigationCell, ListToggleCell } from "@popapp/components/list";
import { DemoSection } from "@/components/demo-section";

export default function InputsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  return (
    <Screen>
      <ScreenHeader
        title="Text Inputs"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
      />
      <ScreenContent>
        {/* ── In Context: full-screen demos ───────────────────── */}
        <DemoSection title="In Context" description="Full-screen input experiences">
          <ListSection>
            <ListNavigationCell
              icon="person.badge.plus"
              label="Create Account"
              value="Sign-up form"
              onPress={() => router.push("/create-account")}
            />
            <ListNavigationCell
              icon="lock.fill"
              label="Verify Code"
              value="OTP input"
              onPress={() => router.push("/verify-code")}
              last
            />
          </ListSection>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── Controls ─────────────────────────────────────────── */}
        <ListSection title="Toggle Props">
          <ListToggleCell icon="xmark.circle" label="Disabled" value={disabled} onToggle={setDisabled} />
          <ListToggleCell icon="exclamationmark.triangle" label="Show Errors" value={showErrors} onToggle={setShowErrors} last />
        </ListSection>

        {/* ── Variants ──────────────────────────────────────── */}
        <DemoSection title="Variants" description="Filled (default) and outline styles">
          <View style={styles.form}>
            <TextInput
              label="Filled"
              placeholder="Native filled input..."
              variant="filled"
              disabled={disabled}
            />
            <TextInput
              label="Outline"
              placeholder="Outline input..."
              variant="outline"
              disabled={disabled}
            />
          </View>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── TextInput Sizes ─────────────────────────────────── */}
        <DemoSection title="Sizes">
          <View style={styles.form}>
            {(["sm", "md", "lg"] as const).map((size) => (
              <TextInput
                key={size}
                label={`Size: ${size.toUpperCase()}`}
                placeholder={`${size} input`}
                size={size}
                disabled={disabled}
              />
            ))}
          </View>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── With Sections ───────────────────────────────────── */}
        <DemoSection title="With Icons & Sections">
          <View style={styles.form}>
            <TextInput
              label="Search"
              placeholder="Search products..."
              leftSection={
                <IconSymbol name="magnifyingglass" size={18} color={colors.icon} />
              }
              disabled={disabled}
            />
            <TextInput
              label="Website"
              placeholder="example.com"
              keyboardType="url"
              autoCapitalize="none"
              variant="outline"
              leftSection={
                <Text style={[styles.inputPrefix, { color: colors.foregroundSecondary }]}>https://</Text>
              }
              disabled={disabled}
            />
            <TextInput
              label="Price"
              placeholder="0.00"
              keyboardType="decimal-pad"
              leftSection={
                <Text style={[styles.inputPrefix, { color: colors.foregroundSecondary }]}>$</Text>
              }
              rightSection={
                <Text style={[styles.inputSuffix, { color: colors.foregroundSecondary }]}>USD</Text>
              }
              disabled={disabled}
            />
          </View>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── Error States ────────────────────────────────────── */}
        <DemoSection title="Error States">
          <View style={styles.form}>
            <TextInput
              label="Username"
              placeholder="Choose a username"
              error="Username 'admin' is already taken"
              value="admin"
              disabled={disabled}
            />
            <TextInput
              label="Phone"
              placeholder="+1 (555) 000-0000"
              keyboardType="phone-pad"
              variant="outline"
              error="Invalid phone number format"
              value="123"
              disabled={disabled}
            />
          </View>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── TextArea ────────────────────────────────────────── */}
        <DemoSection title="TextArea" description="Multi-line text input">
          <View style={styles.form}>
            <TextArea
              label="Feedback"
              placeholder="Tell us what you think about the app..."
              disabled={disabled}
            />
            <TextArea
              label="Bug Report"
              placeholder="Describe the issue in detail..."
              variant="outline"
              error={showErrors ? "Please provide at least 20 characters" : undefined}
              minHeight={100}
              disabled={disabled}
            />
          </View>
        </DemoSection>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: 16 },
  inputPrefix: { fontSize: 15 },
  inputSuffix: { fontSize: 13, fontWeight: "500" },
});
