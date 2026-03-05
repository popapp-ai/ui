import { LinearGradient } from "expo-linear-gradient";
import {
  Animated,
  Easing,
  type EasingFunction,
  type StyleProp,
  type ViewStyle,
} from "react-native";

// ---------------------------------------------------------------------------
// GradientTint
// ---------------------------------------------------------------------------

export interface GradientTintProps {
  backgroundColor?: string;
  opacity?: number;
  totalHeight?: number;
  startPointY?: number;
  invert?: boolean;
  zIndex?: number;
  extraOuterHeight?: number;
  easing?: EasingFunction;
  style?: StyleProp<ViewStyle>;
}

export function GradientTint({
  backgroundColor,
  opacity = 1,
  totalHeight = 40,
  startPointY = 0.6,
  invert = false,
  zIndex = 0,
  extraOuterHeight = 0,
  easing: easingFn = easeInOut,
  style,
}: GradientTintProps) {
  const bg = backgroundColor ?? "";
  const { colors, locations } = easeGradient({
    colorStops: {
      0: { color: bg },
      1: { color: bg + "00" },
    },
    easing: easingFn,
  });

  return (
    <LinearGradient
      colors={colors as any}
      locations={(invert ? locations.map((l) => 1 - l).reverse() : locations) as any}
      start={{ x: 0, y: invert ? 1 - startPointY : startPointY }}
      end={{ x: 0, y: invert ? 0 : 1 }}
      style={[
        {
          zIndex,
          position: "absolute",
          left: 0,
          right: 0,
          height: totalHeight + extraOuterHeight,
          opacity,
        },
        invert ? { bottom: -extraOuterHeight } : { top: -extraOuterHeight },
        style,
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Color interpolation via RN's Animated internals
// ---------------------------------------------------------------------------

// @ts-expect-error – accessing RN internal for color interpolation
const AnimatedInterpolation = Animated.Interpolation;

type ColorInterpolateFunction = (input: number) => string;

function createInterpolation(
  config: Animated.InterpolationConfigType
): ColorInterpolateFunction {
  if (AnimatedInterpolation.__createInterpolation) {
    return AnimatedInterpolation.__createInterpolation(config);
  }

  return (input) => {
    const interpolation = new AnimatedInterpolation(
      { __getValue: () => input },
      config
    );
    return interpolation.__getValue();
  };
}

// ---------------------------------------------------------------------------
// Easing gradient
// ---------------------------------------------------------------------------

interface ColorStop {
  color: string;
  easing?: EasingFunction;
}

interface ColorStops {
  [location: number]: ColorStop;
}

interface EaseGradientParams {
  colorStops: ColorStops;
  extraColorStopsPerTransition?: number;
  easing?: EasingFunction;
}

const easeInOut = Easing.bezier(0.42, 0, 0.58, 1);

function easeGradient({
  colorStops,
  easing = easeInOut,
  extraColorStopsPerTransition = 12,
}: EaseGradientParams) {
  const colors: string[] = [];
  const locations: number[] = [];

  const initialLocations = Object.keys(colorStops)
    .map((key) => Number(key))
    .sort((a, b) => a - b);

  for (let i = 0; i < initialLocations.length - 1; i++) {
    const startLocation = initialLocations[i];
    const endLocation = initialLocations[i + 1];

    const startColor = colorStops[startLocation].color;
    const endColor = colorStops[endLocation].color;
    const currentEasing = colorStops[startLocation].easing ?? easing;

    const colorScale = createInterpolation({
      inputRange: [0, 1],
      outputRange: [startColor, endColor],
      easing: currentEasing,
    });

    const transitionLength = endLocation - startLocation;
    const stepSize = 1 / (extraColorStopsPerTransition + 1);

    for (let step = 0; step <= extraColorStopsPerTransition + 1; step++) {
      const progress = step * stepSize;
      colors.push(colorScale(progress));
      locations.push(startLocation + transitionLength * progress);
    }
  }

  return { colors, locations };
}

export { easeGradient };
export type { ColorStops, EaseGradientParams };
