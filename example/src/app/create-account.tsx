import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Screen, ScreenHeader, ScreenContent, ScreenFooter } from "@popapp/components/screen";
import { Button } from "@popapp/components/button";
import { TextInput } from "@popapp/components/text-input";
import { ActionIcon } from "@popapp/components/action-icon";

export default function CreateAccountScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const hasErrors = name.length > 0 && email.length > 0 && password.length > 0 && password.length < 8;

  return (
    <Screen>
      <ScreenHeader
        title="Create Account"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
      />
      <ScreenContent
        stickyButton={{
          title: "Create Account",
          onPress: () => router.push("/verify-code"),
          disabled: !name || !email || !password,
        }}
      >
        <View style={styles.form}>
          <TextInput
            label="Full Name"
            placeholder="Jane Cooper"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            label="Email"
            placeholder="jane@company.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            label="Password"
            placeholder="At least 8 characters"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            error={hasErrors ? "Password must be at least 8 characters" : undefined}
            rightSection={
              <ActionIcon
                variant="ghost"
                name={showPassword ? "eye.slash.fill" : "eye.fill"}
                size="sm"
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
        </View>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: { alignItems: "flex-start", marginTop: -8 },
  form: { gap: 16 },
});
