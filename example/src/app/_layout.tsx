import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ThemeProvider } from "@popapp/theme/provider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <ThemeProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "ios_from_right",
              gestureEnabled: true,
            }}
          >
            <Stack.Screen name="index" options={{ animation: "none", gestureEnabled: false }} />
            <Stack.Screen name="onboarding" options={{ animation: "none" }} />
          </Stack>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
