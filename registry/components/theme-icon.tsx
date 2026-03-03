import { IconSymbol } from "@popapp/components/icon-symbol";
import type { IconSymbolName } from "@popapp/components/icon-symbol.types";
import { StyleSheet, View } from "react-native";

export function ThemeIcon({
  name,
  color,
  size = 52,
  square = false,
}: {
  name: IconSymbolName;
  color: string;
  size?: number;
  square?: boolean;
}) {
  return (
    <View
      style={[
        styles.iconCircle,
        {
          backgroundColor: color + "18",
          width: size,
          height: size,
          borderRadius: square ? size / 3.5 : size / 2,
        },
      ]}
    >
      <IconSymbol name={name} size={size / 2} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    justifyContent: "center",
    alignItems: "center",
  },
});
