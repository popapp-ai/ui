import { Picker } from "@react-native-picker/picker";
import { useCallback, useMemo } from "react";
import { Platform, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { useTheme } from "@popapp/theme/use-theme";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

export type DatePickerValue = {
  month: number;
  day: number;
  year: number;
};

interface DatePickerProps {
  value: DatePickerValue | null;
  onChange: (value: DatePickerValue) => void;
  /** Minimum year offset from current year (positive = years back). Default: 100 */
  minYearOffset?: number;
  /** Maximum year offset from current year (positive = years back). Default: 13 */
  maxYearOffset?: number;
  style?: StyleProp<ViewStyle>;
}

export function DatePicker({
  value,
  onChange,
  minYearOffset = 100,
  maxYearOffset = 13,
  style,
}: DatePickerProps) {
  const { colors } = useTheme();
  const currentYear = new Date().getFullYear();
  const defaultMonth = value?.month ?? 1;
  const defaultDay = value?.day ?? 1;
  const defaultYear = value?.year ?? currentYear - 25;

  const yearItems = useMemo(() => {
    const items = [];
    for (let y = currentYear - maxYearOffset; y >= currentYear - minYearOffset; y--) {
      items.push({ value: y, label: `${y}` });
    }
    return items;
  }, [currentYear, minYearOffset, maxYearOffset]);

  const dayItems = useMemo(() => {
    const month = value?.month ?? defaultMonth;
    const year = value?.year ?? defaultYear;
    const days = getDaysInMonth(month, year);
    const items = [];
    for (let d = 1; d <= days; d++) {
      items.push({ value: d, label: `${d}` });
    }
    return items;
  }, [value?.month, value?.year, defaultMonth, defaultYear]);

  const handleMonthChange = useCallback(
    (month: number) => {
      const current = value ?? { month: defaultMonth, day: defaultDay, year: defaultYear };
      const maxDay = getDaysInMonth(month, current.year);
      onChange({
        ...current,
        month,
        day: Math.min(current.day, maxDay),
      });
    },
    [value, onChange, defaultMonth, defaultDay, defaultYear],
  );

  const handleDayChange = useCallback(
    (day: number) => {
      const current = value ?? { month: defaultMonth, day: defaultDay, year: defaultYear };
      onChange({ ...current, day });
    },
    [value, onChange, defaultMonth, defaultDay, defaultYear],
  );

  const handleYearChange = useCallback(
    (year: number) => {
      const current = value ?? { month: defaultMonth, day: defaultDay, year: defaultYear };
      const maxDay = getDaysInMonth(current.month, year);
      onChange({
        ...current,
        year,
        day: Math.min(current.day, maxDay),
      });
    },
    [value, onChange, defaultMonth, defaultDay, defaultYear],
  );

  return (
    <View style={[styles.pickersRow, style]}>
      <View style={styles.pickerColumn}>
        <Text style={[styles.pickerLabel, { color: colors.icon }]}>Month</Text>
        <Picker
          selectedValue={value?.month ?? defaultMonth}
          onValueChange={handleMonthChange}
          style={styles.picker}
          itemStyle={[styles.pickerItem, { color: colors.foreground }]}
        >
          {MONTHS.map((m, i) => (
            <Picker.Item key={i} label={m} value={i + 1} />
          ))}
        </Picker>
      </View>

      <View style={[styles.pickerColumnSmall, { minWidth: 20 }]}>
        <Text style={[styles.pickerLabel, { color: colors.icon }]}>Day</Text>
        <Picker
          selectedValue={value?.day ?? defaultDay}
          onValueChange={handleDayChange}
          style={styles.picker}
          itemStyle={[styles.pickerItem, { color: colors.foreground }]}
        >
          {dayItems.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>

      <View style={[styles.pickerColumnSmall, { minWidth: 30 }]}>
        <Text style={[styles.pickerLabel, { color: colors.icon }]}>Year</Text>
        <Picker
          selectedValue={value?.year ?? defaultYear}
          onValueChange={handleYearChange}
          style={styles.picker}
          itemStyle={[styles.pickerItem, { color: colors.foreground }]}
        >
          {yearItems.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pickersRow: {
    flexDirection: "row",
    gap: 8,
  },
  pickerColumn: {
    flex: 2,
    alignItems: "center",
  },
  pickerColumnSmall: {
    flex: 1,
    alignItems: "center",
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  picker: {
    width: "100%",
    height: Platform.OS === "ios" ? 200 : 50,
  },
  pickerItem: {
    fontSize: 18,
  },
});
