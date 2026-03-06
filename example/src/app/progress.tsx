import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { ActionIcon } from "@popapp/components/action-icon";
import { Button } from "@popapp/components/button";
import { ProgressRing } from "@popapp/components/progress-ring";
import { Ticker } from "@popapp/components/ticker";
import { Card, CardContent, CardHeader, CardTitle } from "@popapp/components/card";
import { IconSymbol } from "@popapp/components/icon-symbol";
import { Separator } from "@popapp/components/separator";
import { DemoSection } from "@/components/demo-section";

export default function ProgressScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [progress, setProgress] = useState(72);
  const [tickerValue, setTickerValue] = useState(1234);

  return (
    <Screen>
      <ScreenHeader
        title="Progress & Ticker"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
      />
      <ScreenContent>
        {/* ── Real-world: Fitness Dashboard ───────────────────── */}
        <DemoSection title="In Context" description="Fitness tracking dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Today's Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <View style={styles.dashboardRow}>
                <View style={styles.dashboardItem}>
                  <ProgressRing
                    value={8432}
                    maxValue={10000}
                    size={90}
                    strokeWidth={8}
                    centerLabel={
                      <View style={styles.ringCenter}>
                        <IconSymbol name="flame.fill" size={16} color={colors.destructive} />
                        <Ticker value={8432} fontSize={14} decimals={0} />
                      </View>
                    }
                  />
                  <Text style={[styles.dashLabel, { color: colors.foregroundSecondary }]}>Steps</Text>
                </View>

                <View style={styles.dashboardItem}>
                  <ProgressRing
                    value={45}
                    maxValue={60}
                    size={90}
                    strokeWidth={8}
                    centerLabel={
                      <View style={styles.ringCenter}>
                        <IconSymbol name="heart.fill" size={16} color="#FF2D55" />
                        <Ticker value={45} fontSize={14} decimals={0} />
                      </View>
                    }
                  />
                  <Text style={[styles.dashLabel, { color: colors.foregroundSecondary }]}>Minutes</Text>
                </View>

                <View style={styles.dashboardItem}>
                  <ProgressRing
                    value={420}
                    maxValue={500}
                    size={90}
                    strokeWidth={8}
                    centerLabel={
                      <View style={styles.ringCenter}>
                        <IconSymbol name="bolt.fill" size={16} color="#FF9500" />
                        <Ticker value={420} fontSize={14} decimals={0} />
                      </View>
                    }
                  />
                  <Text style={[styles.dashLabel, { color: colors.foregroundSecondary }]}>Calories</Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Storage usage */}
          <Card>
            <CardContent>
              <View style={styles.storageRow}>
                <ProgressRing
                  value={73.2}
                  maxValue={128}
                  size={64}
                  strokeWidth={7}
                  centerLabel={<Text style={[styles.storagePercent, { color: colors.foreground }]}>57%</Text>}
                />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={[styles.storageTitle, { color: colors.foreground }]}>
                    Storage
                  </Text>
                  <Text style={{ color: colors.foregroundSecondary, fontSize: 13 }}>
                    73.2 GB of 128 GB used
                  </Text>
                </View>
                <Button title="Manage" variant="outline" size="sm" onPress={() => {}} />
              </View>
            </CardContent>
          </Card>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── ProgressRing Interactive ─────────────────────────── */}
        <DemoSection title="ProgressRing" description="Animated circular progress indicator">
          <View style={styles.centered}>
            <ProgressRing
              value={progress}
              maxValue={100}
              size={140}
              strokeWidth={12}
              centerLabel={
                <Ticker value={progress} fontSize={28} decimals={0} unit="%" />
              }
            />
          </View>
          <View style={styles.buttonRow}>
            <Button title="0%" variant="outline" size="sm" onPress={() => setProgress(0)} />
            <Button title="25%" variant="outline" size="sm" onPress={() => setProgress(25)} />
            <Button title="50%" variant="outline" size="sm" onPress={() => setProgress(50)} />
            <Button title="75%" variant="outline" size="sm" onPress={() => setProgress(75)} />
            <Button title="100%" variant="outline" size="sm" onPress={() => setProgress(100)} />
          </View>

          <Text style={[styles.subLabel, { color: colors.foregroundSecondary }]}>Sizes</Text>
          <View style={styles.sizesRow}>
            {[48, 72, 100].map((size) => (
              <ProgressRing
                key={size}
                value={65}
                maxValue={100}
                size={size}
                strokeWidth={size * 0.08}
              />
            ))}
          </View>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── Ticker ──────────────────────────────────────────── */}
        <DemoSection title="Ticker" description="Animated number transitions">
          <View style={styles.centered}>
            <Ticker value={tickerValue} decimals={0} fontSize={56} />
          </View>
          <View style={styles.buttonRow}>
            <Button title="Random" variant="outline" size="sm" onPress={() => setTickerValue(Math.floor(Math.random() * 10000))} />
            <Button title="+100" variant="outline" size="sm" onPress={() => setTickerValue((v) => v + 100)} />
            <Button title="-50" variant="outline" size="sm" onPress={() => setTickerValue((v) => Math.max(0, v - 50))} />
          </View>

          <Text style={[styles.subLabel, { color: colors.foregroundSecondary }]}>With Unit & Decimals</Text>
          <View style={styles.tickerRow}>
            <View style={styles.tickerItem}>
              <Ticker value={42.5} decimals={1} fontSize={32} unit="°C" />
              <Text style={[styles.tickerLabel, { color: colors.foregroundSecondary }]}>Temperature</Text>
            </View>
            <View style={styles.tickerItem}>
              <Ticker value={1299.99} decimals={2} fontSize={32} unit="$" />
              <Text style={[styles.tickerLabel, { color: colors.foregroundSecondary }]}>Price</Text>
            </View>
          </View>
        </DemoSection>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: { alignItems: "center" },
  buttonRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  subLabel: { fontSize: 13, fontWeight: "600", marginTop: 4 },
  dashboardRow: { flexDirection: "row", justifyContent: "space-around" },
  dashboardItem: { alignItems: "center", gap: 8 },
  dashLabel: { fontSize: 13, fontWeight: "500" },
  ringCenter: { alignItems: "center", gap: 2 },
  storageRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  storageTitle: { fontSize: 16, fontWeight: "600" },
  storagePercent: { fontSize: 14, fontWeight: "700" },
  sizesRow: { flexDirection: "row", alignItems: "center", gap: 20, justifyContent: "center" },
  tickerRow: { flexDirection: "row", justifyContent: "space-around" },
  tickerItem: { alignItems: "center", gap: 4 },
  tickerLabel: { fontSize: 13 },
});
