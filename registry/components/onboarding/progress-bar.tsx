import { useCallback, useEffect } from "react";
import { type LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useTheme } from "@popapp/theme/use-theme";

interface ProgressBarProps {
  progress: number;
}

export function OnboardingProgressBar({ progress }: ProgressBarProps) {
  const { colors } = useTheme();
  const animatedProgress = useSharedValue(progress);
  const containerWidth = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withSpring(progress, {
      damping: 20,
      stiffness: 200,
      mass: 1,
    });
  }, [progress]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    containerWidth.value = e.nativeEvent.layout.width;
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ translateX:containerWidth.value ? (animatedProgress.value - 1) * containerWidth.value: -1000 }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.border }]} onLayout={onLayout}>
      <Animated.View style={[styles.bar, { backgroundColor: colors.primary }, barStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginHorizontal: 12,
  },
  bar: {
    width: "100%",
    height: "100%",
    borderRadius: 2,
  },
});
