import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenSubheader, ScreenContent } from "@popapp/components/screen";
import { ActionIcon } from "@popapp/components/action-icon";
import { TextInput } from "@popapp/components/text-input";
import { IconSymbol } from "@popapp/components/icon-symbol.ios";
import { Card, CardContent } from "@popapp/components/card";

const CONTACTS = [
  { name: "Alice Martin", role: "Designer", icon: "person.fill" as const },
  { name: "Bob Chen", role: "Engineer", icon: "person.fill" as const },
  { name: "Carol Davis", role: "Product Manager", icon: "person.fill" as const },
  { name: "Dan Wilson", role: "Engineer", icon: "person.fill" as const },
  { name: "Eva Brown", role: "Designer", icon: "person.fill" as const },
  { name: "Frank Lee", role: "Marketing", icon: "person.fill" as const },
  { name: "Grace Kim", role: "Engineer", icon: "person.fill" as const },
  { name: "Henry Park", role: "Sales", icon: "person.fill" as const },
];

export default function SubheaderExample() {
  const { colors } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = CONTACTS.filter(
    (c) =>
      search.length === 0 ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Screen variant="blur" backgroundColor={colors.background}>
      <ScreenHeader
        title="Team"
        leftSection={<ActionIcon style={{marginLeft: -8}} name="chevron.left" variant='ghost' onPress={() => router.back()} />}
        rightSection={<ActionIcon style={{marginRight: -8}} name="plus" variant='ghost' onPress={() => {}} />}
      />
      <ScreenSubheader style={{ paddingVertical: 8 }}>
        <TextInput
          inputStyle={{ backgroundColor: colors.backgroundTertiary }}
          placeholder="Search people..."
          value={search}
          onChangeText={setSearch}
          size='sm'
          leftSection={
            <IconSymbol name="magnifyingglass" size={16} color={colors.foregroundSecondary} />
          }
        />
      </ScreenSubheader>
      <ScreenContent style={{backgroundColor: colors.backgroundSecondary}}>
        {filtered.length > 0 ? (
          <View style={styles.list}>
            {filtered.map((contact) => (
              <Card key={contact.name}>
                <CardContent>
                  <View style={styles.contactRow}>
                    <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                      <IconSymbol name={contact.icon} size={20} color={colors.primary} />
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={[styles.contactName, { color: colors.foreground }]}>
                        {contact.name}
                      </Text>
                      <Text style={[styles.contactRole, { color: colors.foregroundSecondary }]}>
                        {contact.role}
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <IconSymbol name="magnifyingglass" size={32} color={colors.foregroundSecondary} />
            <Text style={[styles.emptyText, { color: colors.foregroundSecondary }]}>
              No results for "{search}"
            </Text>
          </View>
        )}
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  contactInfo: {
    flex: 1,
    gap: 2,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
  },
  contactRole: {
    fontSize: 14,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
  },
});
