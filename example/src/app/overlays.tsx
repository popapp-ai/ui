import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { Button } from "@popapp/components/button";
import { BottomSheet } from "@popapp/components/bottom-sheet";
import { TextInput } from "@popapp/components/text-input";
import { RulerSlider } from "@popapp/components/ruler-slider";
import { ActionIcon } from "@popapp/components/action-icon";
import { OptionGroup } from "@popapp/components/option-group";
import { ListSection, ListNavigationCell } from "@popapp/components/list";

export default function OverlaysScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [basicSheet, setBasicSheet] = useState(false);
  const [formSheet, setFormSheet] = useState(false);
  const [shareSheet, setShareSheet] = useState(false);
  const [filterSheet, setFilterSheet] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  return (
    <Screen>
      <ScreenHeader
        title="Bottom Sheet"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
      />
      <ScreenContent>
        <ListSection title="Examples">
          <ListNavigationCell
            icon="doc.text"
            label="Basic Sheet"
            value="Text & slider"
            onPress={() => setBasicSheet(true)}
          />
          <ListNavigationCell
            icon="rectangle.and.pencil.and.ellipsis"
            label="Form Sheet"
            value="Keyboard-aware"
            onPress={() => setFormSheet(true)}
          />
          <ListNavigationCell
            icon="square.and.arrow.up"
            label="Share Sheet"
            value="Action grid"
            onPress={() => setShareSheet(true)}
          />
          <ListNavigationCell
            icon="line.3.horizontal.decrease.circle"
            label="Filter Sheet"
            value="Multi-select"
            onPress={() => setFilterSheet(true)}
            last
          />
        </ListSection>
      </ScreenContent>

      {/* ── Basic Sheet ───────────────────────────────────────── */}
      <BottomSheet visible={basicSheet} onDismiss={() => setBasicSheet(false)}>
        <View style={styles.sheetContent}>
          <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
            Basic Bottom Sheet
          </Text>
          <Text style={[styles.sheetBody, { color: colors.foregroundSecondary }]}>
            Swipe down or tap the backdrop to dismiss. The sheet uses spring animations
            for a natural feel.
          </Text>
          <RulerSlider
            value={sliderValue}
            onValueChange={setSliderValue}
            min={0}
            max={100}
            step={1}
            majorStep={10}
            midStep={5}
            unit="ML"
          />
          <Button title="Got It" fullWidth onPress={() => setBasicSheet(false)} />
        </View>
      </BottomSheet>

      {/* ── Form Sheet ────────────────────────────────────────── */}
      <BottomSheet visible={formSheet} onDismiss={() => setFormSheet(false)} keyboardAware>
        <View style={styles.sheetContent}>
          <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
            Add New Address
          </Text>
          <TextInput label="Street" placeholder="123 Main Street" />
          <TextInput label="City" placeholder="San Francisco" />
          <View style={styles.formRow}>
            <View style={{ flex: 1 }}>
              <TextInput label="State" placeholder="CA" />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput label="ZIP" placeholder="94102" keyboardType="number-pad" />
            </View>
          </View>
          <Button title="Save Address" fullWidth onPress={() => setFormSheet(false)} />
        </View>
      </BottomSheet>

      {/* ── Share Sheet ───────────────────────────────────────── */}
      <BottomSheet visible={shareSheet} onDismiss={() => setShareSheet(false)}>
        <View style={styles.sheetContent}>
          <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Share</Text>
          <View style={styles.shareGrid}>
            {[
              { icon: "message.fill", label: "Messages" },
              { icon: "envelope.fill", label: "Mail" },
              { icon: "doc.on.doc.fill", label: "Copy Link" },
              { icon: "bookmark.fill", label: "Save" },
            ].map((item) => (
              <View key={item.label} style={styles.shareItem}>
                <ActionIcon
                  name={item.icon}
                  size="lg"
                  variant="subtle"
                  onPress={() => setShareSheet(false)}
                />
                <Text style={[styles.shareLabel, { color: colors.foregroundSecondary }]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </BottomSheet>

      {/* ── Filter Sheet ──────────────────────────────────────── */}
      <BottomSheet visible={filterSheet} onDismiss={() => setFilterSheet(false)}>
        <View style={styles.sheetContent}>
          <View style={styles.filterHeader}>
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Sort & Filter</Text>
            <Button title="Reset" variant="ghost" size="sm" onPress={() => setSelectedFilters([])} />
          </View>
          <OptionGroup
            mode="multi"
            options={[
              { value: "newest", label: "Newest First", description: "Most recently added" },
              { value: "price_low", label: "Price: Low to High", description: "Budget-friendly first" },
              { value: "popular", label: "Most Popular", description: "Highest number of orders" },
              { value: "rated", label: "Best Rated", description: "4 stars and above" },
              { value: "sale", label: "On Sale", description: "Currently discounted" },
            ]}
            value={selectedFilters}
            onChange={setSelectedFilters}
          />
          <Button
            title={selectedFilters.length > 0 ? `Apply ${selectedFilters.length} Filter${selectedFilters.length > 1 ? "s" : ""}` : "Apply Filters"}
            fullWidth
            onPress={() => setFilterSheet(false)}
          />
        </View>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheetContent: { paddingHorizontal: 20, gap: 16 },
  sheetTitle: { fontSize: 22, fontWeight: "700" },
  sheetBody: { fontSize: 15, lineHeight: 22 },
  formRow: { flexDirection: "row", gap: 12 },
  shareGrid: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 8 },
  shareItem: { alignItems: "center", gap: 8 },
  shareLabel: { fontSize: 12 },
  filterHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
