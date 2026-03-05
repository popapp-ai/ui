import React, { useMemo } from "react";
import { Stack, useRouter } from "expo-router";
import {
  createOnboarding,
  OnboardingProvider,
  OnboardingLayout,
  type NavigationAdapter,
} from "@popapp/components/onboarding";
import { useTheme } from "@popapp/theme/use-theme";

// ── Onboarding data shape ──────────────────────────────────────────

export interface OnboardingData {
  name: string;
  goal: string | null;
}

// ── Steps ──────────────────────────────────────────────────────────

const steps = [
  { id: "welcome", route: "/onboarding/welcome", title: "Welcome", backable: false },
  { id: "goal", route: "/onboarding/goal", title: "Choose your Goal", backable: true },
  { id: "complete", route: "/onboarding/complete", title: "All Set!", backable: true },
];

// ── Instance + hooks (created once at module scope) ────────────────

const onboarding = createOnboarding<OnboardingData>({
  steps,
  initialData: { name: "", goal: null },
});

export const { useData, useField } = onboarding;

// ── Layout ─────────────────────────────────────────────────────────

export default function OnboardingLayout_() {
  const router = useRouter();
  const { colors } = useTheme();
  const adapter = useMemo<NavigationAdapter>(
    () => ({
      push: (route: string) => router.push(route as any),
      replace: (route: string) => router.replace(route as any),
      back: () => router.back(),
      getCurrentRoute: () => undefined,
    }),
    [router],
  );

  return (
    <OnboardingProvider
      instance={onboarding}
      adapter={adapter}
      hooks={{
        onFlowComplete: () => {
          onboarding.useStore.getState().reset();
          if(router.canDismiss()) {
            router.dismissAll();
          }
          router.replace("/(tabs)");
        },
      }}
    >
      <OnboardingLayout>
        <Stack screenOptions={{ headerShown: false, gestureEnabled: false, contentStyle: { backgroundColor: colors.background}}} />
      </OnboardingLayout>
    </OnboardingProvider>
  );
}
