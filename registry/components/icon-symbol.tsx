// Fallback for Android and web — uses Material Icons with SF Symbol name mapping.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { SymbolWeight } from "expo-symbols";
import { type ComponentProps } from "react";
import { type OpaqueColorValue, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { getSVGIconName, SVGIcon } from "@popapp/components/icon-svg";
import type { IconSymbolName } from "@popapp/components/icon-symbol.types";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

/**
 * SF Symbol → Material Icon mapping.
 *
 * Add your own mappings here. The key is the SF Symbol name,
 * the value is the Material Icon name.
 *
 * Browse Material Icons: https://icons.expo.fyi
 * Browse SF Symbols: https://developer.apple.com/sf-symbols/
 */
const MAPPING: Record<string, MaterialIconName> = {
  // Navigation
  "house.fill": "home",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "xmark": "close",
  "checkmark": "check",
  "ellipsis": "more-horiz",
  "plus": "add",
  "minus": "remove",
  "arrow.triangle.2.circlepath": "sync",

  // Actions
  "paperplane.fill": "send",
  "trash.fill": "delete",
  "magnifyingglass": "search",
  "camera.fill": "camera-alt",
  "photo.on.rectangle": "photo-library",

  // Info
  "info.circle.fill": "info",
  "exclamationmark.triangle.fill": "warning",
  "heart.fill": "favorite",
  "clock.fill": "schedule",

  // Content
  "text.bubble.fill": "chat",
  "bolt.fill": "bolt",
  "flame.fill": "local-fire-department",
  "chart.bar.fill": "bar-chart",
  "number": "tag",
};

const DEFAULT_ICON: MaterialIconName = "help-outline";

/**
 * Android/Web implementation — renders Material Icons via @expo/vector-icons,
 * with fallback to custom SVG icons when prefixed with `svg-`.
 *
 * Icon names are SF Symbol names. They are mapped to Material Icons
 * via the MAPPING table. Extend MAPPING to add more icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Check if this is an SVG icon
  const svgIconName = getSVGIconName(name);
  if (svgIconName) {
    return (
      <SVGIcon
        name={svgIconName}
        size={size}
        color={typeof color === "string" ? color : undefined}
        style={style as StyleProp<ViewStyle>}
      />
    );
  }

  const materialName = (name in MAPPING ? MAPPING[name] : null) ?? DEFAULT_ICON;
  return <MaterialIcons color={color} size={size} name={materialName} style={style} />;
}
