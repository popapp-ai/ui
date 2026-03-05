import React, { useCallback, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useOnboardingContext } from "./context";
import type { ScreenOptions } from "./types";
import { ScreenContent } from "../screen";

// Use expo-router's useFocusEffect if available, otherwise fall back to useEffect
let useFocusEffect: typeof import("expo-router").useFocusEffect;
try {
  useFocusEffect = require("expo-router").useFocusEffect;
} catch {
  // Fallback: run effect immediately
  useFocusEffect = ((cb: () => void) => {
    useEffect(() => {
      cb();
    });
  }) as any;
}

const PADDING_EXTRA = 32;

export interface OnboardingScreenProps {
  options: ScreenOptions;
  children?: React.ReactNode;
}

/**
 * Per-step screen wrapper that configures the onboarding layout's header and footer.
 * Uses useFocusEffect to set screen config when the screen is focused.
 *
 * Usage:
 * ```tsx
 * <OnboardingScreen options={{ title: "Choose your Goal", disabled: goal === null }}>
 *   <OptionGroup ... />
 * </OnboardingScreen>
 * ```
 */
export function OnboardingScreen({ options, children }: OnboardingScreenProps) {
  const { instance } = useOnboardingContext();
  const { useStore } = instance;
  const setScreenConfig = useStore((s) => s.setScreenConfig);
  const screenConfig = useStore((s) => s.screenConfig);

  useFocusEffect(
    useCallback(() => {
      setScreenConfig(options);
    }, [
      JSON.stringify({
        title: options.title,
        subtitle: options.subtitle,
        disabled: options.disabled,
        loading: options.loading,
        continueLabel: options.continueLabel,
        continueHidden: options.continueHidden,
        hideProgressBar: options.hideProgressBar,
        hasHandler: options.continueHandler != null,
        hasSecondary: options.secondaryAction != null,
        secondaryLabel: options.secondaryAction?.label,
        hasCustomFooter: options.customFooter != null,
        hasHeaderRight: options.headerRight != null,
      }),
      options.continueHandler,
      options.secondaryAction?.onPress,
      options.customFooter,
      options.headerRight,
    ]),
  );

  // Read heights from screen config context (set by layout)
  const headerHeight = useStore((s) => {
    // The layout uses ScreenHeader which manages its own height via Screen context.
    // We need the onboarding store's understanding of header height for padding.
    // Since OnboardingLayout composes Screen, the Screen context handles this.
    // But for the content padding, we read from the screen config's parent measurements.
    return 0; // Will be overridden by the actual Screen context
  });

  if (!children) {
    return null;
  }

  return <ScreenContent centerContent contentContainerStyle={{ paddingBottom: 72 }}>{children}</ScreenContent>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  scrollContentInner: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
});
