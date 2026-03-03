/**
 * Safe Glass View wrapper.
 *
 * Imports expo-glass-effect lazily so components never crash if it's not installed
 * or if the platform doesn't support Liquid Glass (iOS 26+).
 *
 * Falls back to rendering children directly when unavailable.
 */

import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";

let GlassView: any = null;
let isLiquidGlassAvailable: (() => boolean) | null = null;

try {
  const glass = require("expo-glass-effect");
  GlassView = glass.GlassView;
  isLiquidGlassAvailable = glass.isLiquidGlassAvailable;
} catch {
  // expo-glass-effect not installed — glass will be silently skipped
}

/**
 * Returns true when Liquid Glass is supported on the current device.
 */
export function isGlassAvailable(): boolean {
  return isLiquidGlassAvailable?.() ?? false;
}

/**
 * Renders children wrapped in a GlassView when available,
 * otherwise renders children directly.
 */
export function SafeGlassView({
  children,
  tintColor,
  isInteractive = true,
  style,
}: {
  children: React.ReactNode;
  tintColor?: string;
  isInteractive?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  if (!GlassView || !isGlassAvailable()) {
    return <>{children}</>;
  }

  return (
    <GlassView
      tintColor={tintColor}
      isInteractive={isInteractive}
      style={style}
    >
      {children}
    </GlassView>
  );
}
