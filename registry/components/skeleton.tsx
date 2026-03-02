import React, { useEffect } from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@popapp/theme/use-theme";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Skeleton({
  width,
  height,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          backgroundColor: colors.cardSecondary,
          width,
          height,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}
