import { Stack } from "expo-router";

export default function ScreenExamplesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
      <Stack.Screen name="sticky-button" />
      <Stack.Screen name="keyboard-form" />
      <Stack.Screen name="custom-header" />
      <Stack.Screen name="centered-content" />
      <Stack.Screen name="custom-footer" />
      <Stack.Screen name="scrollable-content" />
    </Stack>
  );
}
