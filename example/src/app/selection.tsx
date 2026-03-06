import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { OptionCard } from "@popapp/components/option-card";
import { OptionGroup } from "@popapp/components/option-group";
import { IconSymbol } from "@popapp/components/icon-symbol";
import { ActionIcon } from "@popapp/components/action-icon";
import { Separator } from "@popapp/components/separator";
import { ListSection, ListNavigationCell } from "@popapp/components/list";
import { DemoSection } from "@/components/demo-section";

export default function SelectionScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [travelStyle, setTravelStyle] = useState<string | null>(null);
  const [mealPref, setMealPref] = useState<string | null>(null);
  const [shipping, setShipping] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  return (
    <Screen>
      <ScreenHeader
        title="Selection & Choice"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
      />
      <ScreenContent>
        {/* ── In Context: full-screen demo ────────────────────── */}
        <DemoSection title="In Context" description="Full-screen selection experience">
          <ListSection>
            <ListNavigationCell
              icon="creditcard.fill"
              label="Choose Your Plan"
              value="Subscription picker"
              onPress={() => router.push("/choose-plan")}
              last
            />
          </ListSection>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── Horizontal Selection ──────────────────────────────── */}
        <DemoSection title="Horizontal Selection" description="Quick two-option selection">
          <Text style={[styles.label, { color: colors.foreground }]}>
            How do you prefer to travel?
          </Text>
          <OptionGroup
            mode="single"
            layout="horizontal"
            options={[
              {
                value: "window",
                label: "Window",
                icon: <IconSymbol name="sun.max.fill" size={24} color={colors.foreground} />,
              },
              {
                value: "aisle",
                label: "Aisle",
                icon: <IconSymbol name="figure.walk" size={24} color={colors.foreground} />,
              },
            ]}
            value={travelStyle}
            onChange={setTravelStyle}
          />

          <Text style={[styles.label, { color: colors.foreground }]}>
            Dietary preference?
          </Text>
          <OptionGroup
            mode="single"
            layout="horizontal"
            options={[
              {
                value: "regular",
                label: "Regular",
                icon: <IconSymbol name="fork.knife" size={24} color={colors.foreground} />,
              },
              {
                value: "vegetarian",
                label: "Vegetarian",
                icon: <IconSymbol name="leaf.fill" size={24} color={colors.foreground} />,
              },
            ]}
            value={mealPref}
            onChange={setMealPref}
          />
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── OptionGroup (Single) ────────────────────────────── */}
        <DemoSection title="OptionGroup (Single)" description="Choose one option from a list">
          <Text style={[styles.label, { color: colors.foreground }]}>
            Shipping Method
          </Text>
          <OptionGroup
            mode="single"
            options={[
              { value: "standard", label: "Standard", description: "5-7 business days - Free" },
              { value: "express", label: "Express", description: "2-3 business days - $9.99" },
              { value: "overnight", label: "Overnight", description: "Next business day - $24.99" },
            ]}
            value={shipping}
            onChange={setShipping}
          />
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── OptionGroup (Multi) ─────────────────────────────── */}
        <DemoSection title="OptionGroup (Multi)" description="Select multiple options">
          <Text style={[styles.label, { color: colors.foreground }]}>
            What are you interested in?
          </Text>
          <OptionGroup
            mode="multi"
            options={[
              { value: "design", label: "Design", description: "UI/UX, prototyping, visual design" },
              { value: "engineering", label: "Engineering", description: "Frontend, backend, mobile" },
              { value: "product", label: "Product", description: "Strategy, roadmaps, analytics" },
              { value: "marketing", label: "Marketing", description: "Growth, content, brand" },
            ]}
            value={interests}
            onChange={setInterests}
          />
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── OptionCard standalone ───────────────────────────── */}
        <DemoSection title="OptionCard" description="Individual selectable items with checkboxes">
          <Text style={[styles.label, { color: colors.foreground }]}>
            Notification preferences
          </Text>
          {[
            { id: "email", label: "Email notifications", desc: "Receive updates via email" },
            { id: "push", label: "Push notifications", desc: "Get alerts on your device" },
            { id: "sms", label: "SMS notifications", desc: "Text messages for urgent updates" },
          ].map((item) => (
            <OptionCard
              key={item.id}
              label={item.label}
              description={item.desc}
              selected={notifications.includes(item.id)}
              showCheckbox
              onPress={() =>
                setNotifications((prev) =>
                  prev.includes(item.id) ? prev.filter((v) => v !== item.id) : [...prev, item.id],
                )
              }
            />
          ))}
        </DemoSection>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: "600" },
});
