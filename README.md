# PopApp UI

**Native StyleSheet. Native gestures. Native haptics. No Tailwind required.**

A shadcn-style component registry for React Native and Expo. Copy beautiful, production-ready components into your project with a single command.

## Why PopApp UI?

Every existing React Native component registry requires NativeWind/Tailwind CSS. PopApp UI uses **pure React Native StyleSheet** — zero build configuration, works with any Expo template instantly.

- **StyleSheet-native** — no NativeWind, no Tailwind, no className resolution
- **Gesture-first** — spring physics and UI-thread animations via Reanimated
- **Haptic feedback** — built into every interactive component
- **Copy-paste** — you own the code, customize freely
- **TypeScript-first** — full type safety with exported interfaces
- **Expo-optimized** — works out of the box with Expo, compatible with bare RN

## Quick Start

```bash
# Initialize in your Expo project
npx popapp init

# Add components
npx popapp add button card text-input

# List available components
npx popapp list
```

## Setup

After running `npx popapp init`, wrap your root layout in the ThemeProvider:

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

### Customize the theme

```tsx
<ThemeProvider
  light={{ primary: "#6366F1", primaryForeground: "#fff" }}
  dark={{ primary: "#818CF8", primaryForeground: "#000" }}
>
  <App />
</ThemeProvider>
```

## Available Components

| Component | Description | Animation Tier |
|-----------|-------------|---------------|
| `button` | Pressable button with variants, sizes, loading, haptics | 1 (no deps) |
| `card` | Composable card with header, content, footer | 1 |
| `text-input` | Themed input with label, error, icon slots | 1 |
| `touchable-scale` | Animated pressable with spring scale | 2 (reanimated) |
| `skeleton` | Pulsing loading placeholder | 2 |
| `separator` | Horizontal/vertical divider | 1 |
| `badge` | Status badge with color variants | 1 |

### Animation Tiers

- **Tier 1** — Zero animation dependencies. Pure React Native.
- **Tier 2** — Requires `react-native-reanimated` (included in Expo by default).
- **Tier 3** — Requires `react-native-reanimated` + `react-native-gesture-handler`.

## Theme Tokens

The theme system provides typed design tokens:

```tsx
const { colors, spacing, radius, typography, colorScheme } = useTheme();
```

### Color tokens

`primary`, `primaryForeground`, `accent`, `background`, `card`, `foreground`, `foregroundSecondary`, `border`, `muted`, `destructive`, `success`, `warning`, `info`, and more.

### Spacing

`xs` (4), `sm` (8), `md` (16), `lg` (24), `xl` (32), `2xl` (48), `3xl` (64)

### Radius

`sm` (6), `md` (10), `lg` (14), `xl` (20), `2xl` (28), `full` (9999)

## License

MIT
