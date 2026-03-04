import React, { useCallback, useEffect } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ModalView } from 'react-native-multiple-modals';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@popapp/theme/use-theme";

const MAX_UPWARD_DISTANCE = 20;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface BottomSheetProps {
  /** Whether the sheet is visible. */
  visible: boolean;
  /** Called when the sheet should close. */
  onDismiss: () => void;
  children: React.ReactNode;
  /** Whether the sheet should be keyboard aware (default false). */
  keyboardAware?: boolean;
  /** Backdrop opacity (default 0.4). */
  backdropOpacity?: number;
  /** Dismiss when tapping the backdrop (default true). */
  dismissOnBackdrop?: boolean;
  /** Allow swipe-to-dismiss (default true). */
  panToDismiss?: boolean;
  /** Extra padding at the bottom (default 16). */
  paddingBottom?: number;
  /** Offset for extra bottom space outside the screen */
  bottomOverflowOffset?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BottomSheet({
  visible,
  onDismiss,
  children,
  keyboardAware = false,
  backdropOpacity = 0.4,
  dismissOnBackdrop = true,
  panToDismiss = true,
  paddingBottom = 16,
  bottomOverflowOffset = 100,
}: BottomSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(800);
  const backdrop = useSharedValue(0);
  const contentHeight = useSharedValue(0);

  const handleDismiss = useCallback(() => {
    Keyboard.dismiss();
    contentHeight.value = 0;
    onDismiss();
  }, [onDismiss, contentHeight]);

  const triggerDismiss = useCallback(() => {
    if (!dismissOnBackdrop) return;
    translateY.value = withTiming(800, { duration: 280 });
    backdrop.value = withTiming(0, { duration: 220 }, (finished) => {
      if (finished) {
        runOnJS(handleDismiss)();
      }
    });
  }, [handleDismiss, translateY, backdrop]);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        mass: 1,
      });
      backdrop.value = withTiming(backdropOpacity, { duration: 250 });
    }
  }, [visible, translateY, backdrop, backdropOpacity]);

  const handleContentLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      const newHeight = event.nativeEvent.layout.height;
      const prevHeight = contentHeight.value;
      contentHeight.value = newHeight;

      if (prevHeight > 0 && visible && Math.abs(newHeight - prevHeight) > 1) {
        const diff = newHeight - prevHeight;
        translateY.value += diff;
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
          mass: 1,
        });
      }
    },
    [contentHeight, translateY, visible],
  );

  const panGesture = Gesture.Pan()
    .enabled(panToDismiss)
    .onUpdate((event) => {
      const isVertical =
        Math.abs(event.velocityY) > Math.abs(event.velocityX) * 1.5;

      if (isVertical) {
        if (event.translationY > 0) {
          translateY.value = event.translationY;
        } else {
          const resistance = 0.3;
          const limited = Math.abs(event.translationY) * resistance;
          translateY.value = -Math.min(limited, MAX_UPWARD_DISTANCE);
        }
      }
    })
    .onEnd((event) => {
      const isVertical =
        Math.abs(event.velocityY) > Math.abs(event.velocityX) * 1.5;
      const shouldDismiss =
        isVertical &&
        event.velocityY > 0 &&
        (event.translationY > 80 || event.velocityY > 800);

      if (shouldDismiss) {
        translateY.value = withTiming(800, { duration: 280 });
        backdrop.value = withTiming(0, { duration: 220 }, (finished) => {
          if (finished) {
            runOnJS(handleDismiss)();
          }
        });
      } else {
        translateY.value = withSpring(0, {
          damping: 25,
          stiffness: 400,
          mass: 1,
        });
      }
    });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value + bottomOverflowOffset }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value,
  }));

  const sheetContent = (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.sheet,
          sheetAnimatedStyle,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            paddingBottom: insets.bottom + paddingBottom + bottomOverflowOffset,
          },
        ]}
      >
        <View style={styles.handle}>
          <View style={[styles.handleBar, { backgroundColor: colors.muted }]} />
        </View>
        <View onLayout={handleContentLayout}>{children}</View>
      </Animated.View>
    </GestureDetector>
  );

  if(!visible) return null;

  return (
    <ModalView animationType="none" onRequestDismiss={triggerDismiss} showBackdrop={false} >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} onTouchStart={triggerDismiss} />

        {keyboardAware ? (
          <KeyboardStickyView
            style={styles.keyboardWrapper}
            offset={{ opened: insets.bottom, closed: 0 }}
            pointerEvents='box-none'
          >
            {sheetContent}
          </KeyboardStickyView>
        ) : (
          sheetContent
        )}
      </View>
    </ModalView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
  },
  handle: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  keyboardWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
