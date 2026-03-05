import React, { useState } from "react";
import { Alert, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { Button } from "@popapp/components/button";
import { ActionIcon } from "@popapp/components/action-icon";
import {
  ListSection,
  ListNavigationCell,
  ListToggleCell,
  ListActionCell,
} from "@popapp/components/list";
import { DemoSection } from "@/components/demo-section";

export default function LayoutDemoScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  return (
    <Screen>
      <ScreenHeader
        title="Layout"
        rightSection={
          <ActionIcon name="ellipsis" size="sm" onPress={() => {}} />
        }
      />
      <ScreenContent>
        {/* ── Screen Component ─────────────────────────────────── */}
        <DemoSection
          title="Screen"
          description="Composable layout with header, content, and footer. This entire tab uses the Screen component." children={undefined}        />

        {/* ── List Component ───────────────────────────────────── */}
        <DemoSection
          title="List"
          description="Settings-style grouped list cells"
        >
          <ListSection title="General">
            <ListNavigationCell
              icon="person.fill"
              label="Account"
              value="john@example.com"
              onPress={() => Alert.alert("Account")}
            />
            <ListNavigationCell
              icon="bell.fill"
              label="Notifications"
              onPress={() => Alert.alert("Notifications")}
            />
            <ListNavigationCell
              icon="globe"
              label="Language"
              value="English"
              onPress={() => Alert.alert("Language")}
              last
            />
          </ListSection>

          <ListSection title="Preferences">
            <ListToggleCell
              icon="moon.fill"
              label="Dark Mode"
              value={darkMode}
              onToggle={setDarkMode}
            />
            <ListToggleCell
              icon="bell.badge.fill"
              label="Notifications"
              value={notifications}
              onToggle={setNotifications}
            />
            <ListToggleCell
              icon="chart.bar.fill"
              label="Analytics"
              value={analytics}
              onToggle={setAnalytics}
              last
            />
          </ListSection>

          <ListSection>
            <ListActionCell
              label="Reset Settings"
              onPress={() => Alert.alert("Reset")}
            />
            <ListActionCell
              label="Delete Account"
              destructive
              onPress={() => Alert.alert("Delete")}
              last
            />
          </ListSection>
        </DemoSection>

        {/* ── Onboarding ───────────────────────────────────────── */}
        <DemoSection
          title="Onboarding"
          description="Step-based onboarding flow with animated transitions"
        >
          <Button
            title="Start Onboarding Demo"
            onPress={() => router.push("/onboarding/welcome")}
          />
        </DemoSection>
      </ScreenContent>
    </Screen>
  );
}
