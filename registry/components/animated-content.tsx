import { useMemo, type ReactNode } from "react";
import { Dimensions, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutLeft,
  FadeOutRight,
  FadeOutUp,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
} from "react-native-reanimated";

type AnimationPreset = "horizontal-slide" | "vertical-slide" | "fade";
type AnimationDirection = "forward" | "backward";

export interface AnimatedContentProps {
  /** Change this value to trigger the enter/exit transition */
  contentKey: string | number;
  /** Animation preset: horizontal slide, vertical slide, or fade */
  preset?: AnimationPreset;
  /** Direction of the transition */
  direction?: AnimationDirection;
  /** Style applied to the outer clipping container */
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const SLIDE_DURATION = 400;
const SCREEN_WIDTH = Dimensions.get("window").width;

const ENTERING = {
  "horizontal-slide": {
    forward: () => SlideInRight.springify(SLIDE_DURATION),
    backward: () => SlideInLeft.withInitialValues({originX: -SCREEN_WIDTH / 2}).springify(SLIDE_DURATION),
  },
  "vertical-slide": {
    forward: () => SlideInDown.springify(),
    backward: () => SlideInUp.springify(),
  },
  "horizontal-fade": {
    forward: () => FadeInRight.springify(),
    backward: () => FadeInLeft.springify(),
  },
  "vertical-fade": {
    forward: () => FadeInDown.springify(),
    backward: () => FadeInUp.springify(),
  },
  "fade": {
    forward: () => FadeIn.springify(),
    backward: () => FadeIn.springify(),
  },
} as const;

const EXITING = {
  "horizontal-slide": {
    forward: () => SlideOutLeft.withInitialValues({originX: -SCREEN_WIDTH / 2}).springify(SLIDE_DURATION),
    backward: () => SlideOutRight.springify(SLIDE_DURATION),
  },
  "vertical-slide": {
    forward: () => SlideOutUp.springify(),
    backward: () => SlideOutDown.springify(),
  },
  "horizontal-fade": {
    forward: () => FadeOutLeft.springify(),
    backward: () => FadeOutRight.springify(),
  },
  "vertical-fade": {
    forward: () => FadeOutUp.springify(),
    backward: () => FadeOutDown.springify(),
  },
  "fade": {
    forward: () => FadeOut.springify(),
    backward: () => FadeOut.springify(),
  },
} as const;

export function AnimatedContent({
  contentKey,
  preset = "fade",
  direction = "forward",
  style,
  children,
}: AnimatedContentProps) {
  const entering = useMemo(
    () => ENTERING[preset][direction](),
    [preset, direction],
  );

  const exiting = useMemo(
    () => EXITING[preset][direction](),
    [preset, direction],
  );

  return (
    <View style={style}>
      <Animated.View
        key={contentKey}
        entering={entering}
        exiting={exiting}
      >
        {children}
      </Animated.View>
    </View>
  );
}
