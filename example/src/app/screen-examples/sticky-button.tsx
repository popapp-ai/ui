import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { ActionIcon } from "@popapp/components/action-icon";
import { TextInput } from "@popapp/components/text-input";
import { IconSymbol } from "@popapp/components/icon-symbol.ios";
import {
  ListSection,
  ListNavigationCell,
  ListToggleCell,
} from "@popapp/components/list";

export default function StickyButtonExample() {
  const { colors } = useTheme();
  const router = useRouter();
  const [name, setName] = useState("Sarah Johnson");
  const [email, setEmail] = useState("sarah@example.com");
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <Screen>
      <ScreenHeader
        title="Edit Profile"
        leftSection={
          <ActionIcon name="chevron.left" size="sm" onPress={() => router.back()} />
        }
      />
      <ScreenContent
        stickyButton={{
          title: "Save Changes",
          onPress: () => router.back(),
        }}
      >
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
            <IconSymbol name="person.fill" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.avatarLabel, { color: colors.primary }]}>
            Change Photo
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>

        <ListSection title="Notifications">
          <ListToggleCell
            icon="bell.fill"
            label="Push Notifications"
            value={pushEnabled}
            onToggle={setPushEnabled}
          />
          <ListToggleCell
            icon="envelope.fill"
            label="Email Notifications"
            value={emailEnabled}
            onToggle={setEmailEnabled}
            last
          />
        </ListSection>

        <ListSection title="Account">
          <ListNavigationCell
            icon="lock.fill"
            label="Change Password"
            onPress={() => {}}
          />
          <ListNavigationCell
            icon="globe"
            label="Language"
            value="English"
            onPress={() => {}}
            last
          />
        </ListSection>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  form: {
    gap: 12,
    marginBottom: 24,
  },
});
