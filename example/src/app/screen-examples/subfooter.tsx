import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent, ScreenFooter, ScreenSubfooter } from "@popapp/components/screen";
import { ActionIcon } from "@popapp/components/action-icon";
import { Button } from "@popapp/components/button";
import { OptionGroup } from "@popapp/components/option-group";
import { IconSymbol } from "@popapp/components/icon-symbol.ios";

const ITEMS = [
  { value: "shirt", label: "Classic T-Shirt", description: "Cotton, available in 5 colors" },
  { value: "hoodie", label: "Zip Hoodie", description: "Fleece-lined, unisex fit" },
  { value: "cap", label: "Snapback Cap", description: "Adjustable, one size fits all" },
  { value: "bag", label: "Tote Bag", description: "Canvas, reinforced handles" },
];

export default function SubfooterExample() {
  const { colors } = useTheme();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const total = selected.length * 29.99;

  return (
    <Screen variant="solid">
      <ScreenHeader
        title="Shop"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
      />
      <ScreenContent>
        <View style={styles.hero}>
          <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
            <IconSymbol name="bag.fill" size={28} color={colors.primary} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>
            Select Items
          </Text>
          <Text style={[styles.heroSub, { color: colors.foregroundSecondary }]}>
            Pick one or more items to add to your cart.
          </Text>
        </View>

        <OptionGroup
          mode="multi"
          options={ITEMS}
          value={selected}
          onChange={setSelected}
        />
      </ScreenContent>

      <ScreenSubfooter style={{ paddingVertical: 8 }}>
        <Button
          title={selected.length > 0 ? `Add to Cart — $${total.toFixed(2)}` : "Select Items"}
          onPress={() => router.back()}
          disabled={selected.length === 0}
          fullWidth
          style={styles.subfooterButton}
        />
      </ScreenSubfooter>

      <ScreenFooter>
        <View style={styles.footerContent}>
          <IconSymbol name="shippingbox.fill" size={14} color={colors.foregroundSecondary} />
          <Text style={[styles.footerText, { color: colors.foregroundSecondary }]}>
            Free shipping on orders over $50
          </Text>
        </View>
      </ScreenFooter>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  heroSub: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  subfooterButton: {
    marginBottom: 12,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 13,
  },
});
