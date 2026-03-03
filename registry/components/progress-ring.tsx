import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle, G } from "react-native-svg";
import { useTheme } from "@popapp/theme/use-theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  value: number;
  maxValue: number;
  size?: number;
  strokeWidth?: number;
  activeColor?: string;
  trackColor?: string;
  centerLabel?: React.ReactNode;
}

export function ProgressRing({
  value,
  maxValue,
  size = 100,
  strokeWidth = 8,
  activeColor,
  trackColor,
  centerLabel,
}: ProgressRingProps) {
  const { colors } = useTheme();

  const percentage = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
  const fillColor = activeColor ?? colors.primary;

  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(percentage / 100);

  useEffect(() => {
    const target = Math.max(0, percentage / 100);
    progress.value = withSpring(target, {
      mass: 0.8,
      damping: 15,
      stiffness: 120,
    });
  }, [percentage, progress]);

  const animatedProps = useAnimatedProps(() => {
    const p = Math.max(0, progress.value);
    return { strokeDasharray: `${p * circumference} ${circumference}` };
  });

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <G transform={`rotate(-90 ${center} ${center})`}>
          {/* Track */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={trackColor ?? colors.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress with rounded ends */}
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={fillColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            animatedProps={animatedProps}
          />
        </G>
      </Svg>
      {centerLabel != null && (
        <View
          style={{
            position: "absolute",
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
          }}
          pointerEvents="box-none"
        >
          {centerLabel}
        </View>
      )}
    </View>
  );
}
