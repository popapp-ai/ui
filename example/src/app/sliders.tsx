import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { SliderBar } from "@popapp/components/slider-bar";
import { RulerSlider } from "@popapp/components/ruler-slider";
import { InputStepper } from "@popapp/components/input-stepper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@popapp/components/card";
import { IconSymbol } from "@popapp/components/icon-symbol";
import { ActionIcon } from "@popapp/components/action-icon";
import { Badge } from "@popapp/components/badge";
import { Separator } from "@popapp/components/separator";
import { DemoSection } from "@/components/demo-section";

export default function SlidersScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // Context state
  const [brightness, setBrightness] = useState(0.7);
  const [volume, setVolume] = useState(0.5);

  // SliderBar demos (all separate)
  const [confidence, setConfidence] = useState(0.8);
  const [trackValue, setTrackValue] = useState(0.4);

  // RulerSlider demos (all separate)
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(68.5);
  const [temperature, setTemperature] = useState(72);

  // InputStepper demos (all separate)
  const [guests, setGuests] = useState(2);
  const [stepperSm, setStepperSm] = useState(3);
  const [stepperMd, setStepperMd] = useState(5);
  const [stepperLg, setStepperLg] = useState(1);
  const [servings, setServings] = useState(4);

  return (
    <Screen>
      <ScreenHeader
        title="Sliders & Steppers"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
      />
      <ScreenContent>
        {/* ── Real-world: Smart Home Control ──────────────────── */}
        <DemoSection title="In Context" description="Smart home room control">
          <Card>
            <CardHeader>
              <View style={styles.contextHeader}>
                <IconSymbol name="lamp.desk.fill" size={24} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <CardTitle>Living Room</CardTitle>
                  <CardDescription>2 lights, 1 speaker</CardDescription>
                </View>
                <Badge variant="success">On</Badge>
              </View>
            </CardHeader>
            <CardContent>
              <View style={styles.controlGroup}>
                <View style={styles.controlRow}>
                  <IconSymbol name="sun.max.fill" size={18} color={colors.foregroundSecondary} />
                  <Text style={[styles.controlLabel, { color: colors.foreground }]}>Brightness</Text>
                  <Text style={[styles.controlValue, { color: colors.foregroundSecondary }]}>
                    {Math.round(brightness * 100)}%
                  </Text>
                </View>
                <SliderBar
                  value={brightness}
                  onValueChange={setBrightness}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </View>
              <View style={styles.controlGroup}>
                <View style={styles.controlRow}>
                  <IconSymbol name="speaker.wave.2.fill" size={18} color={colors.foregroundSecondary} />
                  <Text style={[styles.controlLabel, { color: colors.foreground }]}>Volume</Text>
                  <Text style={[styles.controlValue, { color: colors.foregroundSecondary }]}>
                    {Math.round(volume * 100)}%
                  </Text>
                </View>
                <SliderBar
                  value={volume}
                  onValueChange={setVolume}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </View>
            </CardContent>
          </Card>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── SliderBar variants ──────────────────────────────── */}
        <DemoSection title="SliderBar" description="Gesture-driven slider with labels">
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>With Labels</Text>
          <SliderBar
            value={confidence}
            onValueChange={setConfidence}
            min={0}
            max={1}
            step={0.1}
            labels={[
              { text: "Low", position: 0 },
              { text: "Med", position: 0.5 },
              { text: "High", position: 1 },
            ]}
          />
          <Text style={[styles.valueText, { color: colors.foregroundSecondary }]}>
            Confidence: {(confidence * 100).toFixed(0)}%
          </Text>

          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Thick Track Variant</Text>
          <SliderBar
            value={trackValue}
            onValueChange={setTrackValue}
            min={0}
            max={1}
            step={0.01}
            variant="track"
          />
          <Text style={[styles.valueText, { color: colors.foregroundSecondary }]}>
            Value: {(trackValue * 100).toFixed(0)}%
          </Text>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── RulerSlider ─────────────────────────────────────── */}
        <DemoSection title="RulerSlider" description="iOS-style ruler with momentum scrolling">
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Height</Text>
          <RulerSlider
            value={height}
            onValueChange={setHeight}
            min={100}
            max={220}
            step={1}
            majorStep={10}
            midStep={5}
            unit="cm"
          />

          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Weight</Text>
          <RulerSlider
            value={weight}
            onValueChange={setWeight}
            min={30}
            max={200}
            step={0.5}
            majorStep={10}
            midStep={5}
            unit="kg"
            decimals={1}
          />

          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Temperature</Text>
          <RulerSlider
            value={temperature}
            onValueChange={setTemperature}
            min={60}
            max={85}
            step={1}
            majorStep={5}
            unit="°F"
          />
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── InputStepper ────────────────────────────────────── */}
        <DemoSection title="InputStepper" description="Numeric increment/decrement with animated display">
          <Card>
            <CardContent>
              <View style={styles.stepperRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.stepperLabel, { color: colors.foreground }]}>Guests</Text>
                  <Text style={{ color: colors.foregroundSecondary, fontSize: 13 }}>
                    Including children
                  </Text>
                </View>
                <InputStepper
                  value={guests}
                  onIncrement={() => setGuests((v) => v + 1)}
                  onDecrement={() => setGuests((v) => Math.max(1, v - 1))}
                  min={1}
                  max={20}
                  size="md"
                />
              </View>
            </CardContent>
          </Card>

          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Sizes</Text>
          <View style={styles.stepperSizes}>
            {(["sm", "md", "lg"] as const).map((size) => {
              const val = size === "sm" ? stepperSm : size === "md" ? stepperMd : stepperLg;
              const setter = size === "sm" ? setStepperSm : size === "md" ? setStepperMd : setStepperLg;
              return (
                <View key={size} style={styles.stepperSizeItem}>
                  <Text style={[styles.sizeLabel, { color: colors.foregroundSecondary }]}>
                    {size.toUpperCase()}
                  </Text>
                  <InputStepper
                    value={val}
                    onIncrement={() => setter((v) => v + 1)}
                    onDecrement={() => setter((v) => Math.max(0, v - 1))}
                    min={0}
                    max={99}
                    size={size}
                  />
                </View>
              );
            })}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>With Unit</Text>
          <View style={{ alignItems: "center" }}>
            <InputStepper
              value={servings}
              onIncrement={() => setServings((v) => v + 1)}
              onDecrement={() => setServings((v) => Math.max(1, v - 1))}
              min={1}
              max={12}
              size="lg"
              unit="servings"
            />
          </View>
        </DemoSection>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contextHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  controlGroup: { gap: 8, marginBottom: 16 },
  controlRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  controlLabel: { flex: 1, fontSize: 15, fontWeight: "500" },
  controlValue: { fontSize: 14, fontWeight: "600" },
  sectionLabel: { fontSize: 16, fontWeight: "600", marginTop: 4 },
  valueText: { fontSize: 13, textAlign: "center" },
  stepperRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  stepperLabel: { fontSize: 16, fontWeight: "600" },
  stepperSizes: { gap: 20, alignItems: "center" },
  stepperSizeItem: { alignItems: "center", gap: 8 },
  sizeLabel: { fontSize: 12, fontWeight: "600" },
});
