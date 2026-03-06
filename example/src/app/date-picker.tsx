import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { DatePicker, type DatePickerValue } from "@popapp/components/date-picker";
import { ActionIcon } from "@popapp/components/action-icon";
import { Button } from "@popapp/components/button";
import { BottomSheet } from "@popapp/components/bottom-sheet";
import { Separator } from "@popapp/components/separator";
import { ListSection, ListNavigationCell } from "@popapp/components/list";
import { DemoSection } from "@/components/demo-section";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(date: DatePickerValue | null): string {
  if (!date) return "Not selected";
  return `${MONTHS[date.month - 1]} ${date.day}, ${date.year}`;
}

export default function DatePickerScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [simpleDate, setSimpleDate] = useState<DatePickerValue | null>(null);
  const [birthday, setBirthday] = useState<DatePickerValue | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Screen>
      <ScreenHeader
        title="Date Picker"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
      />
      <ScreenContent>
        {/* ── In Context: Birthday via Bottom Sheet ───────────── */}
        <DemoSection title="In Context" description="Tap to select your birthday">
          <ListSection>
            <ListNavigationCell
              icon="gift.fill"
              label="Birthday"
              value={formatDate(birthday)}
              onPress={() => setSheetOpen(true)}
              last
            />
          </ListSection>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── Simple DatePicker ───────────────────────────────── */}
        <DemoSection title="DatePicker" description="Month / Day / Year columns">
          <DatePicker value={simpleDate} onChange={setSimpleDate} />
          {simpleDate && (
            <Text style={[styles.resultText, { color: colors.foregroundSecondary }]}>
              Selected: {formatDate(simpleDate)}
            </Text>
          )}
        </DemoSection>
      </ScreenContent>

      {/* ── Birthday Bottom Sheet ─────────────────────────────── */}
      <BottomSheet visible={sheetOpen} onDismiss={() => setSheetOpen(false)}>
        <View style={styles.sheetContent}>
          <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
            When is your birthday?
          </Text>
          <DatePicker
            value={birthday}
            onChange={setBirthday}
            minYearOffset={-100}
            maxYearOffset={0}
          />
          <Button
            title="Done"
            fullWidth
            onPress={() => setSheetOpen(false)}
            disabled={!birthday}
          />
        </View>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  resultText: { fontSize: 14, textAlign: "center" },
  sheetContent: { paddingHorizontal: 20, gap: 16 },
  sheetTitle: { fontSize: 22, fontWeight: "700", textAlign: "center" },
});
