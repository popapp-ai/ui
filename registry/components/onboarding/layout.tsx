import { Button } from "@popapp/components/button";
import { IconSymbol } from "@popapp/components/icon-symbol";
import { Screen, ScreenFooter, ScreenHeader } from "@popapp/components/screen";
import { useTheme } from "@popapp/theme/use-theme";
import { useEffect, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AnimatedContent } from "../animated-content";
import { OnboardingContext, useOnboardingContext } from "./context";
import { OnboardingProgressBar } from "./progress-bar";
import type { NavigationAdapter, OnboardingHooks, OnboardingInstance } from "./types";
import { useOnboarding } from "./use-onboarding";
import { ActionIcon } from "../action-icon";

const FOOTER_BUTTON_HEIGHT = 56;
const FOOTER_BUTTON_GAP = 4;
const FOOTER_HEIGHT_SINGLE = FOOTER_BUTTON_HEIGHT;
const FOOTER_HEIGHT_DOUBLE = FOOTER_BUTTON_HEIGHT + FOOTER_BUTTON_GAP + FOOTER_BUTTON_HEIGHT;

// ---------------------------------------------------------------------------
// OnboardingProvider
// ---------------------------------------------------------------------------

export interface OnboardingProviderProps<TData extends object> {
  instance: OnboardingInstance<TData>;
  adapter: NavigationAdapter;
  hooks?: OnboardingHooks<TData>;
  children: ReactNode;
}

export function OnboardingProvider<TData extends object>({
  instance,
  adapter,
  hooks = {},
  children,
}: OnboardingProviderProps<TData>) {
  return (
    <OnboardingContext.Provider value={{ instance, adapter, hooks } as any}>
      {children}
    </OnboardingContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// OnboardingLayout
// ---------------------------------------------------------------------------

export interface OnboardingLayoutProps {
  children: ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const { colors } = useTheme();
  const { instance } = useOnboardingContext();
  const { useStore } = instance;
  const { progress, canGoBack: stepCanGoBack, goBack, goNext } = useOnboarding();

  const canGoBack = stepCanGoBack;

  const screenConfig = useStore((s) => s.screenConfig);
  const navigationDirection = useStore((s) => s.navigationDirection);

  const {
    title: headerTitle,
    subtitle: headerSubtitle,
    disabled: continueDisabled,
    loading: continueLoading,
    continueLabel,
    continueHidden,
    continueHandler,
    secondaryAction,
    hideProgressBar,
    customFooter,
    headerRight: headerRightSection,
  } = screenConfig;

  const footerContentHeight = useSharedValue(
    secondaryAction ? FOOTER_HEIGHT_DOUBLE : FOOTER_HEIGHT_SINGLE,
  );

  const handleBack = () => {
    goBack();
  };

  const handleContinue = () => {
    if (continueHandler) {
      continueHandler();
    } else {
      goNext();
    }
  };

  useEffect(() => {
    footerContentHeight.value = withTiming(
      secondaryAction ? FOOTER_HEIGHT_DOUBLE : FOOTER_HEIGHT_SINGLE,
      { duration: 220, easing: Easing.out(Easing.cubic) },
    );
  }, [secondaryAction, footerContentHeight]);

  const footerContentAnimatedStyle = useAnimatedStyle(() => ({
    height: footerContentHeight.value,
  }));

  const headerContent = (
    <AnimatedContent
      contentKey={`${headerTitle}-${headerSubtitle}`}
      preset="horizontal-slide"
      direction={navigationDirection === "backward" ? "backward" : "forward"}
      style={layoutStyles.headerContent}
    >
      {headerTitle ? (
        <Text style={[layoutStyles.title, { color: colors.foreground }]}>{headerTitle}</Text>
      ) : null}
      {headerSubtitle ? (
        <Text style={[layoutStyles.subtitle, { color: colors.foregroundSecondary }]}>
          {headerSubtitle}
        </Text>
      ) : null}
    </AnimatedContent>
  );

  return (
    <Screen backgroundColor={colors.background}>
      <ScreenHeader
        leftSection={
          canGoBack ? (
            <ActionIcon
              name="chevron.left"
              size="md"
              onPress={handleBack}
            />
          ) : (
            <View style={layoutStyles.backPlaceholder} />
          )
        }
        title={
          !hideProgressBar ? (
            <OnboardingProgressBar progress={progress} />
          ) : (
            <View style={{ flex: 1 }} />
          )
        }
        rightSection={
          headerRightSection ? (
            <View style={layoutStyles.headerRightSection}>{headerRightSection}</View>
          ) : (
            <View style={layoutStyles.backPlaceholder} />
          )
        }
        bottomSection={headerContent}
      />

      {children}

      {!continueHidden && !customFooter && (
        <ScreenFooter>
          <Animated.View style={[layoutStyles.footerContent, footerContentAnimatedStyle]}>
            <Button
              title={continueLabel || "Continue"}
              onPress={handleContinue}
              disabled={continueDisabled}
              isLoading={continueLoading}
              style={layoutStyles.continueButton}
            />
            {secondaryAction && (
              <Button
                title={secondaryAction.label}
                variant="ghost"
                onPress={secondaryAction.onPress}
                style={layoutStyles.secondaryButton}
              />
            )}
          </Animated.View>
        </ScreenFooter>
      )}

      {customFooter && <ScreenFooter>{customFooter}</ScreenFooter>}
    </Screen>
  );
}

const layoutStyles = StyleSheet.create({
  headerContent: {
    paddingHorizontal: 4,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  backPlaceholder: {
    width: 44,
    height: 44,
  },
  headerRightSection: {
    minWidth: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  footerContent: {
    width: "100%",
  },
  continueButton: {
    width: "100%",
  },
  secondaryButton: {
    width: "100%",
    marginTop: 4,
  },
});
