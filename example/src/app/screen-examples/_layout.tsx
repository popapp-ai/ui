import { Stack } from "expo-router";

export default function ScreenExamplesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "ios_from_right", gestureEnabled: true }}>
      <Stack.Screen name="index" options={{ animation: "none" }} />
      <Stack.Screen name="sticky-button" />
      <Stack.Screen name="keyboard-form" />
      <Stack.Screen name="custom-header" />
      <Stack.Screen name="centered-content" />
      <Stack.Screen name="custom-footer" />
      <Stack.Screen name="subheader" />
      <Stack.Screen name="subfooter" />
      <Stack.Screen name="scrollable-content" />
    </Stack>
  );
}
