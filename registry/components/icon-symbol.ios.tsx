import { SymbolView, type SymbolViewProps, type SymbolWeight } from "expo-symbols";
import { type StyleProp, type ViewStyle } from "react-native";
import { getSVGIconName, SVGIcon } from "@popapp/components/icon-svg";
import type { IconSymbolName } from "@popapp/components/icon-symbol.types";

/**
 * iOS implementation — renders native SF Symbols via expo-symbols,
 * with fallback to custom SVG icons when prefixed with `svg-`.
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
  const svgIconName = getSVGIconName(name);
  if (svgIconName) {
    return <SVGIcon name={svgIconName} size={size} color={color} style={style} />;
  }

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
