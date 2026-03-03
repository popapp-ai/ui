import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import Svg from "react-native-svg";

export interface IconProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

interface BaseIconProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function BaseIcon({ size = 24, style, children }: BaseIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none">
      {children}
    </Svg>
  );
}
