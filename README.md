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

### Core

| Component | Description | Tier |
|-----------|-------------|------|
| `theme` | Token-based theme system with light/dark mode | — |
| `haptics` | Safe haptics wrapper (no-ops if expo-haptics missing) | — |
| `glass` | Safe expo-glass-effect wrapper with fallback | — |
| `use-color-scheme` | Color scheme hook with safe default | — |

### Icons

| Component | Description | Tier |
|-----------|-------------|------|
| `icon-symbol` | SF Symbols (iOS) + Material Icons (Android/web) | 1 |
| `svg-icons` | **Optional extension** — custom SVG icon registry | 1 |
| `action-icon` | Circular icon button with Liquid Glass support | 1 |
| `theme-icon` | Icon in a tinted circle background | 1 |

### Form & Input

| Component | Description | Tier |
|-----------|-------------|------|
| `button` | Pressable with variants, sizes, loading, glass, haptics | 1 |
| `text-input` | Themed input with label, error, icon slots | 1 |
| `text-area` | Multiline text input with label and error state | 1 |
| `otp-input` | One-time password input with digit boxes | 1 |
| `date-picker` | Three-column month/day/year native picker | 1 |
| `slider-bar` | Gesture slider with step snapping and labels | 3 |
| `ruler-slider` | iOS-style Skia ruler with momentum & decay physics | 3 |

### Selection

| Component | Description | Tier |
|-----------|-------------|------|
| `choice-card` | Selectable card with icon and subtitle | 2 |
| `choice-binary` | Two-option selector with side-by-side cards | 2 |
| `option-card` | List option with checkbox, icon, description | 2 |
| `option-group` | Single/multi-select option list | 2 |

### Display & Feedback

| Component | Description | Tier |
|-----------|-------------|------|
| `card` | Composable card with header, content, footer | 1 |
| `badge` | Status badge with color variants | 1 |
| `separator` | Horizontal/vertical divider | 1 |
| `skeleton` | Pulsing loading placeholder | 2 |
| `touchable-scale` | Animated pressable with spring scale | 2 |
| `progress-ring` | Animated circular progress with spring animation | 2 |
| `ticker` | Animated number ticker with staggered digit rolls | 2 |
| `markdown` | Themed markdown renderer with code copy button | 1 |

### Overlay

| Component | Description | Tier |
|-----------|-------------|------|
| `bottom-sheet` | Pan-to-dismiss modal sheet with spring animations | 3 |

### Animation Tiers

- **Tier 1** — Zero animation dependencies. Pure React Native.
- **Tier 2** — Requires `react-native-reanimated` (included in Expo by default).
- **Tier 3** — Requires `react-native-reanimated` + `react-native-gesture-handler`.

## Icon System

PopApp uses SF Symbol names as the canonical icon API. On iOS, icons render natively via `expo-symbols`. On Android/web, they're mapped to Material Icons.

```tsx
import { IconSymbol } from "@/components/ui/icon-symbol";

<IconSymbol name="heart.fill" size={24} color={colors.primary} />
```

### Adding custom SVG icons

Install the optional `svg-icons` extension:

```bash
npx popapp add svg-icons
```

Then add your icons to `components/ui/svg-icons/` and register them in the `ICON_COMPONENTS` map. Use them with the `svg-` prefix:

```tsx
<IconSymbol name="svg-myLogo" size={24} color={colors.primary} />
```

## Theme Tokens

The theme system provides typed color tokens:

```tsx
const { colors, colorScheme } = useTheme();
```

### Color tokens

`primary`, `primaryForeground`, `accent`, `background`, `backgroundSecondary`, `backgroundTertiary`, `card`, `cardForeground`, `cardSecondary`, `foreground`, `foregroundSecondary`, `muted`, `mutedForeground`, `border`, `icon`, `destructive`, `success`, `warning`, `info` (with foreground variants), and extensible via index signature.

## License

MIT
