import React from "react";
import { useRouter } from "expo-router";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { ActionIcon } from "@popapp/components/action-icon";
import { ListSection, ListNavigationCell } from "@popapp/components/list";
import { DemoSection } from "@/components/demo-section";

export default function ScreenExamplesIndex() {
  const router = useRouter();

  return (
    <Screen>
      <ScreenHeader
        title="Screen Layouts"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
      />
      <ScreenContent>
        <DemoSection
          title="Screen Component"
          description="Composable layout with header, scrollable content, and sticky footer. Tap each example to see the pattern in action."
        >
          <ListSection title="Patterns">
            <ListNavigationCell
              icon="hand.tap.fill"
              label="Sticky Button"
              value="Scrollable form with sticky CTA"
              onPress={() => router.push("/screen-examples/sticky-button")}
            />
            <ListNavigationCell
              icon="keyboard.fill"
              label="Keyboard Form"
              value="Input handling with sticky footer"
              onPress={() => router.push("/screen-examples/keyboard-form")}
            />
            <ListNavigationCell
              icon="magnifyingglass"
              label="Custom Header"
              value="Search bar & action icons"
              onPress={() => router.push("/screen-examples/custom-header")}
            />
            <ListNavigationCell
              icon="rectangle.center.inset.filled"
              label="Centered Content"
              value="Non-scrollable, vertically centered"
              onPress={() => router.push("/screen-examples/centered-content")}
            />
            <ListNavigationCell
              icon="dock.rectangle"
              label="Custom Footer"
              value="Multi-button footer layout"
              onPress={() => router.push("/screen-examples/custom-footer")}
            />
            <ListNavigationCell
              icon="rectangle.topthird.inset.filled"
              label="Subheader (blur)"
              value="Search bar below header"
              onPress={() => router.push("/screen-examples/subheader")}
            />
            <ListNavigationCell
              icon="rectangle.bottomthird.inset.filled"
              label="Subfooter (solid)"
              value="Action button above footer"
              onPress={() => router.push("/screen-examples/subfooter")}
            />
            <ListNavigationCell
              icon="scroll.fill"
              label="Scrollable Content"
              value="Long list with cards"
              onPress={() => router.push("/screen-examples/scrollable-content")}
              last
            />
          </ListSection>
        </DemoSection>
      </ScreenContent>
    </Screen>
  );
}
