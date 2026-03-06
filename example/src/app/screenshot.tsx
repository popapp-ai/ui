import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Button } from "@popapp/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@popapp/components/card";
import { Badge } from "@popapp/components/badge";
import { TextInput } from "@popapp/components/text-input";
import { TextArea } from "@popapp/components/text-area";
import { ActionIcon } from "@popapp/components/action-icon";
import { IconSymbol } from "@popapp/components/icon-symbol";
import { ThemeIcon } from "@popapp/components/theme-icon";
import { Skeleton } from "@popapp/components/skeleton";
import { ProgressRing } from "@popapp/components/progress-ring";
import { Ticker } from "@popapp/components/ticker";
import { OptionGroup } from "@popapp/components/option-group";
import { InputStepper } from "@popapp/components/input-stepper";
import { SliderBar } from "@popapp/components/slider-bar";
import { RulerSlider } from "@popapp/components/ruler-slider";
import { Markdown } from "@popapp/components/markdown";
import { DatePicker } from "@popapp/components/date-picker";
import {
  ListSection,
  ListNavigationCell,
  ListToggleCell,
  ListActionCell,
} from "@popapp/components/list";

// ─── Screenshot definitions ────────────────────────────────────────

const SCREENSHOTS: Record<string, React.FC> = {
  // Card: basic card with all sections
  card: () => {
    const { colors } = useTheme();
    return (
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>A brief description of the card content.</CardDescription>
        </CardHeader>
        <CardContent>
          <Text style={{ color: colors.foreground, fontSize: 15 }}>
            This is the main content area of the card component.
          </Text>
        </CardContent>
        <CardFooter>
          <Button title="Action" size="sm" onPress={() => {}} />
        </CardFooter>
      </Card>
    );
  },

  // Badge: all variants in a row
  "badge-variants": () => (
    <View style={styles.row}>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="outline">Outline</Badge>
    </View>
  ),

  // Button: all variants
  "button-variants": () => (
    <View style={styles.row}>
      <Button title="Solid" variant="solid" size="md" onPress={() => {}} />
      <Button title="Subtle" variant="subtle" size="md" onPress={() => {}} />
      <Button title="Outline" variant="outline" size="md" onPress={() => {}} />
      <Button title="Destructive" variant="destructive" size="md" onPress={() => {}} />
      <Button title="Ghost" variant="ghost" size="md" onPress={() => {}} />
    </View>
  ),

  // Button: all sizes
  "button-sizes": () => (
    <View style={styles.row}>
      <Button title="XS" size="xs" onPress={() => {}} />
      <Button title="SM" size="sm" onPress={() => {}} />
      <Button title="MD" size="md" onPress={() => {}} />
      <Button title="LG" size="lg" onPress={() => {}} />
    </View>
  ),

  // Button: full-width variants
  "button-variants-full-width": () => (
    <View style={styles.list}>
      <Button fullWidth title="Full Width Button" onPress={() => {}} />
      <Button fullWidth glass={false} title="Not Glass Button" onPress={() => {}} />
      <Button fullWidth glass={false} variant="subtle" title="Not Glass Subtle Button" onPress={() => {}} />
      <Button fullWidth disabled title="Disabled" onPress={() => {}} />
    </View>
  ),

  // TextInput: states
  "input-states": () => {
    const { colors } = useTheme();
    return (
      <View style={styles.list}>
        <TextInput label="Email" placeholder="Enter your email" />
        <TextInput label="Name" placeholder="Full name" value="Jane Cooper" />
        <TextInput label="Username" placeholder="Choose a username" error="Username 'admin' is already taken" value="admin" />
        <TextInput label="Company" placeholder="Company name" disabled />
      </View>
    );
  },

  // TextInput: sizes
  "input-sizes": () => (
    <View style={styles.list}>
      <TextInput label="Small" placeholder="SM input" size="sm" />
      <TextInput label="Medium" placeholder="MD input" size="md" />
      <TextInput label="Large" placeholder="LG input" size="lg" />
    </View>
  ),

  // TextArea: states
  "textarea-states": () => (
    <View style={styles.list}>
      <TextArea label="Feedback" placeholder="Tell us what you think about the app..." />
      <TextArea label="Bug Report" placeholder="Describe the issue..." error="Please provide at least 20 characters" />
    </View>
  ),

  // OTP Input - we'll show a text-input based mock since OTP needs special handling
  "input-otp": () => {
    const { colors } = useTheme();
    return (
      <View style={styles.centered}>
        <View style={styles.otpRow}>
          {["4", "2", "", "", "", ""].map((digit, i) => (
            <View
              key={i}
              style={[
                styles.otpBox,
                {
                  backgroundColor: colors.card,
                  borderColor: digit ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.otpDigit, { color: colors.foreground }]}>{digit}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  },

  // InputStepper
  "input-stepper": () => {
    const { colors } = useTheme();
    return (
      <Card>
        <CardContent>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "600" }}>Guests</Text>
              <Text style={{ color: colors.foregroundSecondary, fontSize: 13 }}>Including children</Text>
            </View>
            <InputStepper value={2} onIncrement={() => {}} onDecrement={() => {}} min={1} max={20} size="md" />
          </View>
        </CardContent>
      </Card>
    );
  },

  // ActionIcon: variants and sizes
  "action-icons-variations": () => (
    <View style={styles.list}>
      <View style={styles.row}>
        <ActionIcon name="plus" variant="solid" size="md" onPress={() => {}} />
        <ActionIcon name="plus" variant="subtle" size="md" onPress={() => {}} />
        <ActionIcon name="plus" variant="outline" size="md" onPress={() => {}} />
        <ActionIcon name="plus" variant="ghost" size="md" onPress={() => {}} />
        <ActionIcon name="plus" variant="destructive" size="md" onPress={() => {}} />
      </View>
      <View style={styles.row}>
        <ActionIcon name="heart.fill" size="xs" onPress={() => {}} />
        <ActionIcon name="heart.fill" size="sm" onPress={() => {}} />
        <ActionIcon name="heart.fill" size="md" onPress={() => {}} />
        <ActionIcon name="heart.fill" size="lg" onPress={() => {}} />
      </View>
    </View>
  ),

  // ThemeIcon: color variations
  "theme-icons-variations": () => (
    <View style={styles.list}>
      <View style={styles.row}>
        <ThemeIcon name="star.fill" color="#FF9500" />
        <ThemeIcon name="heart.fill" color="#FF2D55" />
        <ThemeIcon name="bell.fill" color="#007AFF" />
        <ThemeIcon name="leaf.fill" color="#34C759" />
        <ThemeIcon name="flame.fill" color="#FF3B30" />
        <ThemeIcon name="bolt.fill" color="#5856D6" />
      </View>
      <View style={styles.row}>
        <ThemeIcon name="doc.fill" color="#007AFF" square />
        <ThemeIcon name="folder.fill" color="#FF9500" square />
        <ThemeIcon name="trash.fill" color="#FF3B30" square />
        <ThemeIcon name="lock.fill" color="#5856D6" square />
      </View>
    </View>
  ),

  // OptionGroup: single select
  "option-group-single-select": () => (
    <OptionGroup
      mode="single"
      options={[
        { value: "standard", label: "Standard", description: "5-7 business days - Free" },
        { value: "express", label: "Express", description: "2-3 business days - $9.99" },
        { value: "overnight", label: "Overnight", description: "Next business day - $24.99" },
      ]}
      value="express"
      onChange={() => {}}
    />
  ),

  // OptionGroup: multi select
  "option-group-multi-select": () => (
    <OptionGroup
      mode="multi"
      options={[
        { value: "design", label: "Design", description: "UI/UX, prototyping, visual design" },
        { value: "engineering", label: "Engineering", description: "Frontend, backend, mobile" },
        { value: "product", label: "Product", description: "Strategy, roadmaps, analytics" },
        { value: "marketing", label: "Marketing", description: "Growth, content, brand" },
      ]}
      value={["design", "engineering"]}
      onChange={() => {}}
    />
  ),

  // Skeleton: profile loading
  skeleton: () => {
    const { colors } = useTheme();
    return (
      <Card>
        <CardContent>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Skeleton width={56} height={56} borderRadius={28} />
            <View style={{ flex: 1, gap: 8 }}>
              <Skeleton width="60%" height={18} borderRadius={4} />
              <Skeleton width="40%" height={14} borderRadius={4} />
            </View>
          </View>
        </CardContent>
      </Card>
    );
  },

  // ProgressRing
  "progress-ring": () => {
    const { colors } = useTheme();
    return (
      <View style={styles.centered}>
        <ProgressRing
          value={73}
          maxValue={100}
          size={140}
          strokeWidth={12}
          centerLabel={<Ticker value={73} fontSize={28} decimals={0} unit="%" />}
        />
      </View>
    );
  },

  // Ticker
  ticker: () => (
    <View style={styles.centered}>
      <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
        <View style={{ alignItems: "center", gap: 4 }}>
          <Ticker value={42.5} decimals={1} fontSize={32} unit="°C" />
        </View>
        <View style={{ alignItems: "center", gap: 4 }}>
          <Ticker value={1299.99} decimals={2} fontSize={32} unit="$" />
        </View>
      </View>
    </View>
  ),

  // List: navigation cells
  "list-cell-nav": () => (
    <ListSection title="Account">
      <ListNavigationCell icon="person.circle.fill" label="Profile" value="Jane Cooper" onPress={() => {}} />
      <ListNavigationCell icon="envelope.fill" label="Email" value="jane@co.com" onPress={() => {}} />
      <ListNavigationCell icon="key.fill" label="Password" value="Changed 3 days ago" onPress={() => {}} last />
    </ListSection>
  ),

  // List: toggle cells
  "list-cell-toggle": () => (
    <ListSection title="Preferences">
      <ListToggleCell icon="bell.badge.fill" label="Notifications" value={true} onToggle={() => {}} />
      <ListToggleCell icon="arrow.down.circle.fill" label="Auto-Update" value={true} onToggle={() => {}} />
      <ListToggleCell icon="location.fill" label="Location Services" value={false} onToggle={() => {}} />
      <ListToggleCell icon="chart.bar.fill" label="Share Analytics" value={false} onToggle={() => {}} last />
    </ListSection>
  ),

  // List: action cells
  "list-cell-action": () => (
    <ListSection>
      <ListActionCell label="Restore Purchases" onPress={() => {}} />
      <ListActionCell label="Clear Cache" onPress={() => {}} />
      <ListActionCell label="Delete All Data" destructive onPress={() => {}} last />
    </ListSection>
  ),

  // Markdown
  markdown: () => (
    <Card>
      <CardContent>
        <Markdown>{`## What's New in v2.4.0

### New Features

- **Dark Mode**: Full system-level dark mode support
- **Offline Mode**: Access recent documents without internet
- **Quick Actions**: Long-press app icon for shortcuts

### Bug Fixes

- Fixed crash when opening large files
- Resolved sync issues with iCloud`}</Markdown>
      </CardContent>
    </Card>
  ),

  // DatePicker
  "date-picker-wheel": () => (
    <DatePicker value={new Date(2000, 5, 15)} onChange={() => {}} />
  ),

  // SliderBar
  "slider-bar": () => (
    <View style={styles.list}>
      <SliderBar value={0.7} onValueChange={() => {}} min={0} max={1} step={0.01} />
      <SliderBar
        value={0.5}
        onValueChange={() => {}}
        min={0}
        max={1}
        step={0.1}
        labels={[
          { text: "Low", position: 0 },
          { text: "Med", position: 0.5 },
          { text: "High", position: 1 },
        ]}
      />
    </View>
  ),

  // RulerSlider
  "ruler-slider": () => (
    <RulerSlider
      value={170}
      onValueChange={() => {}}
      min={100}
      max={220}
      step={1}
      majorStep={10}
      midStep={5}
      unit="cm"
    />
  ),
};

// ─── Screen component ──────────────────────────────────────────────

export default function ScreenshotScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const Component = id ? SCREENSHOTS[id] : null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {Component ? <Component /> : null}
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  content: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  list: {
    gap: 12,
  },
  centered: {
    alignItems: "center",
  },
  otpRow: {
    flexDirection: "row",
    gap: 8,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  otpDigit: {
    fontSize: 24,
    fontWeight: "700",
  },
});
