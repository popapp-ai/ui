import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { Button } from "@popapp/components/button";
import { ActionIcon } from "@popapp/components/action-icon";
import { Touchable } from "@popapp/components/touchable";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@popapp/components/card";
import { Badge } from "@popapp/components/badge";
import { IconSymbol } from "@popapp/components/icon-symbol";
import { ListSection, ListToggleCell } from "@popapp/components/list";
import { DemoSection } from "@/components/demo-section";

export default function ButtonsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [glass, setGlass] = useState(true);
  const [fullWidth, setFullWidth] = useState(false);

  return (
    <Screen>
      <ScreenHeader
        title="Buttons"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
      />
      <ScreenContent>
        {/* ── Real-world context ──────────────────────────────────── */}
        <DemoSection title="In Context" description="Buttons as they appear in real UIs">
          <Card>
            <CardContent>
              <View style={styles.contextHeader}>
                <View style={{ flex: 1 }}>
                  <CardTitle>AirPods Pro 2</CardTitle>
                  <CardDescription>Active Noise Cancellation</CardDescription>
                </View>
                <Text style={[styles.price, { color: colors.foreground }]}>$249</Text>
              </View>
            </CardContent>
            <CardFooter>
              <View style={styles.contextActions}>
                <Button
                  title="Add to Cart"
                  variant="solid"
                  size="md"
                  leftIcon="cart.fill"
                  onPress={() => {}}
                  style={{ flex: 1 }}
                />
                <ActionIcon name="heart" variant="outline" size="md" onPress={() => {}} />
                <ActionIcon name="square.and.arrow.up" variant="ghost" size="md" onPress={() => {}} />
              </View>
            </CardFooter>
          </Card>

          <Card>
            <CardContent>
              <View style={styles.contextRow}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={[styles.contextTitle, { color: colors.foreground }]}>
                    Cancel subscription?
                  </Text>
                  <Text style={{ color: colors.foregroundSecondary, fontSize: 14 }}>
                    You'll lose access to premium features on March 15.
                  </Text>
                </View>
              </View>
            </CardContent>
            <CardFooter>
              <View style={styles.contextActions}>
                <Button title="Keep Plan" variant="subtle" size="sm" onPress={() => {}} style={{ flex: 1 }} />
                <Button title="Cancel" variant="destructive" size="sm" onPress={() => {}} style={{ flex: 1 }} />
              </View>
            </CardFooter>
          </Card>

          <View style={styles.row}>
            <Button title="Learn More" variant="ghost" size="sm" rightIcon="arrow.right" onPress={() => {}} />
            <Button title="Skip" variant="ghost" size="sm" onPress={() => {}} />
          </View>
        </DemoSection>

        {/* ── Controls ─────────────────────────────────────────── */}
        <ListSection title="Toggle Props">
          <ListToggleCell icon="xmark.circle" label="Disabled" value={disabled} onToggle={setDisabled} />
          <ListToggleCell icon="arrow.2.circlepath" label="Loading" value={loading} onToggle={setLoading} />
          <ListToggleCell icon="drop.fill" label="Glass" value={glass} onToggle={setGlass} />
          <ListToggleCell icon="arrow.left.and.right" label="Full Width" value={fullWidth} onToggle={setFullWidth} last />
        </ListSection>

        {/* ── Button Variants ─────────────────────────────────── */}
        <DemoSection title="Variants">
          <View style={styles.list}>
            {(["solid", "subtle", "outline", "destructive", "ghost"] as const).map((variant) => (
              <Button
                key={variant}
                title={variant.charAt(0).toUpperCase() + variant.slice(1)}
                variant={variant}
                size="md"
                disabled={disabled}
                isLoading={loading}
                glass={glass}
                fullWidth={fullWidth}
                onPress={() => {}}
              />
            ))}
          </View>
        </DemoSection>

        {/* ── Button Sizes ────────────────────────────────────── */}
        <DemoSection title="Sizes">
          <View style={styles.row}>
            {(["xs", "sm", "md", "lg"] as const).map((size) => (
              <Button
                key={size}
                title={size.toUpperCase()}
                size={size}
                disabled={disabled}
                isLoading={loading}
                onPress={() => {}}
              />
            ))}
          </View>
        </DemoSection>

        {/* ── With Icons ──────────────────────────────────────── */}
        <DemoSection title="With Icons">
          <View style={styles.list}>
            <Button title="Download" leftIcon="arrow.down.circle.fill" onPress={() => {}} disabled={disabled} isLoading={loading} />
            <Button title="Continue" rightIcon="arrow.right" variant="subtle" onPress={() => {}} disabled={disabled} isLoading={loading} />
            <Button title="Delete" leftIcon="trash.fill" variant="destructive" onPress={() => {}} disabled={disabled} isLoading={loading} />
          </View>
        </DemoSection>

        {/* ── ActionIcon ──────────────────────────────────────── */}
        <DemoSection title="ActionIcon" description="Circular icon-only buttons">
          <Text style={[styles.label, { color: colors.foregroundSecondary }]}>Variants</Text>
          <View style={styles.row}>
            {(["solid", "subtle", "outline", "ghost", "destructive"] as const).map((variant) => (
              <ActionIcon key={variant} name="plus" variant={variant} size="md" onPress={() => {}} disabled={disabled} isLoading={loading} />
            ))}
          </View>

          <Text style={[styles.label, { color: colors.foregroundSecondary }]}>Sizes</Text>
          <View style={styles.row}>
            {(["xs", "sm", "md", "lg"] as const).map((size) => (
              <ActionIcon key={size} name="heart.fill" size={size} onPress={() => {}} disabled={disabled} isLoading={loading} />
            ))}
          </View>

          <Text style={[styles.label, { color: colors.foregroundSecondary }]}>Glass</Text>
          <View style={styles.row}>
            <ActionIcon name="square.and.arrow.up" glass onPress={() => {}} disabled={disabled} />
            <ActionIcon name="ellipsis" glass onPress={() => {}} disabled={disabled} />
            <ActionIcon name="xmark" glass onPress={() => {}} disabled={disabled} />
          </View>
        </DemoSection>

        {/* ── Touchable ───────────────────────────────────────── */}
        <DemoSection title="Touchable" description="Spring-animated pressable wrapper">
          <Touchable onPress={() => {}}>
            <Card>
              <CardContent>
                <View style={styles.touchableContent}>
                  <IconSymbol name="hand.tap.fill" size={24} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.contextTitle, { color: colors.foreground }]}>
                      Press and hold
                    </Text>
                    <Text style={{ color: colors.foregroundSecondary, fontSize: 14 }}>
                      This card has a spring-animated scale effect
                    </Text>
                  </View>
                  <Badge variant="success">Interactive</Badge>
                </View>
              </CardContent>
            </Card>
          </Touchable>
        </DemoSection>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10, flexWrap: "wrap", alignItems: "center" },
  list: { gap: 10 },
  label: { fontSize: 13, fontWeight: "600", marginTop: 4 },
  price: { fontSize: 22, fontWeight: "700" },
  contextHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  contextActions: { flexDirection: "row", gap: 8 },
  contextRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  contextTitle: { fontSize: 16, fontWeight: "600" },
  touchableContent: { flexDirection: "row", gap: 12, alignItems: "center" },
});
