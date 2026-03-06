import React, { useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import PagerView, {
  type PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import Animated, {
  useSharedValue,
  useHandler,
  useEvent,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  type SharedValue,
} from "react-native-reanimated";
import { useTheme } from "@popapp/theme/use-theme";

const AnimatedPager = Animated.createAnimatedComponent(PagerView);

const DOT_WIDTH_INACTIVE = 6;
const DOT_WIDTH_ACTIVE = 18;

type PageScrollEvent = { position: number; offset: number };

function usePagerScrollHandler(
  handlers: {
    onPageScroll?: (
      e: PageScrollEvent,
      context?: Record<string, unknown>
    ) => void;
  },
  dependencies?: unknown[]
) {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);
  const subscribeForEvents = ["onPageScroll"];

  return useEvent<PageScrollEvent>(
    (event) => {
      "worklet";
      const { onPageScroll } = handlers;
      if (onPageScroll && event.eventName.endsWith("onPageScroll")) {
        onPageScroll(event, context);
      }
    },
    subscribeForEvents,
    doDependenciesDiffer
  );
}

// ─── Page Dots ───────────────────────────────────────────────────────────────

function Dot({
  index,
  progress,
  activeColor,
  inactiveColor,
}: {
  index: number;
  progress: SharedValue<number>;
  activeColor: string;
  inactiveColor: string;
}) {
  const animStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const activeAmount = Math.max(0, 1 - Math.abs(p - index));
    const width = interpolate(
      activeAmount,
      [0, 1],
      [DOT_WIDTH_INACTIVE, DOT_WIDTH_ACTIVE]
    );
    const backgroundColor = interpolateColor(
      activeAmount,
      [0, 1],
      [inactiveColor, activeColor]
    );
    return { width, backgroundColor };
  }, [index, activeColor, inactiveColor]);

  return <Animated.View style={[styles.dot, animStyle]} />;
}

function PageDots({
  count,
  progress,
}: {
  count: number;
  progress: SharedValue<number>;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.dotsContainer}>
      {Array.from({ length: count }, (_, i) => (
        <Dot
          key={i}
          index={i}
          progress={progress}
          activeColor={colors.primary}
          inactiveColor={colors.border}
        />
      ))}
    </View>
  );
}

// ─── Carousel ────────────────────────────────────────────────────────────────

const CAROUSEL_HEIGHT = 340;

interface CarouselProps {
  children: React.ReactNode[];
  height?: number;
}

export function Carousel({ children, height = CAROUSEL_HEIGHT }: CarouselProps) {
  const pageCount = children.length;
  const progress = useSharedValue(0);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const scrollHandler = usePagerScrollHandler(
    {
      onPageScroll: (e) => {
        "worklet";
        progress.value = e.position + e.offset;
      },
    },
    []
  );

  const onPageSelected = useCallback((e: PagerViewOnPageSelectedEvent) => {
    setActivePageIndex(e.nativeEvent.position);
  }, []);

  return (
    <>
      <AnimatedPager
        style={[styles.pager, { height }]}
        initialPage={0}
        onPageScroll={scrollHandler as any}
        onPageSelected={onPageSelected}
        overdrag
      >
        {React.Children.map(children, (child, index) => (
          <View key={index} style={styles.page}>
            <View style={styles.pageInner}>
              {React.isValidElement<{ isActive?: boolean }>(child)
                ? React.cloneElement(child, {
                    isActive: activePageIndex === index,
                  })
                : child}
            </View>
          </View>
        ))}
      </AnimatedPager>
      <PageDots count={pageCount} progress={progress} />
    </>
  );
}

const styles = StyleSheet.create({
  pager: {
    width: "100%",
  },
  page: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pageInner: {
    flex: 1,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
  },
  dot: {
    height: DOT_WIDTH_INACTIVE,
    borderRadius: DOT_WIDTH_INACTIVE / 2,
  },
});
