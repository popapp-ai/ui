# PopApp UI

**Native StyleSheet. Native gestures. Native haptics. No Tailwind required.**

A shadcn-style component registry for React Native and Expo. Copy beautiful, production-ready components into your project with a single command.

## Why PopApp UI?

PopApp UI follows the **copy-and-own model** — every component lives in your project, fully customizable. No opaque `node_modules`.

- **StyleSheet-native** — no NativeWind, no Tailwind, no className resolution
- **Gesture-first** — spring physics and UI-thread animations via Reanimated
- **Haptic feedback** — built into every interactive component
- **Liquid Glass** — iOS 26+ glass effects where supported
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

## Component Registry

### UI Components

| Component | Description | Tier |
|-----------|-------------|------|
| `button` | Pressable button with variants, sizes, loading state, and haptic feedback | 1 |
| `card` | Composable card container with header, content, and footer | 1 |
| `text-input` | Themed text input with label, error state, and icon slots | 1 |
| `text-area` | Multiline text input with configurable height | 1 |
| `badge` | Status badge with color variants | 1 |
| `separator` | Horizontal or vertical divider line | 1 |
| `icon-symbol` | Cross-platform icon: SF Symbols on iOS, Material Icons on Android/web | 1 |
| `svg-icons` | Custom SVG icon extension for `icon-symbol` | 1 |
| `action-icon` | Circular icon button with Liquid Glass support | 1 |
| `theme-icon` | Icon wrapped in a tinted circle background | 1 |
| `otp-input` | One-time password input with individual digit boxes | 1 |
| `date-picker` | Three-column month/day/year picker with native scroll wheels | 1 |
| `list` | iOS Settings-style grouped list with navigation, toggle, and action cells | 1 |
| `markdown` | Themed markdown renderer with code block copy button | 1 |
| `touchable` | Animated pressable with spring scale and opacity | 2 |
| `skeleton` | Pulsing loading placeholder | 2 |
| `choice-card` | Selectable card for picking an option from a set | 2 |
| `choice-binary` | Two-option selector using side-by-side ChoiceCards | 2 |
| `option-card` | Selectable list option with checkbox, icon, and description | 2 |
| `option-group` | Single or multi-select option list using OptionCards | 2 |
| `progress-ring` | Animated circular progress indicator | 2 |
| `ticker` | Animated number ticker with staggered digit rolls | 2 |
| `input-stepper` | Numeric stepper with animated ticker display | 2 |
| `animated-content` | Spring-based enter/exit content transitions | 2 |
| `screen` | Composable screen layout with keyboard-aware content | 2 |
| `onboarding` | Step-based onboarding engine with progress and skip logic | 2 |
| `slider-bar` | Gesture-controlled slider with thumb/track variants, step snapping, and haptics | 3 |
| `ruler-slider` | iOS-style ruler picker with Skia rendering and momentum scrolling | 3 |
| `bottom-sheet` | Modal bottom sheet with pan-to-dismiss gesture | 3 |

### Libraries & Utilities

| Item | Type | Description |
|------|------|-------------|
| `theme` | Library | Token-based theme system with light/dark mode |
| `haptics` | Library | Safe haptics wrapper (never crashes without `expo-haptics`) |
| `glass` | Library | Liquid Glass wrapper (graceful fallback on non-iOS 26) |
| `gradient-tint` | Library | Gradient fade for headers, footers, and scroll edges |
| `use-color-scheme` | Hook | Color scheme hook with safe default |
| `use-theme` | Hook | Access theme colors and color scheme in any component |

### Templates

| Template | Description |
|----------|-------------|
| `auth-supabase` | Supabase auth with MMKV persistence, Zustand store, and React Query |

## Animation Tiers

| Tier | Dependencies | Description |
|------|-------------|-------------|
| **Tier 1** | None | Pure React Native. Zero animation dependencies. |
| **Tier 2** | `react-native-reanimated` | Spring animations on the UI thread. Included in Expo by default. |
| **Tier 3** | `reanimated` + `gesture-handler` | Full gesture control with pan, pinch, and swipe support. |

## Icon System

PopApp uses SF Symbol names as the canonical icon API. On iOS, icons render natively via `expo-symbols`. On Android/web, they're mapped to Material Icons.

```tsx
import { IconSymbol } from "@/components/ui/icon-symbol";

<IconSymbol name="heart.fill" size={24} color={colors.primary} />
```

### Adding custom SVG icons

```bash
npx popapp add svg-icons
```

Add your icons to `components/ui/svg-icons/` and register them in the `ICON_COMPONENTS` map. Use them with the `svg-` prefix:

```tsx
<IconSymbol name="svg-myLogo" size={24} color={colors.primary} />
```

## Theme Tokens

```tsx
const { colors, colorScheme } = useTheme();
```

Available tokens: `primary`, `primaryForeground`, `accent`, `background`, `backgroundSecondary`, `backgroundTertiary`, `card`, `cardForeground`, `cardSecondary`, `foreground`, `foregroundSecondary`, `muted`, `mutedForeground`, `border`, `icon`, `destructive`, `success`, `warning`, `info` (with foreground variants), and extensible via index signature.

## License

MIT
