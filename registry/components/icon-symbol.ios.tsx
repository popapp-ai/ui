import { SymbolView, type SymbolViewProps, type SymbolWeight } from "expo-symbols";
import { type StyleProp, type ViewStyle } from "react-native";
import type { IconSymbolName } from "@popapp/components/icon-symbol.types";

/**
 * iOS implementation — renders native SF Symbols via expo-symbols.
 *
 * To add custom SVG icons, install the `svg-icons` extension
 * and wrap this component with SVG icon support.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "regular",
}: {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name as SymbolViewProps["name"]}
      style={[{ width: size, height: size }, style]}
    />
  );
}
