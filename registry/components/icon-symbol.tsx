// Fallback for Android and web — uses Material Icons with SF Symbol name mapping.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { SymbolWeight } from "expo-symbols";
import { type ComponentProps } from "react";
import { type OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";
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
  "document.on.document": "content-copy",

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
 * Android/Web implementation — renders Material Icons via @expo/vector-icons.
 *
 * Icon names are SF Symbol names. They are mapped to Material Icons
 * via the MAPPING table. Extend MAPPING to add more icons.
 *
 * To add custom SVG icons, install the `svg-icons` extension
 * and wrap this component with SVG icon support.
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
  const materialName = (name in MAPPING ? MAPPING[name] : null) ?? DEFAULT_ICON;
  return <MaterialIcons color={color} size={size} name={materialName} style={style} />;
}
