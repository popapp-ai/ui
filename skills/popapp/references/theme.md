# Theme System

PopApp UI uses a token-based theme system. All colors come from a `ColorTokens` interface accessed via the `useTheme()` hook. No CSS variables, no Tailwind — pure TypeScript design tokens for React Native.

## Setup

Wrap your root layout in `ThemeProvider`:

```tsx
import { ThemeProvider } from "@/lib/theme/provider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
```

Components will crash without `ThemeProvider` — they rely on `useTheme()` to resolve tokens.

## Using Tokens

```tsx
import { useTheme } from "@/lib/theme/use-theme";

export function MyComponent() {
  const { colors, colorScheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={{ color: colors.foreground }}>Hello</Text>
      <Text style={{ color: colors.foregroundSecondary }}>Subtitle</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, borderRadius: 12, borderWidth: 1 },
});
```

The pattern: `StyleSheet.create()` for static layout properties, inline styles for theme-dependent colors.

## Color Tokens

### Brand

| Token | Light | Dark | Use for |
|-------|-------|------|---------|
| `primary` | `#000000` | `#ffffff` | Primary buttons, key actions |
| `primaryForeground` | `#ffffff` | `#000000` | Text on primary backgrounds |
| `accent` | `#007AFF` | `#0A84FF` | Links, highlights, secondary actions |
| `accentForeground` | `#ffffff` | `#ffffff` | Text on accent backgrounds |

### Surfaces

| Token | Light | Dark | Use for |
|-------|-------|------|---------|
| `background` | `#ffffff` | `#000000` | Page/screen background |
| `backgroundSecondary` | `#f5f5f5` | `#111111` | Grouped content background |
| `backgroundTertiary` | `#EBEBEC` | `#2a2a2a` | Nested/inset backgrounds |
| `card` | `#ffffff` | `#1a1a1a` | Card surfaces |
| `cardForeground` | `#11181C` | `#ECEDEE` | Text on cards |
| `cardSecondary` | `#f0f0f0` | `#222222` | Secondary card surfaces |

### Text

| Token | Light | Dark | Use for |
|-------|-------|------|---------|
| `foreground` | `#11181C` | `#ECEDEE` | Primary text |
| `foregroundSecondary` | `#687076` | `#9BA1A6` | Secondary/subtitle text |
| `muted` | `#c0c0c0` | `#555555` | Disabled/placeholder elements |
| `mutedForeground` | `#687076` | `#9BA1A6` | Text on muted backgrounds |

### UI

| Token | Light | Dark | Use for |
|-------|-------|------|---------|
| `border` | `#e0e0e0` | `#2a2a2a` | Borders, dividers |
| `icon` | `#687076` | `#9BA1A6` | Default icon tint |

### Semantic

| Token | Light | Dark | Use for |
|-------|-------|------|---------|
| `destructive` | `#e53935` | `#ef5350` | Errors, delete actions |
| `destructiveForeground` | `#ffffff` | `#ffffff` | Text on destructive |
| `success` | `#34C759` | `#30D158` | Success states |
| `successForeground` | `#ffffff` | `#ffffff` | Text on success |
| `warning` | `#FF9500` | `#FFB74D` | Warning states |
| `warningForeground` | `#ffffff` | `#000000` | Text on warning |
| `info` | `#007AFF` | `#64D2FF` | Informational states |
| `infoForeground` | `#ffffff` | `#000000` | Text on info |

## Token Naming Convention

Tokens follow a **surface + foreground** pattern:
- `card` — the background color of a card
- `cardForeground` — text color to use on that card
- `destructive` — the background of a destructive element
- `destructiveForeground` — text color on that background

Always pair them: if you use `colors.destructive` as a background, use `colors.destructiveForeground` for text on it.

## Customization

### Override individual tokens

```tsx
<ThemeProvider
  light={{ primary: "#6366F1", primaryForeground: "#fff" }}
  dark={{ primary: "#818CF8", primaryForeground: "#000" }}
>
```

Unspecified tokens keep their defaults.

### Named themes

```tsx
<ThemeProvider
  themes={{
    ocean: {
      light: { primary: "#0077B6", accent: "#00B4D8" },
      dark: { primary: "#90E0EF", accent: "#48CAE4" },
    },
  }}
  activeTheme="ocean"
>
```

### Force color scheme

```tsx
<ThemeProvider colorScheme="dark">
```

Options: `"light"`, `"dark"`, `"system"` (default).

## Custom Tokens

The `ColorTokens` interface has an index signature `[key: string]: string`, so you can add custom tokens:

```tsx
<ThemeProvider
  light={{ brandGold: "#FFD700" }}
  dark={{ brandGold: "#FFC107" }}
>
```

Access via bracket notation:

```tsx
const { colors } = useTheme();
const gold = colors["brandGold"];
```
