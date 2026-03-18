# Component Reference

Full catalog of PopApp UI registry items. Install any component with `npx popapp add <name>`.

Dependencies are resolved automatically — adding a component also installs everything it depends on.

---

## Layout

### Screen
Composable screen layout with absolute header/footer, keyboard-aware content, gradient fading, and sticky button.
- **Tier:** 2 | **Platforms:** iOS, Android
- **Deps:** reanimated, keyboard-controller, safe-area-context, expo-linear-gradient
- **Registry deps:** theme, button, gradient-tint
- **Key props:** Compose with `ScreenContent`, `ScreenHeader`, `ScreenFooter`, `ScreenStickyButton`
- **Install:** `npx popapp add screen`

### Card
Composable card container with header, content, and footer sections.
- **Tier:** 1 | **Platforms:** iOS, Android, Web
- **Registry deps:** theme
- **Subcomponents:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- **Install:** `npx popapp add card`

### List
iOS Settings-style grouped list with navigation, toggle, and action cells.
- **Tier:** 1 | **Platforms:** iOS, Android, Web
- **Registry deps:** theme, card, icon-symbol, touchable
- **Subcomponents:** `List`, `ListSection`, `ListCell`
- **Key props (ListCell):** `title`, `subtitle`, `icon` (SF Symbol name), `onPress`, `toggle`, `value`, `onValueChange`
- **Install:** `npx popapp add list`

### Separator
Horizontal or vertical divider line.
- **Tier:** 1 | **Platforms:** iOS, Android, Web
- **Registry deps:** theme
- **Key props:** `orientation` (horizontal/vertical)
- **Install:** `npx popapp add separator`

---

## Form & Input

### Button
Pressable button with variants, sizes, loading state, icons, haptic feedback, and Liquid Glass support.
- **Tier:** 1 | **Platforms:** iOS, Android, Web
- **Registry deps:** theme, haptics, glass, touchable
- **Key props:** `title`, `variant` (solid/outline/ghost/subtle/destructive), `size` (xs/sm/md/lg/xl), `shape` (pill/rounded), `isLoading`, `leftIcon`, `rightIcon`, `haptic`, `glass`, `fullWidth`
- **Install:** `npx popapp add button`

### TextInput
Themed text input with label, error state, and icon slots.
- **Tier:** 1 | **Platforms:** iOS, Android, Web
- **Registry deps:** theme
- **Key props:** `label`, `placeholder`, `value`, `onChangeText`, `error`, `leftIcon`, `rightIcon`
- **Install:** `npx popapp add text-input`

### TextArea
Multiline text input with label, error state, and configurable height.
- **Tier:** 1 | **Platforms:** iOS, Android, Web
- **Registry deps:** theme
- **Key props:** `label`, `placeholder`, `value`, `onChangeText`, `error`, `numberOfLines`
- **Install:** `npx popapp add text-area`

### OTPInput
One-time password input with individual digit boxes.
- **Tier:** 1 | **Platforms:** iOS, Android, Web
- **Registry deps:** theme
- **Key props:** `length`, `value`, `onChangeText`, `onComplete`
- **Install:** `npx popapp add otp-input`

### DatePicker
Three-column month/day/year picker using native scroll wheels.
- **Tier:** 1 | **Platforms:** iOS, Android
- **Deps:** @react-native-picker/picker
- **Registry deps:** theme
- **Key props:** `value`, `onValueChange`, `minimumDate`, `maximumDate`
- **Install:** `npx popapp add date-picker`

### SliderBar
Animated slider with gesture control, step snapping, labels, haptic feedback, and thumb/track variants.
- **Tier:** 3 | **Platforms:** iOS, Android
- **Deps:** reanimated, gesture-handler
- **Registry deps:** theme, haptics, icon-symbol
- **Key props:** `value`, `onValueChange`, `min`, `max`, `step`, `label`
- **Install:** `npx popapp add slider-bar`

### RulerSlider
iOS-style ruler picker with Skia rendering, momentum scrolling, decay physics, and haptic feedback.
- **Tier:** 3 | **Platforms:** iOS, Android
- **Deps:** @shopify/react-native-skia, masked-view, expo-linear-gradient, reanimated, gesture-handler
- **Registry deps:** theme, haptics
- **Key props:** `value`, `onValueChange`, `min`, `max`, `step`, `unit`
- **Install:** `npx popapp add ruler-slider`

### InputStepper
Numeric stepper with animated ticker display, increment/decrement buttons, and optional value tap action.
- **Tier:** 2 | **Platforms:** iOS, Android
- **Deps:** masked-view, expo-linear-gradient, reanimated
- **Registry deps:** theme, ticker, action-icon, touchable
- **Key props:** `value`, `onValueChange`, `min`, `max`, `step`
- **Install:** `npx popapp add input-stepper`

---

## Selection

### OptionCard
Selectable option card with checkbox, icon, description, and left/center alignment.
- **Tier:** 2 | **Platforms:** iOS, Android, Web
- **Deps:** reanimated
- **Registry deps:** theme, haptics, touchable, icon-symbol
- **Key props:** `title`, `description`, `icon`, `selected`, `onPress`, `alignment`
- **Install:** `npx popapp add option-card`

### OptionGroup
Single or multi-select option group with vertical/horizontal layout.
- **Tier:** 2 | **Platforms:** iOS, Android, Web
- **Deps:** reanimated
- **Registry deps:** option-card
- **Key props:** `options`, `value`, `onValueChange`, `multiple`, `direction`
- **Install:** `npx popapp add option-group`

---

## Display & Feedback

### Badge
Status badge with color variants.
- **Tier:** 1 | **Platforms:** iOS, Android, Web
- **Registry deps:** theme
- **Key props:** `label`, `variant` (default/success/warning/destructive/info)
- **Install:** `npx popapp add badge`

### Skeleton
Pulsing loading placeholder with configurable dimensions.
- **Tier:** 2 | **Platforms:** iOS, Android, Web
- **Deps:** reanimated
- **Registry deps:** theme
- **Key props:** `width`, `height`, `borderRadius`
- **Install:** `npx popapp add skeleton`

### ProgressRing
Animated circular progress indicator with spring animation and customizable colors.
- **Tier:** 2 | **Platforms:** iOS, Android, Web
- **Deps:** reanimated, react-native-svg
- **Registry deps:** theme
- **Key props:** `progress` (0-1), `size`, `strokeWidth`, `color`
- **Install:** `npx popapp add progress-ring`

### Ticker
Animated number ticker with staggered digit rolls, currency/locale formatting, and masked gradient edges.
- **Tier:** 2 | **Platforms:** iOS, Android
- **Deps:** masked-view, expo-linear-gradient, reanimated
- **Registry deps:** theme
- **Key props:** `value`, `format` (number/currency/percent), `locale`, `prefix`, `suffix`
- **Install:** `npx popapp add ticker`

### Markdown
Themed markdown renderer with code block copy button.
- **Tier:** 1 | **Platforms:** iOS, Android, Web
- **Deps:** react-native-markdown-display, @react-native-clipboard/clipboard
- **Registry deps:** theme, action-icon
- **Key props:** `children` (markdown string)
- **Install:** `npx popapp add markdown`

---

## Interaction

### Touchable
Animated pressable with spring scale, opacity animations, and haptics.
- **Tier:** 2 | **Platforms:** iOS, Android, Web
- **Deps:** reanimated
- **Registry deps:** haptics
- **Key props:** `onPress`, `activeOpacity`, `scaleValue`, `haptic`
- **Install:** `npx popapp add touchable`

### AnimatedContent
Animate content transitions with spring-based enter/exit animations.
- **Tier:** 2 | **Platforms:** iOS, Android
- **Deps:** reanimated
- **Key props:** `preset` (horizontal/vertical/fade), `entering`, `exiting`
- **Install:** `npx popapp add animated-content`

### BottomSheet
Modal bottom sheet with pan-to-dismiss gesture, backdrop, and spring animations.
- **Tier:** 3 | **Platforms:** iOS, Android
- **Deps:** reanimated, gesture-handler, react-native-multiple-modals, keyboard-controller, safe-area-context
- **Registry deps:** theme
- **Key props:** `visible`, `onDismiss`, `snapPoints`, `enableDismissOnBackdrop`
- **Install:** `npx popapp add bottom-sheet`

### Carousel
Swipeable pager carousel with animated page dots and active-page injection.
- **Tier:** 2 | **Platforms:** iOS, Android
- **Deps:** react-native-pager-view, reanimated
- **Registry deps:** theme
- **Key props:** `children`, `showDots`, `onPageChange`
- **Install:** `npx popapp add carousel`

---

## Icons

### IconSymbol
Cross-platform icon component: SF Symbols on iOS, Material Icons on Android/web.
- **Tier:** 1 | **Platforms:** iOS, Android, Web
- **Deps:** expo-symbols, @expo/vector-icons
- **Key props:** `name` (SF Symbol name), `size`, `color`
- **Install:** `npx popapp add icon-symbol`

### SVG Icons
Optional extension for icon-symbol: adds custom SVG icon support with BaseIcon wrapper and registry pattern.
- **Tier:** 1 | **Platforms:** iOS, Android, Web
- **Deps:** react-native-svg
- **Registry deps:** icon-symbol
- **Install:** `npx popapp add svg-icons`

### ActionIcon
Circular icon button with Liquid Glass support and size/variant options.
- **Tier:** 1 | **Platforms:** iOS, Android, Web
- **Registry deps:** theme, glass, icon-symbol
- **Key props:** `icon` (SF Symbol name), `size`, `variant`, `onPress`, `glass`
- **Install:** `npx popapp add action-icon`

### ThemeIcon
Icon wrapped in a tinted circle background. Ideal for category icons and settings.
- **Tier:** 1 | **Platforms:** iOS, Android, Web
- **Registry deps:** icon-symbol
- **Key props:** `icon` (SF Symbol name), `color`, `size`
- **Install:** `npx popapp add theme-icon`

---

## Onboarding

### Onboarding
Step-based onboarding engine with animated layout, progress bar, skip logic, and lifecycle hooks.
- **Tier:** 2 | **Platforms:** iOS, Android
- **Deps:** reanimated, keyboard-controller, safe-area-context, expo-linear-gradient, zustand
- **Registry deps:** theme, button, icon-symbol, gradient-tint, screen, animated-content
- **Subcomponents:** `OnboardingProvider`, `OnboardingLayout`, `OnboardingScreen`, `ProgressBar`, `useOnboarding`
- **Install:** `npx popapp add onboarding`

---

## Libraries & Utils

### Theme
Token-based theme system with light/dark mode and custom schemes. See [theme.md](./theme.md) for full docs.
- **Files:** `lib/theme/tokens.ts`, `lib/theme/provider.tsx`, `lib/theme/use-theme.ts`
- **Install:** `npx popapp add theme` (auto-installed with `npx popapp init`)

### Haptics
Safe haptics wrapper that never crashes if expo-haptics is not installed.
- **Functions:** `impactLight()`, `impactMedium()`, `impactHeavy()`, `selectionChanged()`, `notificationSuccess()`, `notificationWarning()`, `notificationError()`
- **Install:** `npx popapp add haptics`

### Glass
Safe wrapper for expo-glass-effect Liquid Glass. Falls back gracefully when unavailable.
- **Exports:** `SafeGlassView`, `isGlassAvailable()`
- **Install:** `npx popapp add glass`

### useColorScheme
Color scheme hook with safe default.
- **Install:** `npx popapp add use-color-scheme`

### GradientTint
Gradient fade utility for headers, footers, and scroll edges.
- **Deps:** expo-linear-gradient
- **Registry deps:** theme
- **Install:** `npx popapp add gradient-tint`

---

## Templates

### Supabase Auth
Starter template for Supabase auth with MMKV persistence, Zustand auth store, and React Query patterns.
- **Deps:** @supabase/supabase-js, react-native-mmkv, zustand, @tanstack/react-query
- **Files:** `lib/auth/supabase.ts`, `lib/auth/auth-store.ts`, `lib/auth/auth-provider.tsx`, `lib/auth/query-provider.tsx`, `lib/auth/query-keys.ts`
- **Install:** `npx popapp add auth-supabase`
