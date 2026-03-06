import React from "react";
import { useRouter } from "expo-router";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { ListSection, ListNavigationCell } from "@popapp/components/list";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      <ScreenHeader title="Components" />
      <ScreenContent>
        <ListSection title="Inputs & Controls">
          <ListNavigationCell
            icon="hand.tap.fill"
            label="Buttons"
            value="5 variants"
            onPress={() => router.push("/buttons")}
          />
          <ListNavigationCell
            icon="character.cursor.ibeam"
            label="Text Inputs"
            value="Input, Area, OTP"
            onPress={() => router.push("/inputs")}
          />
          <ListNavigationCell
            icon="checkmark.circle.fill"
            label="Selection & Choice"
            value="Cards, Binary, Groups"
            onPress={() => router.push("/selection")}
          />
          <ListNavigationCell
            icon="slider.horizontal.3"
            label="Sliders & Steppers"
            value="Bar, Ruler, Stepper"
            onPress={() => router.push("/sliders")}
          />
          <ListNavigationCell
            icon="calendar"
            label="Date Picker"
            value="Month / Day / Year"
            onPress={() => router.push("/date-picker")}
            last
          />
        </ListSection>

        <ListSection title="Display">
          <ListNavigationCell
            icon="rectangle.on.rectangle"
            label="Cards & Badges"
            value="Card, Badge, Skeleton"
            onPress={() => router.push("/display")}
          />
          <ListNavigationCell
            icon="star.fill"
            label="Icons & Symbols"
            value="SF Symbols, ThemeIcon"
            onPress={() => router.push("/icons")}
          />
          <ListNavigationCell
            icon="chart.pie.fill"
            label="Progress & Ticker"
            value="Ring, Animated numbers"
            onPress={() => router.push("/progress")}
          />
          <ListNavigationCell
            icon="doc.richtext"
            label="Markdown"
            value="Themed renderer"
            onPress={() => router.push("/content")}
            last
          />
        </ListSection>

        <ListSection title="Layout">
          <ListNavigationCell
            icon="list.bullet"
            label="Lists"
            value="Settings-style cells"
            onPress={() => router.push("/lists")}
          />
          <ListNavigationCell
            icon="rectangle.bottomhalf.inset.filled"
            label="Bottom Sheet"
            value="Pan-to-dismiss modal"
            onPress={() => router.push("/overlays")}
          />
          <ListNavigationCell
            icon="rectangle.split.3x1"
            label="Screen Layouts"
            value="Header, Content, Footer"
            onPress={() => router.push("/screen-examples")}
          />
          <ListNavigationCell
            icon="arrow.right.circle.fill"
            label="Onboarding"
            value="Step-based flow"
            onPress={() => router.push("/onboarding/welcome")}
            last
          />
        </ListSection>
      </ScreenContent>
    </Screen>
  );
}
