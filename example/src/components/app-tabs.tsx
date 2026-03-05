import { NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";
import { useTheme } from "@popapp/theme/use-theme";

export default function AppTabs() {
  const { colors } = useTheme();

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.card}
      labelStyle={{ selected: { color: colors.primary } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Components</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="square.grid.2x2.fill"
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="forms">
        <NativeTabs.Trigger.Label>Forms</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="rectangle.and.pencil.and.ellipsis"
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="layout-demo">
        <NativeTabs.Trigger.Label>Layout</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="rectangle.3.group"
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
