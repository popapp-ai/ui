import { useTheme } from "@popapp/theme/use-theme";
import { GradientTint } from "@popapp/utils/gradient-tint";
import { BlurView } from "expo-blur";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
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
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  type EntryExitAnimationFunction,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export type ScreenVariant = "gradient" | "solid" | "blur" | "none";

interface ScreenContextValue {
  headerHeight: number;
  footerHeight: number;
  subheaderHeight: number;
  subfooterHeight: number;
  hasTopLayer: boolean;
  hasBottomLayer: boolean;
  setHeaderHeight: (height: number) => void;
  setFooterHeight: (height: number) => void;
  setSubheaderHeight: (height: number) => void;
  setSubfooterHeight: (height: number) => void;
  setHeaderMounted: (mounted: boolean) => void;
  setFooterMounted: (mounted: boolean) => void;
  setSubheaderMounted: (mounted: boolean) => void;
  setSubfooterMounted: (mounted: boolean) => void;
  variant: ScreenVariant;
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
  variant?: ScreenVariant;
  insideModal?: boolean;
  extraBottomOffset?: number;
  ignoreKeyboard?: boolean;
  animateInsets?: boolean;
}

export function Screen({
  children,
  style,
  backgroundColor,
  variant = "gradient",
  insideModal = false,
  extraBottomOffset = 0,
  ignoreKeyboard = false,
  animateInsets,
}: ScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(insets.top + 16);
  const [footerHeight, setFooterHeight] = useState(insets.bottom + 16);
  const [subheaderHeight, setSubheaderHeight] = useState(0);
  const [subfooterHeight, setSubfooterHeight] = useState(0);
  const [headerMounted, setHeaderMounted] = useState(false);
  const [footerMounted, setFooterMounted] = useState(false);
  const [subheaderMounted, setSubheaderMounted] = useState(false);
  const [subfooterMounted, setSubfooterMounted] = useState(false);

  const bg = backgroundColor ?? colors.background;
  const hasTopLayer = headerMounted || subheaderMounted;
  const hasBottomLayer = footerMounted || subfooterMounted;
  const topTintHeight = headerHeight + subheaderHeight;
  const bottomTintHeight = footerHeight + subfooterHeight;

  return (
    <ScreenContext.Provider
      value={{
        headerHeight,
        footerHeight,
        subheaderHeight,
        subfooterHeight,
        hasTopLayer,
        hasBottomLayer,
        setHeaderHeight,
        setFooterHeight,
        setSubheaderHeight,
        setSubfooterHeight,
        setHeaderMounted,
        setFooterMounted,
        setSubheaderMounted,
        setSubfooterMounted,
        variant,
        backgroundColor,
        animateInsets,
        insideModal,
        extraBottomOffset,
        ignoreKeyboard,
      }}
    >
      <View style={[{ flex: 1, backgroundColor: bg }, style]}>
        {hasTopLayer && <ScreenTint position="top" height={topTintHeight} variant={variant} backgroundColor={bg} borderColor={colors.border} />}
        {hasBottomLayer && <KeyboardStickyView style={[tintStyles.container, { bottom: 0 }]} offset={{ closed: 0, opened: insets.bottom - 8 + extraBottomOffset }}>
          <ScreenTint position="bottom" height={bottomTintHeight} variant={variant} backgroundColor={bg} borderColor={colors.border} />
        </KeyboardStickyView>}
        {children}
      </View>
    </ScreenContext.Provider>
  );
  }

function ScreenTint({
  position,
  height,
  variant,
  backgroundColor,
  borderColor,
}: {
  position: "top" | "bottom";
  height: number;
  variant: ScreenVariant;
  backgroundColor: string;
  borderColor: string;
}) {
  if (height <= 0 || variant === "none") return null;

  const isTop = position === "top";
  const gradientExtra = 24;

  if (variant === "gradient") {
    return (
      <View
        style={[
          tintStyles.container,
          isTop ? { top: 0 } : { bottom: 0 },
        ]}
        pointerEvents="none"
      >
        <GradientTint
          backgroundColor={backgroundColor}
          totalHeight={height + gradientExtra}
          startPointY={height / (height + 64)}
          invert={!isTop}
        />
      </View>
    );
  }

  if (variant === "solid") {
    return (
      <View
        style={[
          tintStyles.container,
          { backgroundColor, height },
          isTop ? { top: 0, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: borderColor } : { bottom: 0, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: borderColor },
        ]}
        pointerEvents="none"
      />
    );
  }

  // blur
  return (
    <BlurView 
      tint='light'
      style={[
        tintStyles.container,
        { height, overflow: "hidden" },
        { backgroundColor: backgroundColor+ '90' },
        isTop
          ? { top: 0, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: borderColor }
          : { bottom: 0, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: borderColor }
      ]} 
    />
  );
}

const tintStyles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 998,
  },
});

// ---------------------------------------------------------------------------
// ScreenHeader
// ---------------------------------------------------------------------------

export interface ScreenHeaderProps {
  title?: string | ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  bottomSection?: ReactNode;
  style?: ViewStyle;
}

export function ScreenHeader({
  title,
  leftSection,
  rightSection,
  bottomSection,
  style,
}: ScreenHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { setHeaderHeight, setHeaderMounted, insideModal } = useScreenContext();
  const paddingTop = insideModal ? 12 : insets.top;
  const measuredHeight = useRef(0);

  useEffect(() => {
    setHeaderMounted(true);
    return () => {
      setHeaderMounted(false);
      setHeaderHeight(insets.top + 16);
    };
  }, [insets.top]);

  const onLayout = (e: LayoutChangeEvent) => {
    const newHeight = e.nativeEvent.layout.height;
    if (Math.abs(newHeight - measuredHeight.current) > 2) {
      measuredHeight.current = newHeight;
      setHeaderHeight(newHeight);
    }
  };

  const hasContent = leftSection || rightSection || title;

  return (
    <View style={[headerStyles.container, style]} onLayout={onLayout}>
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
    marginBottom: 4,
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
// ScreenSubheader
// ---------------------------------------------------------------------------

export interface ScreenSubheaderProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function ScreenSubheader({
  children,
  style,
}: ScreenSubheaderProps) {
  const { headerHeight, setSubheaderHeight, setSubheaderMounted } = useScreenContext();
  const measuredHeight = useRef(0);

  useEffect(() => {
    setSubheaderMounted(true);
    return () => {
      setSubheaderMounted(false);
      setSubheaderHeight(0);
    };
  }, []);

  const onLayout = (e: LayoutChangeEvent) => {
    const newHeight = e.nativeEvent.layout.height;
    if (Math.abs(newHeight - measuredHeight.current) > 2) {
      measuredHeight.current = newHeight;
      setSubheaderHeight(newHeight);
    }
  };

  return (
    <View style={[subheaderStyles.container, { top: headerHeight }, style]} onLayout={onLayout}>
      {children}
    </View>
  );
}

const subheaderStyles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 999,
    paddingHorizontal: 20,
  },
});

// ---------------------------------------------------------------------------
// ScreenSubfooter
// ---------------------------------------------------------------------------

export interface ScreenSubfooterProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function ScreenSubfooter({
  children,
  style,
}: ScreenSubfooterProps) {
  const insets = useSafeAreaInsets();
  const { footerHeight, setSubfooterHeight, setSubfooterMounted, extraBottomOffset, ignoreKeyboard } =
    useScreenContext();
  const measuredHeight = useRef(0);

  useEffect(() => {
    setSubfooterMounted(true);
    return () => {
      setSubfooterMounted(false);
      setSubfooterHeight(0);
    };
  }, []);

  const onLayout = (e: LayoutChangeEvent) => {
    const newHeight = e.nativeEvent.layout.height;
    if (Math.abs(newHeight - measuredHeight.current) > 2) {
      measuredHeight.current = newHeight;
      setSubfooterHeight(newHeight);
    }
  };

  const containerStyle = [subfooterStyles.container, { bottom: footerHeight }, style];

  if (ignoreKeyboard) {
    return (
      <View style={containerStyle} onLayout={onLayout}>
        {children}
      </View>
    );
  }

  return (
    <KeyboardStickyView
      style={containerStyle}
      offset={{ closed: 0, opened: insets.bottom - 8 + extraBottomOffset }}
      onLayout={onLayout}
    >
      {children}
    </KeyboardStickyView>
  );
}

const subfooterStyles = StyleSheet.create({
  container: {
    zIndex: 1001,
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
});

// ---------------------------------------------------------------------------
// ScreenContent
// ---------------------------------------------------------------------------

const PADDING_EXTRA = 16;
const SPRING_CONFIG = { stiffness: 250, damping: 40, mass: 1 };

export interface ScreenContentProps {
  children: ReactNode;
  scroll?: boolean;
  padTop?: boolean;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  centerContent?: boolean;
  scaleInEntering?: boolean;
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
  onScroll,
}: ScreenContentProps) {
  const { headerHeight, footerHeight, subheaderHeight, subfooterHeight, animateInsets } = useScreenContext();

  const animPaddingTop = useSharedValue(padTop ? headerHeight + subheaderHeight + PADDING_EXTRA : 0);
  const animPaddingBottom = useSharedValue(footerHeight + subfooterHeight + PADDING_EXTRA);

  // biome-ignore lint: reanimated shared values
  useEffect(() => {
    const topTarget = padTop ? headerHeight + subheaderHeight + PADDING_EXTRA : 0;
    const bottomTarget = footerHeight + subfooterHeight + PADDING_EXTRA;
    if (!animateInsets) {
      animPaddingTop.value = topTarget;
      animPaddingBottom.value = bottomTarget;
      return;
    }
    animPaddingTop.value = withSpring(topTarget, SPRING_CONFIG);
    animPaddingBottom.value = withSpring(bottomTarget, SPRING_CONFIG);
  }, [headerHeight, footerHeight, subheaderHeight, subfooterHeight, padTop, animateInsets]);

  const animatedPadding = useAnimatedStyle(() => ({
    paddingTop: animPaddingTop.value,
    paddingBottom: animPaddingBottom.value,
  }));

  if (scroll) {
    return (
      <KeyboardAwareScrollView
        style={[contentStyles.scroll, style]}
        contentContainerStyle={[
          contentStyles.scrollContent,
          centerContent ? contentStyles.centerContent : null
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        // centerContent={centerContent}
      >
        <Animated.View
          style={[animatedPadding, contentContainerStyle]}
          entering={scaleInEntering ? scaleIn : undefined}
          exiting={scaleInEntering ? scaleOut : undefined}
        >
          {children}
        </Animated.View>
      </KeyboardAwareScrollView>
    );
  }

  return (
    <Animated.View
      style={[contentStyles.plain, animatedPadding, centerContent ? contentStyles.centerContent : null, style]}
      entering={scaleInEntering ? scaleIn : undefined}
      exiting={scaleInEntering ? scaleOut : undefined}
    >
      {children}
    </Animated.View>
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
  style?: ViewStyle;
}

export function ScreenFooter({ children, style }: ScreenFooterProps) {
  const insets = useSafeAreaInsets();
  const { setFooterHeight, setFooterMounted, extraBottomOffset, ignoreKeyboard } =
    useScreenContext();
  const measuredHeight = useRef(0);

  useEffect(() => {
    setFooterMounted(true);
    return () => {
      setFooterMounted(false);
      setFooterHeight(insets.bottom + 16);
    };
  }, [insets.bottom]);

  const onLayout = (e: LayoutChangeEvent) => {
    const newHeight = e.nativeEvent.layout.height;
    if (Math.abs(newHeight - measuredHeight.current) > 2) {
      measuredHeight.current = newHeight;
      setFooterHeight(newHeight);
    }
  };

  const paddingBottom = insets.bottom + 8 + extraBottomOffset;

  if (ignoreKeyboard) {
    return (
      <View style={[footerStyles.container, { paddingBottom }, style]} onLayout={onLayout}>
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
      {children}
    </KeyboardStickyView>
  );
}

const footerStyles = StyleSheet.create({
  container: {
    zIndex: 1001,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
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

