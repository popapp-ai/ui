import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewStyle,
} from "react-native";
import { KeyboardAwareScrollView, KeyboardStickyView } from "react-native-keyboard-controller";
import Animated, {
  type EntryExitAnimationFunction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@popapp/components/button";
import { useTheme } from "@popapp/theme/use-theme";
import { GradientTint } from "@popapp/utils/gradient-tint";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ScreenContextValue {
  headerHeight: number;
  footerHeight: number;
  setHeaderHeight: (height: number) => void;
  setFooterHeight: (height: number) => void;
  backgroundColor?: string;
  animateInsets?: boolean;
  insideModal?: boolean;
  extraBottomOffset: number;
  ignoreKeyboard?: boolean;
}

const ScreenContext = createContext<ScreenContextValue | null>(null);

export function useScreenContext() {
  const ctx = useContext(ScreenContext);
  if (!ctx) {
    throw new Error("useScreenContext must be used within a <Screen>");
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Screen (root)
// ---------------------------------------------------------------------------

export interface ScreenProps {
  children: ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  insideModal?: boolean;
  extraBottomOffset?: number;
  ignoreKeyboard?: boolean;
  animateInsets?: boolean;
}

export function Screen({
  children,
  style,
  backgroundColor,
  insideModal = false,
  extraBottomOffset = 0,
  ignoreKeyboard = false,
  animateInsets,
}: ScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(insets.top + 16);
  const [footerHeight, setFooterHeight] = useState(insets.bottom + 16);

  return (
    <ScreenContext.Provider
      value={{
        headerHeight,
        footerHeight,
        setHeaderHeight,
        setFooterHeight,
        backgroundColor,
        animateInsets,
        insideModal,
        extraBottomOffset,
        ignoreKeyboard,
      }}
    >
      <View style={[{ flex: 1, backgroundColor: backgroundColor ?? colors.background }, style]}>
        {children}
      </View>
    </ScreenContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// ScreenHeader
// ---------------------------------------------------------------------------

export interface ScreenHeaderProps {
  title?: string | ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  bottomSection?: ReactNode;
  gradient?: boolean;
  gradientOpacity?: number;
  transparent?: boolean;
  style?: ViewStyle;
}

export function ScreenHeader({
  title,
  leftSection,
  rightSection,
  bottomSection,
  gradient = true,
  gradientOpacity = 1,
  transparent = false,
  style,
}: ScreenHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { headerHeight, setHeaderHeight, backgroundColor, insideModal } = useScreenContext();
  const paddingTop = insideModal ? 12 : insets.top;
  const measuredHeight = useRef(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const newHeight = e.nativeEvent.layout.height;
    if (Math.abs(newHeight - measuredHeight.current) > 2) {
      measuredHeight.current = newHeight;
      setHeaderHeight(newHeight);
    }
  };

  useEffect(() => () => setHeaderHeight(insets.top + 16), [insets.top]);

  const hasContent = leftSection || rightSection || title;

  return (
    <View style={[headerStyles.container, style]} onLayout={onLayout}>
      {gradient && !transparent && (
        <GradientTint
          backgroundColor={backgroundColor ?? colors.background}
          totalHeight={headerHeight + 24}
          startPointY={headerHeight / (headerHeight + 64)}
          opacity={gradientOpacity}
        />
      )}
      <View style={[headerStyles.bar, { paddingTop }]}>
        {hasContent && (
          <View style={headerStyles.row}>
            <View style={headerStyles.sideSlot}>{leftSection}</View>
            <View style={headerStyles.centerSlot}>
              {typeof title === "string" ? (
                <Text style={[headerStyles.title, { color: colors.foreground }]} numberOfLines={1}>
                  {title}
                </Text>
              ) : (
                title
              )}
            </View>
            <View style={[headerStyles.sideSlot, headerStyles.rightSlot]}>{rightSection}</View>
          </View>
        )}
        {bottomSection && <View style={headerStyles.bottomSection}>{bottomSection}</View>}
      </View>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  bar: {
    paddingHorizontal: 20,
  },
  row: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
  },
  sideSlot: {
    minWidth: 44,
    alignItems: "flex-start",
  },
  rightSlot: {
    alignItems: "flex-end",
  },
  centerSlot: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },
  bottomSection: {
    paddingBottom: 8,
  },
});

// ---------------------------------------------------------------------------
// ScreenContent
// ---------------------------------------------------------------------------

const PADDING_EXTRA = 16;
const SPRING_CONFIG = { stiffness: 250, damping: 40, mass: 1 };

export interface StickyButtonConfig {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export interface ScreenContentProps {
  children: ReactNode;
  scroll?: boolean;
  padTop?: boolean;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  centerContent?: boolean;
  scaleInEntering?: boolean;
  stickyButton?: StickyButtonConfig;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function ScreenContent({
  children,
  scroll = true,
  padTop = true,
  contentContainerStyle,
  style,
  centerContent = false,
  scaleInEntering = false,
  stickyButton,
  onScroll,
}: ScreenContentProps) {
  const { headerHeight, footerHeight, animateInsets } = useScreenContext();

  const stickyExtra = stickyButton ? STICKY_BUTTON_TOTAL_HEIGHT : 0;
  const animPaddingTop = useSharedValue(padTop ? headerHeight + PADDING_EXTRA : 0);
  const animPaddingBottom = useSharedValue(footerHeight + PADDING_EXTRA + stickyExtra);

  // biome-ignore lint: reanimated shared values
  useEffect(() => {
    const bottomTarget = footerHeight + PADDING_EXTRA + stickyExtra;
    if (!animateInsets) {
      animPaddingTop.value = padTop ? headerHeight + PADDING_EXTRA : 0;
      animPaddingBottom.value = bottomTarget;
      return;
    }
    animPaddingTop.value = withSpring(padTop ? headerHeight + PADDING_EXTRA : 0, SPRING_CONFIG);
    animPaddingBottom.value = withSpring(bottomTarget, SPRING_CONFIG);
  }, [headerHeight, footerHeight, padTop, animateInsets, stickyExtra]);

  const animatedPadding = useAnimatedStyle(() => ({
    paddingTop: animPaddingTop.value,
    paddingBottom: animPaddingBottom.value,
  }));

  if (scroll) {
    return (
      <>
        <KeyboardAwareScrollView
          style={[contentStyles.scroll, style]}
          contentContainerStyle={[
            contentStyles.scrollContent,
            centerContent ? contentStyles.centerContent : null,
            contentContainerStyle
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={onScroll}
          // centerContent={centerContent}
        >
          <Animated.View
            style={animatedPadding}
            entering={scaleInEntering ? scaleIn : undefined}
            exiting={scaleInEntering ? scaleOut : undefined}
          >
            {children}
          </Animated.View>
        </KeyboardAwareScrollView>
        {stickyButton && <ScreenStickyButton config={stickyButton} />}
      </>
    );
  }

  return (
    <>
      <Animated.View
        style={[contentStyles.plain, animatedPadding, centerContent ? contentStyles.centerContent : null, style]}
        entering={scaleInEntering ? scaleIn : undefined}
        exiting={scaleInEntering ? scaleOut : undefined}
      >
        {children}
      </Animated.View>
      {stickyButton && <ScreenStickyButton config={stickyButton} />}
    </>
  );
}

const contentStyles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20 },
  centerContent: { flexGrow: 1, justifyContent: 'center' },
  plain: { flex: 1, paddingHorizontal: 20 },
});

// ---------------------------------------------------------------------------
// ScreenFooter
// ---------------------------------------------------------------------------

export interface ScreenFooterProps {
  children: ReactNode;
  gradient?: boolean;
  gradientOpacity?: number;
  style?: ViewStyle;
}

export function ScreenFooter({ children, gradient = true, gradientOpacity = 1, style }: ScreenFooterProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { footerHeight, setFooterHeight, backgroundColor, extraBottomOffset, ignoreKeyboard } =
    useScreenContext();
  const measuredHeight = useRef(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const newHeight = e.nativeEvent.layout.height;
    if (Math.abs(newHeight - measuredHeight.current) > 2) {
      measuredHeight.current = newHeight;
      setFooterHeight(newHeight);
    }
  };

  useEffect(() => () => setFooterHeight(insets.bottom + 16), [insets.bottom]);

  const paddingBottom = insets.bottom + 8 + extraBottomOffset;
  const gradientEl = gradient && (
    <GradientTint
      invert
      backgroundColor={backgroundColor ?? colors.background}
      totalHeight={footerHeight + 24}
      opacity={gradientOpacity}
    />
  );

  if (ignoreKeyboard) {
    return (
      <View style={[footerStyles.container, { paddingBottom }, style]} onLayout={onLayout}>
        {gradientEl}
        {children}
      </View>
    );
  }

  return (
    <KeyboardStickyView
      style={[footerStyles.container, { paddingBottom }, style]}
      offset={{ closed: 0, opened: insets.bottom - 8 + extraBottomOffset }}
      onLayout={onLayout}
    >
      {gradientEl}
      {children}
    </KeyboardStickyView>
  );
}

const footerStyles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
});

// ---------------------------------------------------------------------------
// ScreenStickyButton
// ---------------------------------------------------------------------------

export const STICKY_BUTTON_TOTAL_HEIGHT = 68; // 56px button + 12px margin

export function ScreenStickyButton({ config }: { config: StickyButtonConfig }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { footerHeight, backgroundColor } = useScreenContext();

  return (
    <Animated.View entering={slideIn} exiting={slideOut}>
      <KeyboardStickyView
        style={[stickyStyles.container, { bottom: footerHeight, paddingBottom: 0 }]}
        offset={{ closed: 0, opened: insets.bottom - 8 }}
      >
        <GradientTint
          invert
          backgroundColor={backgroundColor ?? colors.background}
          totalHeight={STICKY_BUTTON_TOTAL_HEIGHT + 32}
          extraOuterHeight={footerHeight}
        />
        <Button
          title={config.title}
          onPress={config.onPress}
          disabled={config.disabled ?? false}
          fullWidth
          style={stickyStyles.buttonArea}
        />
      </KeyboardStickyView>
    </Animated.View>
  );
}

const stickyStyles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  buttonArea: {
    marginBottom: 12,
  },
});

// ---------------------------------------------------------------------------
// Animations (worklets)
// ---------------------------------------------------------------------------

const scaleIn: EntryExitAnimationFunction = () => {
  "worklet";
  return {
    initialValues: { transform: [{ scale: 0.96 }], opacity: 0 },
    animations: {
      transform: [{ scale: withDelay(100, withTiming(1, { duration: 150 })) }],
      opacity: withDelay(100, withTiming(1, { duration: 50 })),
    },
  };
};

const scaleOut: EntryExitAnimationFunction = () => {
  "worklet";
  return {
    initialValues: { transform: [{ scale: 1 }], opacity: 0 },
    animations: {
      transform: [{ scale: withTiming(0.96, { duration: 150 }) }],
      opacity: withDelay(100, withTiming(0, { duration: 50 })),
    },
  };
};

const slideIn: EntryExitAnimationFunction = () => {
  "worklet";
  return {
    initialValues: { transform: [{ translateY: 100 }], opacity: 0 },
    animations: {
      transform: [{ translateY: withSpring(0, { damping: 20, stiffness: 200, mass: 1 }) }],
      opacity: withTiming(1, { duration: 50 }),
    },
  };
};

const slideOut: EntryExitAnimationFunction = () => {
  "worklet";
  return {
    initialValues: { transform: [{ translateY: 0 }], opacity: 0 },
    animations: {
      transform: [{ translateY: withSpring(100, { damping: 20, stiffness: 200, mass: 1 }) }],
      opacity: withDelay(100, withTiming(0, { duration: 50 })),
    },
  };
};

