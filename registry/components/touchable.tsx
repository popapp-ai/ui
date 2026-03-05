import React, { useEffect } from "react";
import {
  Pressable,
  TouchableOpacity,
  type TouchableOpacityProps as RNTouchableOpacityProps,
  type PressableProps,
  type TransformsStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { impactLight } from "@popapp/utils/haptics";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export type TouchableScaleProps = Omit<PressableProps, "style"> & {
  children: React.ReactNode;
  style?: PressableProps["style"];
  disabled?: boolean;
  /** Reduce opacity to 50 %. */
  muted?: boolean;
  /** Scale factor when pressed in. Default: 0.97 */
  scaleTo?: number;
  /** Opacity when pressed in. Default: 0.7 */
  opacityTo?: number;
  pressInDuration?: number;
  pressOutDuration?: number;
  transform?: TransformsStyle["transform"];
  /** Trigger haptic feedback on press. */
  haptic?: boolean;
  /** Effect to use. Default: "scale" */
  effect?: "scale";
}

export type TouchableOpacityProps = Omit<RNTouchableOpacityProps, "style"> & {
  effect?: "opacity";
}

export type TouchableProps = TouchableScaleProps | TouchableOpacityProps;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Touchable(props: TouchableOpacityProps): React.ReactElement;
export function Touchable(props: TouchableScaleProps): React.ReactElement;
export function Touchable(
  props: TouchableScaleProps | TouchableOpacityProps
): React.ReactElement {
  if (props.effect === "opacity") {
    const { effect, ...rest } = props;
    return <TouchableOpacity {...(rest as RNTouchableOpacityProps)} />;
  }
  return <TouchableScale {...(props as TouchableScaleProps)} />;
}

function TouchableScale({
  children,
  style,
  disabled = false,
  muted = false,
  scaleTo = 0.97,
  opacityTo = 0.7,
  pressInDuration = 100,
  pressOutDuration = 150,
  transform = [],
  haptic = true,
  effect = "scale", 
  ...pressableProps
}: TouchableScaleProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(muted ? 0.5 : 1);

  useEffect(() => {
    opacity.value = muted ? 0.5 : 1;
  }, [muted]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, ...(transform as any)],
    opacity: muted ? 0.5 : opacity.value,
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withTiming(scaleTo, { duration: pressInDuration });
    opacity.value = withTiming(opacityTo, { duration: pressInDuration });
    if (haptic) impactLight();
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withTiming(1, { duration: pressOutDuration });
    opacity.value = withTiming(1, { duration: pressOutDuration });
  };

  return (
    <AnimatedPressable
      {...pressableProps}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}