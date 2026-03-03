import {
  Canvas,
  createPicture,
  Group,
  Picture,
  Skia,
  StrokeCap,
  matchFont,
} from "@shopify/react-native-skia";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@popapp/theme/use-theme";
import { impactLight } from "@popapp/utils/haptics";

const TICK_SPACING = 10;
const RUBBER_BAND = 0.35;

const SNAP_SPRING = { damping: 28, stiffness: 300, mass: 0.8 };
const SYNC_SPRING = { damping: 20, stiffness: 170, mass: 1 };
const DECAY_DECELERATION = 0.997;

const RULER_HEIGHT = 72;
const TICK_TOP = 4;

const labelFont = matchFont({
  fontFamily: Platform.select({ ios: "Helvetica Neue", default: "sans-serif" }),
  fontSize: 10,
  fontWeight: "normal" as const,
});

interface RulerSliderProps {
  value: number;
  onValueChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  majorStep?: number;
  midStep?: number;
  unit?: string;
  decimals?: number;
  fontSize?: number;
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function RulerSlider({
  value,
  onValueChange,
  min = 0,
  max = 300,
  step = 1,
  majorStep = 10,
  midStep = 5,
  unit,
  decimals = 0,
  fontSize = 40,
  haptic = true,
  style,
}: RulerSliderProps) {
  const { colors } = useTheme();

  const totalTicks = Math.round((max - min) / step);
  const totalWidth = totalTicks * TICK_SPACING;

  const translateX = useSharedValue(-((value - min) / step) * TICK_SPACING);
  const contextX = useSharedValue(0);
  const lastTickIndex = useSharedValue(Math.round((value - min) / step));
  const isInteracting = useSharedValue(false);

  const lastEmittedValue = useRef(value);
  const [layoutWidth, setLayoutWidth] = useState(0);

  // ── Build static ruler picture (imperative — one flat command buffer) ──
  const rulerPicture = useMemo(() => {
    const pictureWidth = totalWidth + TICK_SPACING;

    return createPicture(
      (canvas) => {
        const tickPaint = Skia.Paint();
        tickPaint.setAntiAlias(true);
        tickPaint.setStrokeCap(StrokeCap.Round);

        const textPaint = Skia.Paint();
        textPaint.setAntiAlias(true);

        const tickColor = Skia.Color(colors.foreground);

        for (let i = 0; i <= totalTicks; i++) {
          const tickValue = min + i * step;
          const isMajor = tickValue % majorStep === 0;
          const isMid = !isMajor && tickValue % midStep === 0;

          const tickHeight = isMajor ? 42 : isMid ? 30 : 12;
          const tickWidth = isMajor ? 2 : isMid ? 1.5 : 1;
          const opacity = isMajor ? 0.6 : isMid ? 0.3 : 0.15;

          const x = i * TICK_SPACING;

          tickPaint.setColor(tickColor);
          tickPaint.setAlphaf(opacity);
          tickPaint.setStrokeWidth(tickWidth);

          canvas.drawLine(x, TICK_TOP, x, TICK_TOP + tickHeight, tickPaint);

          if (isMajor && labelFont) {
            const label = tickValue.toFixed(decimals).replace(".0", "");
            const textWidth = labelFont.measureText(label).width;
            textPaint.setColor(tickColor);
            textPaint.setAlphaf(0.4);
            canvas.drawText(label, x - textWidth / 2, TICK_TOP + tickHeight + 14, textPaint, labelFont);
          }
        }
      },
      { width: pictureWidth, height: RULER_HEIGHT },
    );
  }, [totalTicks, totalWidth, min, step, majorStep, midStep, decimals, colors.foreground]);

  // ── Animated transform for Skia group ──
  const rulerTransform = useDerivedValue(() => [
    { translateX: layoutWidth / 2 + translateX.value },
  ]);

  // ── Haptic + value emission ──
  const triggerHaptic = useCallback(() => {
    if (haptic) impactLight();
  }, [haptic]);

  const emitFrame = useRef<number | null>(null);
  const pendingValue = useRef(value);

  useEffect(() => {
    return () => {
      if (emitFrame.current !== null) cancelAnimationFrame(emitFrame.current);
    };
  }, []);

  const emitValue = useCallback(
    (v: number) => {
      const rounded = Number(v.toFixed(decimals));
      pendingValue.current = rounded;
      if (emitFrame.current !== null) return;
      emitFrame.current = requestAnimationFrame(() => {
        emitFrame.current = null;
        lastEmittedValue.current = pendingValue.current;
        onValueChange(pendingValue.current);
      });
    },
    [onValueChange, decimals],
  );

  // Sync external value changes
  useEffect(() => {
    if (isInteracting.value) return;
    if (value === lastEmittedValue.current) return;
    const targetX = -((value - min) / step) * TICK_SPACING;
    translateX.value = withSpring(targetX, SYNC_SPRING);
    lastTickIndex.value = Math.round((value - min) / step);
  }, [value, min, step]);

  // Watch tick crossings for haptic + callback
  useDerivedValue(() => {
    const tickIndex = Math.round(-translateX.value / TICK_SPACING);
    const clamped = Math.max(0, Math.min(totalTicks, tickIndex));
    if (clamped !== lastTickIndex.value) {
      lastTickIndex.value = clamped;
      runOnJS(triggerHaptic)();
      runOnJS(emitValue)(min + clamped * step);
    }
  });

  // ── Gesture ──
  const pan = Gesture.Pan()
    .activeOffsetX([-5, 5])
    .onStart(() => {
      cancelAnimation(translateX);
      isInteracting.value = true;
      contextX.value = translateX.value;
    })
    .onUpdate((e) => {
      let next = contextX.value + e.translationX;
      if (next > 0) {
        next = next * RUBBER_BAND;
      } else if (next < -totalWidth) {
        const over = next + totalWidth;
        next = -totalWidth + over * RUBBER_BAND;
      }
      translateX.value = next;
    })
    .onEnd((e) => {
      const velocity = e.velocityX;

      if (translateX.value > 0 || translateX.value < -totalWidth) {
        const clamped = Math.max(-totalWidth, Math.min(0, translateX.value));
        const nearestTick = Math.round(-clamped / TICK_SPACING);
        translateX.value = withSpring(-nearestTick * TICK_SPACING, SNAP_SPRING, () => {
          isInteracting.value = false;
        });
        return;
      }

      if (Math.abs(velocity) < 50) {
        const nearestTick = Math.round(-translateX.value / TICK_SPACING);
        const target = -Math.max(0, Math.min(totalTicks, nearestTick)) * TICK_SPACING;
        translateX.value = withSpring(target, SNAP_SPRING, () => {
          isInteracting.value = false;
        });
        return;
      }

      translateX.value = withDecay(
        {
          velocity,
          clamp: [-totalWidth, 0],
          deceleration: DECAY_DECELERATION,
        },
        () => {
          const nearestTick = Math.round(-translateX.value / TICK_SPACING);
          const target = -Math.max(0, Math.min(totalTicks, nearestTick)) * TICK_SPACING;
          const distance = Math.abs(translateX.value - target);
          if (distance < 0.5) {
            translateX.value = target;
            isInteracting.value = false;
          } else {
            translateX.value = withTiming(
              target,
              { duration: 80, easing: Easing.out(Easing.quad) },
              () => { isInteracting.value = false; },
            );
          }
        },
      );
    });

  const onLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number } } }) => {
      setLayoutWidth(e.nativeEvent.layout.width);
    },
    [],
  );

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[{ width: "100%" }, style]}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize,
              fontVariant: ["tabular-nums"],
              fontWeight: "bold",
              color: colors.foreground,
            }}
          >
            {value.toFixed(decimals)}
          </Text>
          {unit && (
            <Text style={{ fontSize: 14, fontWeight: "500", marginTop: -4, color: colors.foregroundSecondary }}>
              {unit}
            </Text>
          )}
        </View>

        <View
          style={{ height: RULER_HEIGHT + 16, marginTop: 16, justifyContent: "center" }}
          onLayout={onLayout}
        >
          {/* Center indicator */}
          <View
            style={{
              position: "absolute",
              left: "50%",
              marginLeft: -1,
              width: 2,
              height: 52,
              top: -5,
              borderRadius: 1,
              zIndex: 1,
              backgroundColor: colors.primary,
            }}
          />

          {layoutWidth > 0 && (
            <MaskedView
              style={StyleSheet.absoluteFill}
              maskElement={
                <LinearGradient
                  style={StyleSheet.absoluteFillObject}
                  colors={["transparent", "black", "black", "transparent"]}
                  locations={[0, 0.15, 0.85, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              }
            >
              <Canvas style={{ flex: 1 }}>
                <Group transform={rulerTransform}>
                  <Picture picture={rulerPicture} />
                </Group>
              </Canvas>
            </MaskedView>
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
