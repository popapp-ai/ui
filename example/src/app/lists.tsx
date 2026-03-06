import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { ActionIcon } from "@popapp/components/action-icon";
import {
  ListSection,
  ListNavigationCell,
  ListToggleCell,
  ListActionCell,
} from "@popapp/components/list";
import { Separator } from "@popapp/components/separator";
import { DemoSection } from "@/components/demo-section";

export default function ListsScreen() {
  const router = useRouter();
  const [faceId, setFaceId] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [locationServices, setLocationServices] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  return (
    <Screen>
      <ScreenHeader
        title="Lists"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
      />
      <ScreenContent>
        {/* ── Real-world: Settings Page ───────────────────────── */}
        <DemoSection title="In Context" description="A full settings page built with List components">
          <ListSection title="Account">
            <ListNavigationCell
              icon="person.circle.fill"
              label="Profile"
              value="Jane Cooper"
              onPress={() => Alert.alert("Profile")}
            />
            <ListNavigationCell
              icon="envelope.fill"
              label="Email"
              value="jane@co.com"
              onPress={() => Alert.alert("Email")}
            />
            <ListNavigationCell
              icon="key.fill"
              label="Password"
              value="Changed 3 days ago"
              onPress={() => Alert.alert("Password")}
              last
            />
          </ListSection>

          <ListSection title="Security">
            <ListToggleCell
              icon="faceid"
              label="Face ID"
              value={faceId}
              onToggle={setFaceId}
            />
            <ListNavigationCell
              icon="lock.shield.fill"
              label="Two-Factor Auth"
              value="Enabled"
              onPress={() => Alert.alert("2FA")}
              last
            />
          </ListSection>

          <ListSection title="Preferences">
            <ListToggleCell
              icon="bell.badge.fill"
              label="Notifications"
              value={notifications}
              onToggle={setNotifications}
            />
            <ListToggleCell
              icon="arrow.down.circle.fill"
              label="Auto-Update"
              value={autoUpdate}
              onToggle={setAutoUpdate}
            />
            <ListToggleCell
              icon="location.fill"
              label="Location Services"
              value={locationServices}
              onToggle={setLocationServices}
            />
            <ListToggleCell
              icon="chart.bar.fill"
              label="Share Analytics"
              value={analytics}
              onToggle={setAnalytics}
              last
            />
          </ListSection>

          <ListSection title="About">
            <ListNavigationCell
              icon="doc.text.fill"
              label="Terms of Service"
              onPress={() => Alert.alert("Terms")}
            />
            <ListNavigationCell
              icon="hand.raised.fill"
              label="Privacy Policy"
              onPress={() => Alert.alert("Privacy")}
            />
            <ListNavigationCell
              icon="questionmark.circle.fill"
              label="Help & Support"
              onPress={() => Alert.alert("Help")}
              last
            />
          </ListSection>

          <ListSection>
            <ListActionCell label="Sign Out" onPress={() => Alert.alert("Sign Out")} />
            <ListActionCell
              label="Delete Account"
              destructive
              onPress={() => Alert.alert("Delete Account", "This action cannot be undone.")}
              last
            />
          </ListSection>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── Navigation Cells ────────────────────────────────── */}
        <DemoSection title="ListNavigationCell" description="Tappable cells with chevron">
          <ListSection>
            <ListNavigationCell
              icon="globe"
              label="Without Value"
              onPress={() => {}}
            />
            <ListNavigationCell
              icon="paintbrush.fill"
              label="With Value"
              value="Automatic"
              onPress={() => {}}
            />
            <ListNavigationCell
              icon="info.circle.fill"
              label="No onPress (static)"
              value="Read-only"
              last
            />
          </ListSection>
        </DemoSection>

        {/* ── Toggle Cells ────────────────────────────────────── */}
        <DemoSection title="ListToggleCell" description="Cells with Switch control">
          <ListSection>
            <ListToggleCell
              icon="moon.fill"
              label="Dark Mode"
              value={false}
              onToggle={() => {}}
            />
            <ListToggleCell
              icon="airplane"
              label="Airplane Mode"
              value={true}
              onToggle={() => {}}
              last
            />
          </ListSection>
        </DemoSection>

        {/* ── Action Cells ────────────────────────────────────── */}
        <DemoSection title="ListActionCell" description="Centered action buttons">
          <ListSection>
            <ListActionCell label="Restore Purchases" onPress={() => {}} />
            <ListActionCell label="Clear Cache" onPress={() => {}} />
            <ListActionCell label="Delete All Data" destructive onPress={() => {}} last />
          </ListSection>
        </DemoSection>
      </ScreenContent>
    </Screen>
  );
}
