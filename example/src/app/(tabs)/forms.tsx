import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { Button } from "@popapp/components/button";
import { TextInput } from "@popapp/components/text-input";
import { TextArea } from "@popapp/components/text-area";
import { OTPInput } from "@popapp/components/otp-input";
import { DatePicker, type DatePickerValue } from "@popapp/components/date-picker";
import { SliderBar } from "@popapp/components/slider-bar";
import { RulerSlider } from "@popapp/components/ruler-slider";
import { InputStepper } from "@popapp/components/input-stepper";
import { ActionIcon } from "@popapp/components/action-icon";
import { ChoiceCard } from "@popapp/components/choice-card";
import { ChoiceBinary } from "@popapp/components/choice-binary";
import { OptionCard } from "@popapp/components/option-card";
import { OptionGroup } from "@popapp/components/option-group";
import { IconSymbol } from "@popapp/components/icon-symbol.ios";
import { DemoSection } from "@/components/demo-section";

export default function FormsScreen() {
  const { colors } = useTheme();
  const [otp, setOtp] = useState("");
  const [date, setDate] = useState<DatePickerValue | null>(null);
  const [slider, setSlider] = useState(0.5);
  const [ruler, setRuler] = useState(170);
  const [stepper, setStepper] = useState(3);

  // Selection state
  const [choiceSelected, setChoiceSelected] = useState<string | null>(null);
  const [binaryValue, setBinaryValue] = useState<string | null>(null);
  const [optionSelected, setOptionSelected] = useState<string[]>([]);
  const [singleOption, setSingleOption] = useState<string | null>(null);
  const [multiOptions, setMultiOptions] = useState<string[]>([]);

  return (
    <Screen>
      <ScreenContent>
        {/* ── Input Controls ───────────────────────────────────── */}
        <DemoSection title="Button" description="Variants and sizes">
          <View style={styles.row}>
            <Button title="Solid" variant="solid" size="md" onPress={() => {}} />
            <Button title="Subtle" variant="subtle" size="md" onPress={() => {}} />
            <Button title="Outline" variant="outline" size="md" onPress={() => {}} />
            <Button title="Destructive" variant="destructive" size="md" onPress={() => {}} />
            <Button title="Ghost" variant="ghost" size="md" onPress={() => {}} />
          </View>
          <View style={styles.row}>
            <Button title="XS" size="xs" onPress={() => {}} />
            <Button title="SM" size="sm" onPress={() => {}} />
            <Button title="MD" size="md" onPress={() => {}} />
            <Button title="LG" size="lg" onPress={() => {}} />
          </View>
          <View style={styles.list}>
            <Button title="Full Width Button" fullWidth onPress={() => {}} />
            <Button title="Not Glass Button" glass={false} onPress={() => {}} />
            <Button variant='subtle' title="Not Glass Subtle Button" glass={false} onPress={() => {}} />
            <Button title="Disabled" disabled onPress={() => {}} />
          </View>
        </DemoSection>

        <DemoSection title="TextInput" description="With label, error, and icons">
          <TextInput label="Email" placeholder="you@example.com" keyboardType="email-address" />
          <TextInput
            label="Password"
            placeholder="Enter password"
            secureTextEntry
            rightSection={<ActionIcon variant="ghost" name="eye.fill" onPress={() => {}} />}
          />
          <TextInput label="With Error" placeholder="Required" error="This field is required" />
          <TextInput label="Disabled" placeholder="Can't edit" disabled />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <TextInput label="Small" size="sm" placeholder="SM" />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput label="Medium" size="md" placeholder="MD" />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput label="Large" size="lg" placeholder="LG" />
            </View>
          </View>
        </DemoSection>

        <DemoSection title="TextArea" description="Multiline text input">
          <TextArea label="Comments" placeholder="Write your thoughts..." />
          <TextArea label="With Error" error="Too short" placeholder="Min 20 chars" />
        </DemoSection>

        <DemoSection title="OTP Input" description="One-time password entry">
          <OTPInput value={otp} onChange={setOtp} length={6} autoFocus={false} />
        </DemoSection>

        <DemoSection title="DatePicker" description="Month / Day / Year columns">
          <DatePicker value={date} onChange={setDate} style={styles.datePicker} />
        </DemoSection>

        <DemoSection title="SliderBar" description="Thumb variant with labels">
          <SliderBar
            value={slider}
            onValueChange={setSlider}
            min={0}
            max={1}
            step={0.1}
            labels={[
              { text: "0%", position: 0 },
              { text: "50%", position: 0.5 },
              { text: "100%", position: 1 },
            ]}
          />
          <Text
            style={{
              color: colors.foregroundSecondary,
              fontSize: 13,
              textAlign: "center",
            }}
          >
            Value: {(slider * 100).toFixed(0)}%
          </Text>
        </DemoSection>

        <DemoSection title="SliderBar (Track)" description="Track variant without thumb">
          <SliderBar
            value={slider}
            onValueChange={setSlider}
            min={0}
            max={1}
            step={0.1}
            variant="track"
            labels={[
              { text: "0%", position: 0 },
              { text: "50%", position: 0.5 },
              { text: "100%", position: 1 },
            ]}
          />
        </DemoSection>

        <DemoSection title="RulerSlider" description="iOS-style ruler with momentum">
          <RulerSlider
            value={ruler}
            onValueChange={setRuler}
            min={100}
            max={250}
            step={1}
            unit="cm"
          />
        </DemoSection>

        <DemoSection title="InputStepper" description="Numeric stepper with ticker">
          <View style={{ alignItems: "center" }}>
            <InputStepper
              value={stepper}
              onIncrement={() => setStepper((v) => v + 1)}
              onDecrement={() => setStepper((v) => Math.max(0, v - 1))}
              min={0}
              max={99}
              size="lg"
            />
          </View>
        </DemoSection>

        {/* ── Selection Controls ───────────────────────────────── */}
        <DemoSection title="ChoiceCard" description="Selectable cards with icons">
          <ChoiceCard
            title="Personal"
            subtitle="For individual use"
            icon={<IconSymbol name="person.fill" size={24} color={colors.foreground} />}
            selected={choiceSelected === "personal"}
            onPress={() => setChoiceSelected("personal")}
          />
          <ChoiceCard
            title="Business"
            subtitle="For teams and organizations"
            icon={<IconSymbol name="building.2.fill" size={24} color={colors.foreground} />}
            selected={choiceSelected === "business"}
            onPress={() => setChoiceSelected("business")}
          />
          <ChoiceCard
            title="Enterprise"
            subtitle="Custom solutions at scale"
            icon={<IconSymbol name="globe" size={24} color={colors.foreground} />}
            selected={choiceSelected === "enterprise"}
            onPress={() => setChoiceSelected("enterprise")}
          />
        </DemoSection>

        <DemoSection title="ChoiceBinary" description="Two-option side-by-side selector">
          <ChoiceBinary
            options={[
              {
                value: "yes",
                label: "Yes",
                icon: <IconSymbol name="checkmark" size={24} color={colors.foreground} />,
              },
              {
                value: "no",
                label: "No",
                icon: <IconSymbol name="xmark" size={24} color={colors.foreground} />,
              },
            ]}
            value={binaryValue}
            onChange={setBinaryValue}
          />
        </DemoSection>

        <DemoSection title="OptionCard" description="List option with checkbox">
          {["Notifications", "Dark Mode", "Auto-save"].map((label) => (
            <OptionCard
              key={label}
              label={label}
              description={`Enable ${label.toLowerCase()}`}
              selected={optionSelected.includes(label)}
              showCheckbox
              onPress={() =>
                setOptionSelected((prev) =>
                  prev.includes(label) ? prev.filter((v) => v !== label) : [...prev, label],
                )
              }
            />
          ))}
        </DemoSection>

        <DemoSection title="OptionGroup (Single)" description="Single-select radio group">
          <OptionGroup
            mode="single"
            options={[
              { value: "sm", label: "Small", description: "640 x 480" },
              { value: "md", label: "Medium", description: "1280 x 720" },
              { value: "lg", label: "Large", description: "1920 x 1080" },
            ]}
            value={singleOption}
            onChange={setSingleOption}
          />
        </DemoSection>

        <DemoSection title="OptionGroup (Multi)" description="Multi-select checkbox group">
          <OptionGroup
            mode="multi"
            options={[
              { value: "wifi", label: "Wi-Fi" },
              { value: "bluetooth", label: "Bluetooth" },
              { value: "airdrop", label: "AirDrop" },
              { value: "hotspot", label: "Personal Hotspot" },
            ]}
            value={multiOptions}
            onChange={setMultiOptions}
          />
        </DemoSection>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  list: {
    flexDirection: "column",
    gap: 10,
  },
  datePicker: {
    marginTop: 16,
  },
});
