import React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { ICON_COMPONENTS, type SVGIconName } from "@popapp/components/svg-icons";

interface SVGIconProps {
  name: SVGIconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function SVGIcon({ name, size = 24, color, style }: SVGIconProps) {
  const IconComponent = (ICON_COMPONENTS as Record<string, any>)[name];

  if (!IconComponent) {
    return null;
  }

  return (
    <View
      style={[
        style,
        { width: size, height: size, alignItems: "center", justifyContent: "center" },
      ]}
    >
      <IconComponent size={size * 1.5} color={color} />
    </View>
  );
}

export function getSVGIconName(name: string): SVGIconName | null {
  if (name.startsWith("svg-")) {
    const iconName = name.slice(4) as SVGIconName;
    if (iconName in ICON_COMPONENTS) {
      return iconName;
    }
  }
  return null;
}
