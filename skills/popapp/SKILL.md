---
name: popapp
description: Manages PopApp UI components in React Native/Expo projects — adding, composing, theming, and building screens. Provides component docs, usage patterns, and CLI commands. Use when working with PopApp UI, popapp.json, @popapp/* imports, the popapp CLI, or any Expo project that has a components/ui/ directory with PopApp components. Also triggers for "popapp add", "add a button/card/screen", or building React Native UI with a component registry.
user-invocable: false
allowed-tools: Bash(npx popapp *)
---

# PopApp UI

A React Native component registry for Expo apps. Components are added as source code to the user's project via the CLI — like shadcn/ui, but for React Native with pure `StyleSheet` (no NativeWind, no Tailwind).

> **IMPORTANT:** All CLI commands use `npx popapp`. The CLI handles dependency resolution, import transformation, and file installation automatically.

## Principles

1. **Use existing components first.** Run `npx popapp list` before writing custom UI. Check [references/components.md](./references/components.md) for the full catalog.
2. **Compose, don't reinvent.** Settings screen = `Screen` + `List` + `Card`. Onboarding flow = `Onboarding` + `OptionGroup` + `Button`. Dashboard = `Screen` + `Card` + `Ticker` + `ProgressRing`.
3. **Use `useTheme()` for all colors.** Never hardcode hex values like `#007AFF`. Always pull from theme tokens.
4. **Use semantic color tokens.** `colors.destructive` for errors, `colors.success` for confirmation — not raw color names.

## Critical Rules

### Styling — StyleSheet Only

PopApp uses `StyleSheet.create()` for static styles and inline theme colors. There is no `className`, no NativeWind, no Tailwind.

```tsx
// CORRECT — static layout in StyleSheet, theme colors inline
const { colors } = useTheme();
<View style={[styles.container, { backgroundColor: colors.card }]}>

const styles = StyleSheet.create({
  container: { padding: 16, borderRadius: 12 },
});

// WRONG — no className in React Native
<View className="bg-card p-4 rounded-xl">
```

### Theme Access

Every component that uses color must call `useTheme()`. The hook returns `{ colors, colorScheme }`.

```tsx
import { useTheme } from "@/lib/theme/use-theme";

export function MyComponent() {
  const { colors } = useTheme();
  return <View style={{ backgroundColor: colors.background }} />;
}
```

### Safe Wrappers for Optional Dependencies

Never import `expo-haptics` or `expo-glass-effect` directly — they may not be installed. Use the safe wrappers that gracefully no-op when the package is missing.

```tsx
// CORRECT — safe wrappers
import { impactMedium } from "@/lib/haptics";
import { SafeGlassView, isGlassAvailable } from "@/lib/glass";

// WRONG — crashes if not installed
import * as Haptics from "expo-haptics";
import { GlassView } from "expo-glass-effect";
```

### Component Composition

Components use named exports, not compound components. Import each piece separately.

```tsx
// CORRECT
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Settings</CardTitle>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>

// WRONG — no compound component pattern
<Card.Header>
<Card.Title>
```

### Icons

Use `IconSymbol` with SF Symbol names. On iOS it renders native SF Symbols; on Android/web it maps to Material Icons automatically.

```tsx
import { IconSymbol } from "@/components/ui/icon-symbol";

<IconSymbol name="heart.fill" size={24} color={colors.primary} />
```

For circular icon buttons use `ActionIcon`. For tinted category icons use `ThemeIcon`.

## Component Selection

| Need | Use |
|------|-----|
| Button / action | `Button` with `variant` prop (solid, outline, ghost, subtle, destructive) |
| Text inputs | `TextInput`, `TextArea`, `OTPInput` |
| Numeric input | `InputStepper`, `SliderBar`, `RulerSlider` |
| Selection (single/multi) | `OptionCard` + `OptionGroup` |
| Date input | `DatePicker` |
| Data display | `Card`, `Badge`, `Ticker`, `ProgressRing`, `Markdown` |
| Lists / settings | `List` with `ListSection` and `ListCell` |
| Screen layout | `Screen` with header, content, sticky button |
| Overlays / modals | `BottomSheet` |
| Loading placeholders | `Skeleton` |
| Icons | `IconSymbol`, `ActionIcon` (circular button), `ThemeIcon` (tinted circle) |
| Content transitions | `AnimatedContent` |
| Paging / carousel | `Carousel` |
| Onboarding flows | `Onboarding` system |
| Auth scaffold | `auth-supabase` template |
| Visual separators | `Separator` |
| Gradient edges | `GradientTint` utility |

## Animation Tiers

Components declare their animation tier so you know what native dependencies they need:

| Tier | Dependencies | Examples |
|------|-------------|----------|
| **1** | None (pure React Native) | Button, Card, TextInput, Badge, Separator, List |
| **2** | `react-native-reanimated` (ships with Expo) | Touchable, Skeleton, ProgressRing, Ticker, Carousel |
| **3** | Reanimated + `react-native-gesture-handler` | SliderBar, RulerSlider, BottomSheet |

## Key Patterns

### Screen layout with sticky button

```tsx
import { Screen, ScreenContent, ScreenStickyButton } from "@/components/ui/screen";

<Screen>
  <ScreenContent>
    {/* scrollable content */}
  </ScreenContent>
  <ScreenStickyButton title="Continue" onPress={handleNext} />
</Screen>
```

### Haptic feedback on interactions

```tsx
import { impactMedium } from "@/lib/haptics";

const handlePress = () => {
  impactMedium();
  // ... action
};
```

### Settings-style list

```tsx
import { List, ListSection, ListCell } from "@/components/ui/list";

<List>
  <ListSection header="Account">
    <ListCell title="Profile" icon="person.fill" onPress={goToProfile} />
    <ListCell title="Notifications" icon="bell.fill" toggle value={notifs} onValueChange={setNotifs} />
  </ListSection>
</List>
```

### Conditional glass effect

```tsx
import { SafeGlassView, isGlassAvailable } from "@/lib/glass";

const content = <View style={styles.card}>{children}</View>;

if (glass && isGlassAvailable()) {
  return <SafeGlassView style={styles.card}>{content}</SafeGlassView>;
}
return content;
```

## Workflow

1. **Check setup** — look for `popapp.json` in the project root. If missing, run `npx popapp init`.
2. **Check installed components** — list the `components/ui/` directory to see what's already available.
3. **Find components** — run `npx popapp list` to see all available registry items, or check [references/components.md](./references/components.md).
4. **Add components** — `npx popapp add button card screen`. Dependencies are auto-resolved (e.g., `button` also installs `theme`, `haptics`, `glass`, `touchable`).
5. **Import and use** — `import { Button } from "@/components/ui/button"`. Make sure the app is wrapped in `ThemeProvider`.
6. **Customize theme** — pass token overrides to `ThemeProvider`:
   ```tsx
   <ThemeProvider
     light={{ primary: "#6366F1", primaryForeground: "#fff" }}
     dark={{ primary: "#818CF8", primaryForeground: "#000" }}
   >
   ```

## CLI Quick Reference

```bash
npx popapp init                    # Initialize project, install theme
npx popapp add button card screen  # Add components (deps auto-resolved)
npx popapp list                    # List all available components
```

**Flags:**
- `--yes` — skip confirmation prompts

## Detailed References

- [references/components.md](./references/components.md) — Full component catalog with props, dependencies, and tiers
- [references/theme.md](./references/theme.md) — Theme tokens, default values, and customization
