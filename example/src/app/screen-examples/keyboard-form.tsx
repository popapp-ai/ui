import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Screen, ScreenHeader, ScreenContent, ScreenFooter } from "@popapp/components/screen";
import { ActionIcon } from "@popapp/components/action-icon";
import { TextInput } from "@popapp/components/text-input";
import { TextArea } from "@popapp/components/text-area";
import { Button } from "@popapp/components/button";

export default function KeyboardFormExample() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");

  const isValid = firstName.length > 0 && email.length > 0;

  return (
    <Screen>
      <ScreenHeader
        title="Contact Info"
        leftSection={
          <ActionIcon name="chevron.left" size="sm" onPress={() => router.back()} />
        }
      />
      <ScreenContent>
        <View style={styles.row}>
          <View style={styles.half}>
            <TextInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="John"
            />
          </View>
          <View style={styles.half}>
            <TextInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Doe"
            />
          </View>
        </View>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="john@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          placeholder="+1 (555) 000-0000"
          keyboardType="phone-pad"
        />

        <TextInput
          label="Street Address"
          value={address}
          onChangeText={setAddress}
          placeholder="123 Main St"
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <TextInput
              label="City"
              value={city}
              onChangeText={setCity}
              placeholder="New York"
            />
          </View>
          <View style={styles.half}>
            <TextInput
              label="ZIP Code"
              value={zip}
              onChangeText={setZip}
              placeholder="10001"
              keyboardType="number-pad"
            />
          </View>
        </View>

        <TextArea
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Any additional information..."
        />
      </ScreenContent>

      <ScreenFooter>
        <Button
          title="Submit"
          onPress={() => router.back()}
          disabled={!isValid}
          fullWidth
        />
      </ScreenFooter>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
});
