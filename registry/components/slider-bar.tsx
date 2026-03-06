import React, { useCallback, useRef } from "react";
import {
  type LayoutChangeEvent,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@popapp/theme/use-theme";
import { impactLight } from "@popapp/utils/haptics";
import { IconSymbol } from "@popapp/components/icon-symbol";
import type { IconSymbolName } from "@popapp/components/icon-symbol.types";

// ── Spring config ──────────────────────────────────────────────────────
const THUMB_SPRING = { damping: 18, stiffness: 180, mass: 1 };

// ── Dimensions ─────────────────────────────────────────────────────────
const TRACK_HEIGHT = 6;
const THICK_TRACK_HEIGHT = 28;
const THUMB_SIZE = 28;
const ACTIVE_THUMB_SCALE = 1.15;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SliderLabel {
  text: string;
  /** Position along the track as a 0-1 fraction. */
  position: number;
  /** Optional icon rendered before the label text. */
  icon?: IconSymbolName;
}

export type SliderVariant = "thumb" | "track";

export interface SliderBarProps {
  /** Current value. */
  value: number;
  /** Called continuously while dragging. */
  onValueChange: (value: number) => void;
  /** Minimum value (default 0). */
  min?: number;
  /** Maximum value (default 1). */
  max?: number;
  /** Snap step. If 0, slider is continuous (default 0). */
  step?: number;
  /** Labels rendered above the track. */
  labels?: SliderLabel[];
  /** Enable haptic feedback on step changes (default true). */
  haptic?: boolean;
  /**
   * Visual style variant.
   * - `"thumb"` — thin track with a draggable thumb (default).
   * - `"track"` — thick rounded track, no thumb.
   */
  variant?: SliderVariant;
  /**
   * When true, the thumb animates to the finger position on touch start
   * so the slider tracks the finger exactly. When false, the offset between
   * the finger and the thumb at touch start is preserved during dragging.
   * Defaults to `true` for `"thumb"` variant, `false` for `"track"` variant.
   */
  stickyToFinger?: boolean;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Animated label sub-component
// ---------------------------------------------------------------------------

function AnimatedLabel({
  label,
  thumbX,
  trackWidth,
  color,
  onPress,
}: {
  label: SliderLabel;
  thumbX: SharedValue<number>;
  trackWidth: SharedValue<number>;
  color: string;
  onPress: () => void;
}) {
  const animStyle = useAnimatedStyle(() => {
    if (trackWidth.value === 0) return { opacity: 0.4 };
    const progress = thumbX.value / trackWidth.value;
    const dist = Math.abs(progress - label.position);
    const opacity = interpolate(
      dist,
      [0, 0.15, 0.4],
      [1, 0.7, 0.4],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  const align: "flex-start" | "center" | "flex-end" =
    label.position <= 0.15
      ? "flex-start"
      : label.position >= 0.85
        ? "flex-end"
        : "center";

  const translateX =
    align === "flex-start" ? 0 : align === "flex-end" ? "-100%" : "-50%";

  return (
    <Animated.View
      style={[
        styles.labelItem,
        {
          left: `${label.position * 100}%`,
          transform: [{ translateX }],
          alignItems:
            align === "flex-end"
              ? "flex-end"
              : align === "flex-start"
                ? "flex-start"
                : "center",
        },
        animStyle,
      ]}
    >
      <Pressable onPress={onPress} hitSlop={8}>
        <View style={styles.labelItemContent}>
          {label.icon && (
            <IconSymbol name={label.icon} size={14} color={color} />
          )}
          <Text style={[styles.labelText, { color }]}>{label.text}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SliderBar({
  value,
  onValueChange,
  min = 0,
  max = 1,
  step = 0,
  labels,
  haptic = true,
  variant = "thumb",
  stickyToFinger,
  style,
}: SliderBarProps) {
  const { colors } = useTheme();

  const isThumbVariant = variant === "thumb";
  const sticky = stickyToFinger ?? isThumbVariant;
  const currentTrackHeight = isThumbVariant ? TRACK_HEIGHT : THICK_TRACK_HEIGHT;

  const trackWidth = useSharedValue(0);
  const thumbX = useSharedValue(0);
  const contextX = useSharedValue(0);
  const isActive = useSharedValue(false);
  const lastSnapped = useSharedValue(value);
  const didLayout = useRef(false);

  // ── Pure worklet helpers ─────────────────────────────────────────
  function valueToX(v: number, width: number) {
    "worklet";
    return ((v - min) / (max - min)) * width;
  }

  function clampX(x: number) {
    "worklet";
    return Math.max(0, Math.min(trackWidth.value, x));
  }

  function xToSnapped(x: number) {
    "worklet";
    const width = trackWidth.value;
    if (width === 0) return min;
    const raw = min + (x / width) * (max - min);
    const clamped = Math.min(max, Math.max(min, raw));
    if (step > 0) {
      return Math.round(clamped / step) * step;
    }
    return Math.round(clamped * 100) / 100;
  }

  // ── JS-thread callbacks ──────────────────────────────────────────
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  const handleValueChange = useCallback((v: number) => {
    onValueChangeRef.current(v);
  }, []);

  const triggerHaptic = useCallback(() => {
    if (haptic) impactLight();
  }, [haptic]);

  const onSnap = useCallback(
    (v: number) => {
      triggerHaptic();
      handleValueChange(v);
    },
    [triggerHaptic, handleValueChange],
  );

  // ── React to thumb movement ──────────────────────────────────────
  useAnimatedReaction(
    () => {
      if (trackWidth.value === 0) return null;
      return xToSnapped(thumbX.value);
    },
    (snapped, prev) => {
      if (snapped === null || snapped === prev) return;
      if (snapped !== lastSnapped.value) {
        lastSnapped.value = snapped;
        runOnJS(onSnap)(snapped);
      }
    },
  );

  // ── Sync external value ──────────────────────────────────────────
  const externalValue = useSharedValue(value);
  externalValue.value = value;

  useAnimatedReaction(
    () => externalValue.value,
    (curr) => {
      if (isActive.value) return;
      if (trackWidth.value === 0) return;
      const targetX = valueToX(curr, trackWidth.value);
      thumbX.value = withSpring(targetX, THUMB_SPRING);
      lastSnapped.value = curr;
    },
  );

  // ── Label press handler ────────────────────────────────────────────
  const handleLabelPress = useCallback(
    (position: number) => {
      const targetValue =
        step > 0
          ? Math.round((min + position * (max - min)) / step) * step
          : Math.round((min + position * (max - min)) * 100) / 100;
      onValueChangeRef.current(targetValue);
    },
    [min, max, step],
  );

  // ── Gesture ──────────────────────────────────────────────────────
  const pan = Gesture.Pan()
    .hitSlop({ top: 16, bottom: 16, left: 8, right: 8 })
    .onStart((e) => {
      "worklet";
      isActive.value = true;
      if (sticky) {
        // Animate thumb to finger position immediately
        const target = clampX(e.x);
        thumbX.value = withSpring(target, THUMB_SPRING);
        contextX.value = target;
      } else {
        contextX.value = thumbX.value;
      }
    })
    .onUpdate((e) => {
      "worklet";
      if (sticky) {
        thumbX.value = clampX(e.x);
      } else {
        thumbX.value = clampX(contextX.value + e.translationX);
      }
    })
    .onEnd(() => {
      "worklet";
      isActive.value = false;
      if (step > 0 && trackWidth.value > 0) {
        const snapped = xToSnapped(thumbX.value);
        const targetX = valueToX(snapped, trackWidth.value);
        thumbX.value = withSpring(targetX, THUMB_SPRING);
      }
    });

  const tap = Gesture.Tap().onEnd((e) => {
    "worklet";
    const target = clampX(e.x);
    if (step > 0) {
      const snapped = xToSnapped(target);
      const snapX = valueToX(snapped, trackWidth.value);
      thumbX.value = withSpring(snapX, THUMB_SPRING);
    } else {
      thumbX.value = withSpring(target, THUMB_SPRING);
    }
  });

  const composed = Gesture.Race(pan, tap);

  // ── Layout ───────────────────────────────────────────────────────
  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      trackWidth.value = w;
      if (!didLayout.current) {
        didLayout.current = true;
        thumbX.value = ((value - min) / (max - min)) * w;
      }
    },
    [value, min, max],
  );

  // ── Animated styles ──────────────────────────────────────────────
  // Fill uses translateX for GPU-only animation: a full-width bar is shifted
  // left so only the filled portion is visible inside the overflow:hidden track.
  const fillStyle = useAnimatedStyle(() => {
    "worklet";
    const x = thumbX.value;
    const w = trackWidth.value;
    // Shift the full-width fill bar so that (w - offset) pixels are visible.
    const offset = x < 1 ? -w : x - w;
    return { transform: [{ translateX: offset }] };
  });

  const thumbStyle = useAnimatedStyle(() => {
    const scale = withSpring(
      isActive.value ? ACTIVE_THUMB_SCALE : 1,
      THUMB_SPRING,
    );
    return {
      transform: [{ translateX: thumbX.value - THUMB_SIZE / 2 }, { scale }],
    };
  });

  // Thick-track variant: animate active scale on the track itself
  const thickTrackActiveStyle = useAnimatedStyle(() => {
    if (isThumbVariant) return {};
    const scale = withSpring(isActive.value ? 1.04 : 1, THUMB_SPRING);
    return { transform: [{ scaleY: scale }] };
  });

  return (
    <View style={[styles.container, style]}>
      {labels && labels.length > 0 && (
        <View style={styles.labelsRow}>
          {labels.map((label, i) => (
            <AnimatedLabel
              key={i}
              label={label}
              thumbX={thumbX}
              trackWidth={trackWidth}
              color={colors.foreground}
              onPress={() => handleLabelPress(label.position)}
            />
          ))}
        </View>
      )}

      <GestureDetector gesture={composed}>
        <Animated.View
          style={[
            isThumbVariant ? styles.trackWrapper : styles.thickTrackWrapper,
            thickTrackActiveStyle,
          ]}
        >
          <View
            style={[
              styles.track,
              {
                backgroundColor: colors.border,
                height: currentTrackHeight,
                borderRadius: currentTrackHeight / 2,
              },
            ]}
            onLayout={onLayout}
          >
            <Animated.View
              style={[
                styles.fill,
                {
                  backgroundColor: colors.primary,
                  width: "100%",
                  borderRadius: currentTrackHeight / 2,
                },
                fillStyle,
              ]}
            />
          </View>

          {isThumbVariant && (
            <Animated.View
              style={[
                styles.thumb,
                { backgroundColor: colors.primary },
                thumbStyle,
              ]}
            />
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  labelsRow: {
    height: 28,
    marginBottom: 0,
    position: "relative",
  },
  labelItem: {
    position: "absolute",
  },
  labelItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  labelText: {
    fontSize: 13,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  trackWrapper: {
    height: THUMB_SIZE + 16,
    justifyContent: "center",
  },
  thickTrackWrapper: {
    height: THICK_TRACK_HEIGHT + 16,
    justifyContent: "center",
  },
  track: {
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    top: (THUMB_SIZE + 16 - THUMB_SIZE) / 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
});
