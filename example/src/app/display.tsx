import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
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
import { Separator } from "@popapp/components/separator";
import { Skeleton } from "@popapp/components/skeleton";
import { IconSymbol } from "@popapp/components/icon-symbol";
import { ThemeIcon } from "@popapp/components/theme-icon";
import { ActionIcon } from "@popapp/components/action-icon";
import { DemoSection } from "@/components/demo-section";

export default function DisplayScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Screen>
      <ScreenHeader
        title="Cards & Badges"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
      />
      <ScreenContent>
        {/* ── Real-world: Task Card with Status ───────────────── */}
        <DemoSection title="In Context" description="Cards and badges in real UIs">
          {/* Task card */}
          <Card>
            <CardHeader>
              <View style={styles.taskHeader}>
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={styles.taskTitleRow}>
                    <CardTitle>Redesign onboarding flow</CardTitle>
                  </View>
                  <CardDescription>Update screens to match new brand guidelines</CardDescription>
                </View>
                <Badge variant="success">Done</Badge>
              </View>
            </CardHeader>
            <CardContent>
              <View style={styles.taskMeta}>
                <View style={styles.taskMetaItem}>
                  <IconSymbol name="person.fill" size={14} color={colors.foregroundSecondary} />
                  <Text style={[styles.metaText, { color: colors.foregroundSecondary }]}>
                    Sarah Chen
                  </Text>
                </View>
                <View style={styles.taskMetaItem}>
                  <IconSymbol name="calendar" size={14} color={colors.foregroundSecondary} />
                  <Text style={[styles.metaText, { color: colors.foregroundSecondary }]}>
                    Due Mar 15
                  </Text>
                </View>
              </View>
            </CardContent>
            <CardFooter>
              <View style={styles.taskActions}>
                <Button title="View Details" variant="subtle" size="sm" onPress={() => {}} />
                <ActionIcon name="ellipsis" variant="ghost" onPress={() => {}} />
              </View>
            </CardFooter>
          </Card>

          {/* Order status with badge progression */}
          <Card>
            <CardContent>
              <View style={styles.orderRow}>
                <ThemeIcon name="shippingbox.fill" color="#FF9500" />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[styles.orderTitle, { color: colors.foreground }]}>
                    Order #29847
                  </Text>
                  <Text style={{ color: colors.foregroundSecondary, fontSize: 13 }}>
                    MacBook Pro 14" M4
                  </Text>
                </View>
                <Badge>Processing</Badge>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <View style={styles.orderRow}>
                <ThemeIcon name="truck.box.fill" color="#34C759" />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[styles.orderTitle, { color: colors.foreground }]}>
                    Order #29201
                  </Text>
                  <Text style={{ color: colors.foregroundSecondary, fontSize: 13 }}>
                    Magic Keyboard
                  </Text>
                </View>
                <Badge variant="success">Delivered</Badge>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <View style={styles.orderRow}>
                <ThemeIcon name="xmark.circle.fill" color="#FF3B30" />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[styles.orderTitle, { color: colors.foreground }]}>
                    Order #28990
                  </Text>
                  <Text style={{ color: colors.foregroundSecondary, fontSize: 13 }}>
                    AirPods Max
                  </Text>
                </View>
                <Badge variant="destructive">Cancelled</Badge>
              </View>
            </CardContent>
          </Card>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── Badge Variants ──────────────────────────────────── */}
        <DemoSection title="Badge" description="All variants">
          <View style={styles.row}>
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="outline">Outline</Badge>
          </View>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── Card Compositions ───────────────────────────────── */}
        <DemoSection title="Card" description="Composable card layouts">
          <Card>
            <CardHeader>
              <CardTitle>Basic Card</CardTitle>
              <CardDescription>A simple card with header, content, and footer sections</CardDescription>
            </CardHeader>
            <CardContent>
              <Text style={{ color: colors.foreground, fontSize: 15 }}>
                Cards are containers that group related content and actions.
              </Text>
            </CardContent>
            <CardFooter>
              <Button title="Primary Action" size="sm" onPress={() => {}} />
              <Button title="Secondary" variant="ghost" size="sm" onPress={() => {}} />
            </CardFooter>
          </Card>

          <Card>
            <CardContent>
              <Text style={{ color: colors.foreground, fontWeight: "600", fontSize: 15 }}>
                Content-only card
              </Text>
              <Text style={{ color: colors.foregroundSecondary, fontSize: 14, marginTop: 4 }}>
                Cards can also be used without explicit header or footer sections.
              </Text>
            </CardContent>
          </Card>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── Separator ───────────────────────────────────────── */}
        <DemoSection title="Separator" description="Visual divider between content">
          <View style={{ gap: 12 }}>
            <Text style={{ color: colors.foreground, fontSize: 15 }}>Section above</Text>
            <Separator style={{ marginBottom: 24 }} />
            <Text style={{ color: colors.foreground, fontSize: 15 }}>Section below</Text>
          </View>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── Skeleton ────────────────────────────────────────── */}
        <DemoSection title="Skeleton" description="Loading placeholder animations">
          <Button
            title={isLoading ? "Show Content" : "Show Loading"}
            variant="outline"
            size="sm"
            onPress={() => setIsLoading(!isLoading)}
          />

          <Card>
            <CardContent>
              {isLoading ? (
                <View style={styles.skeletonProfile}>
                  <Skeleton width={56} height={56} borderRadius={28} />
                  <View style={{ flex: 1, gap: 8 }}>
                    <Skeleton width="60%" height={18} borderRadius={4} />
                    <Skeleton width="40%" height={14} borderRadius={4} />
                  </View>
                </View>
              ) : (
                <View style={styles.skeletonProfile}>
                  <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                    <IconSymbol name="person.fill" size={24} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "600" }}>
                      Jane Cooper
                    </Text>
                    <Text style={{ color: colors.foregroundSecondary, fontSize: 14 }}>
                      Product Designer
                    </Text>
                  </View>
                </View>
              )}
            </CardContent>
          </Card>

          {isLoading && (
            <View style={{ gap: 10 }}>
              <Skeleton width="100%" height={20} borderRadius={4} />
              <Skeleton width="85%" height={20} borderRadius={4} />
              <Skeleton width="70%" height={20} borderRadius={4} />
            </View>
          )}
        </DemoSection>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  taskHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  taskTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  taskMeta: { flexDirection: "row", gap: 16 },
  taskMetaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 13 },
  taskActions: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  orderRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  orderTitle: { fontSize: 15, fontWeight: "600" },
  skeletonProfile: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
});
