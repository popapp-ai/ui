---
name: migrate-component
description: Migrate a React Native component from any Expo/RN project into the PopApp UI registry at /Users/klim/Projects/popapp/ui. Use when adding new components to the registry, porting components from app codebases, or creating new registry components from scratch.
---

# PopApp UI — Component Migration Skill

You are migrating a React Native component into the **PopApp UI registry** — an open-source, shadcn-style component registry for React Native/Expo that uses pure StyleSheet (no Tailwind/NativeWind).

**Registry repo:** `/Users/klim/Projects/popapp/ui`
**GitHub:** `popapp-ai/ui`
**Published at:** `https://popapp-ai.github.io/ui`

---

## Step 1 — Read the source component

Read the source component file. Identify:

- Props interface
- Dependencies (`import` statements)
- What theme values it uses (colors, spacing, etc.)
- Platform-specific code (iOS/Android/web)
- Animation libraries used (Reanimated, Gesture Handler, Moti, Skia, etc.)
- Any hard-coded colors/strings that should use theme tokens

---

## Step 2 — Rewrite imports to canonical `@popapp/*` paths

Registry components use **canonical import paths** that the CLI transformer rewrites for each user's project. You MUST use these exact prefixes:

| Canonical import | Maps to directory | Example |
|---|---|---|
| `@popapp/theme/*` | `registry/theme/*` | `import { useTheme } from "@popapp/theme/use-theme"` |
| `@popapp/components/*` | `registry/components/*` | `import { Button } from "@popapp/components/button"` |
| `@popapp/hooks/*` | `registry/hooks/*` | `import { useColorScheme } from "@popapp/hooks/use-color-scheme"` |
| `@popapp/utils/*` | `registry/utils/*` | `import { impactLight } from "@popapp/utils/haptics"` |

### Common import rewrites

| Source app import | Registry canonical import |
|---|---|
| `import { useTheme } from '@/hooks/use-theme'` | `import { useTheme } from "@popapp/theme/use-theme"` |
| `import { IconSymbol } from '@/components/ui/icon-symbol'` | `import { IconSymbol } from "@popapp/components/icon-symbol"` |
| `import type { IconSymbolName } from './icon-symbol.types'` | `import type { IconSymbolName } from "@popapp/components/icon-symbol.types"` |
| `import { ActionIcon } from './action-icon'` | `import { ActionIcon } from "@popapp/components/action-icon"` |
| `import * as Haptics from 'expo-haptics'` | `import { impactLight } from "@popapp/utils/haptics"` |

### Import path regex rules

The CLI transformer uses this regex for path segments: `[\w./-]+`

This means your import paths can contain: letters, digits, underscores, dots, slashes, hyphens. Examples of valid paths:
- `@popapp/components/icon-symbol.types` (dots)
- `@popapp/components/svg-icons/base-icon` (nested slashes)

---

## Step 3 — Replace theme values with PopApp color tokens

The source app may use `colors.text`, `colors.textSecondary`, etc. PopApp uses a specific `ColorTokens` interface. Map them:

| Common source name | PopApp token |
|---|---|
| `colors.text` | `colors.foreground` |
| `colors.textSecondary` | `colors.foregroundSecondary` |
| `colors.primary` | `colors.primary` (same) |
| `colors.card` | `colors.card` (same) |
| `colors.border` | `colors.border` (same) |
| `colors.icon` | `colors.icon` |
| `colors.muted` | `colors.muted` |
| `colors.background` | `colors.background` |
| `colors.error` / `colors.red` | `colors.destructive` |
| `colors.success` / `colors.green` | `colors.success` |
| `colors.warning` / `colors.orange` | `colors.warning` |

### Full PopApp ColorTokens

```
primary, primaryForeground, accent, accentForeground,
background, backgroundSecondary, backgroundTertiary,
card, cardForeground, cardSecondary,
foreground, foregroundSecondary, muted, mutedForeground,
border, icon,
destructive, destructiveForeground,
success, successForeground,
warning, warningForeground,
info, infoForeground
```

Access via: `const { colors } = useTheme();`

---

## Step 4 — Use safe optional dependency wrappers

Never import optional packages directly. Use the safe wrappers:

### Haptics

```typescript
// ❌ WRONG — crashes if expo-haptics not installed
import * as Haptics from 'expo-haptics';
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// ✅ CORRECT — no-ops gracefully if missing
import { impactLight } from "@popapp/utils/haptics";
impactLight();
```

Available haptic functions: `impactLight()`, `impactMedium()`, `impactHeavy()`, `selectionChanged()`, `notificationSuccess()`, `notificationWarning()`, `notificationError()`

### Glass effect

```typescript
// ❌ WRONG
import { GlassView } from 'expo-glass-effect';

// ✅ CORRECT — falls back to rendering children directly
import { SafeGlassView, isGlassAvailable } from "@popapp/utils/glass";

// Wrap conditionally
{glass && isGlassAvailable() ? (
  <SafeGlassView style={styles.container}>{content}</SafeGlassView>
) : (
  <View style={styles.container}>{content}</View>
)}
```

---

## Step 5 — Write the component file

Place the component in the correct directory:

| Type | Directory | Example |
|---|---|---|
| UI component | `registry/components/` | `registry/components/my-component.tsx` |
| Hook | `registry/hooks/` | `registry/hooks/use-my-hook.ts` |
| Utility | `registry/utils/` | `registry/utils/my-util.ts` |
| Theme extension | `registry/theme/` | `registry/theme/my-tokens.ts` |

### Naming conventions

- File names: `kebab-case.tsx` (e.g., `ruler-slider.tsx`, `choice-binary.tsx`)
- Component names: `PascalCase` (e.g., `RulerSlider`, `ChoiceBinary`)
- Platform-specific: `component-name.ios.tsx` / `component-name.tsx` (default)
- Type files: `component-name.types.ts`
- Subdirectories for extensions: `svg-icons/base-icon.tsx`

### Component structure template

```typescript
import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "@popapp/theme/use-theme";

interface MyComponentProps {
  // ... props
  style?: StyleProp<ViewStyle>;
}

export function MyComponent({ style, ...props }: MyComponentProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, style]}>
      {/* ... */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // ... static styles only, dynamic colors go inline
  },
});
```

---

## Step 6 — Add entry to registry.json

Open `registry.json` at the repo root and add the new entry to the `items` array.

### Registry entry template

```json
{
  "name": "my-component",
  "type": "registry:ui",
  "title": "My Component",
  "description": "One-line description of what it does.",
  "dependencies": ["react-native-reanimated"],
  "registryDependencies": ["theme", "haptics"],
  "files": [
    {
      "path": "registry/components/my-component.tsx",
      "type": "registry:ui",
      "target": "components/ui/my-component.tsx"
    }
  ],
  "meta": {
    "platforms": ["ios", "android", "web"],
    "optionalDeps": ["expo-haptics"],
    "animationTier": 2,
    "tags": ["form", "input"]
  }
}
```

### Field reference

| Field | Required | Description |
|---|---|---|
| `name` | Yes | Kebab-case identifier. Used in `npx popapp add <name>`. |
| `type` | Yes | `"registry:ui"` for components, `"registry:lib"` for utils/theme, `"registry:hook"` for hooks. |
| `title` | Yes | Human-readable title. |
| `description` | Yes | One-line summary for `npx popapp list`. |
| `dependencies` | Yes | npm packages the component needs (e.g., `["react-native-reanimated"]`). Empty array `[]` if none. |
| `registryDependencies` | Yes | Other registry items this depends on (e.g., `["theme", "haptics"]`). These get auto-installed. |
| `files` | Yes | Array of source files. Each has `path` (source), `type`, `target` (where CLI writes it). |
| `meta.platforms` | No | `["ios", "android", "web"]` — which platforms are supported. |
| `meta.optionalDeps` | No | Optional npm packages (user is asked if they want to install). |
| `meta.animationTier` | No | `1` = no deps, `2` = reanimated, `3` = reanimated + gesture-handler. |
| `meta.tags` | No | Search/filter tags. |

### Multi-file components

For components with platform-specific or type files:

```json
{
  "name": "icon-symbol",
  "files": [
    { "path": "registry/components/icon-symbol.types.ts", "type": "registry:ui", "target": "components/ui/icon-symbol.types.ts" },
    { "path": "registry/components/icon-symbol.tsx", "type": "registry:ui", "target": "components/ui/icon-symbol.tsx" },
    { "path": "registry/components/icon-symbol.ios.tsx", "type": "registry:ui", "target": "components/ui/icon-symbol.ios.tsx" }
  ]
}
```

### Subdirectory components

```json
{
  "name": "svg-icons",
  "files": [
    { "path": "registry/components/svg-icons/base-icon.tsx", "type": "registry:ui", "target": "components/ui/svg-icons/base-icon.tsx" },
    { "path": "registry/components/svg-icons/index.ts", "type": "registry:ui", "target": "components/ui/svg-icons/index.ts" }
  ]
}
```

---

## Step 7 — Run TypeScript check

```bash
cd /Users/klim/Projects/popapp/ui && npx tsc --noEmit
```

The root `tsconfig.json` has path aliases configured:

```json
{
  "paths": {
    "@popapp/theme/*": ["registry/theme/*"],
    "@popapp/components/*": ["registry/components/*"],
    "@popapp/hooks/*": ["registry/hooks/*"],
    "@popapp/utils/*": ["registry/utils/*"]
  },
  "include": ["registry/**/*.ts", "registry/**/*.tsx"]
}
```

**If you get module-not-found errors**, the dependency may need to be installed as a devDep at the workspace root:

```bash
cd /Users/klim/Projects/popapp/ui && pnpm add -wD <package-name>
```

---

## Step 8 — Build the registry

```bash
cd /Users/klim/Projects/popapp/ui && pnpm build:registry
```

This runs `scripts/build-registry.ts` which:
1. Reads `registry.json`
2. For each item, reads all referenced files and inlines their content
3. Writes individual JSON files to `public/r/{name}.json`
4. Writes `public/r/index.json` (metadata index)
5. Copies `registry.json` to `public/registry.json`

**Expected output:**

```
📦 Building PopApp UI registry...
  ✅ my-component.json (1 file)
  ...
✨ Built N registry items → public/r/
```

If a file referenced in `registry.json` doesn't exist, the build will fail with `❌ File not found`.

---

## Step 9 — Update README.md

Open `README.md` at the repo root and add the new component to the correct table in the **Available Components** section.

The README organizes components into these category tables:

| Section | What goes here |
|---|---|
| **Core** | Foundation utilities: `theme`, `haptics`, `glass`, `use-color-scheme` |
| **Icons** | Icon-related: `icon-symbol`, `svg-icons`, `action-icon`, `theme-icon` |
| **Form & Input** | Interactive inputs: `button`, `text-input`, `text-area`, `otp-input`, `date-picker`, `slider-bar`, `ruler-slider` |
| **Selection** | Choice/selection UI: `choice-card`, `choice-binary`, `option-card`, `option-group` |
| **Display & Feedback** | Visual/read-only: `card`, `badge`, `separator`, `skeleton`, `touchable-scale`, `progress-ring`, `ticker`, `markdown` |
| **Overlay** | Modal/sheet layers: `bottom-sheet` |

Add a new row in the appropriate table using this format:

```markdown
| `my-component` | Short description of what it does | N |
```

Where `N` is the animation tier (`1`, `2`, or `3`). For core items use `—` instead of a number.

If the new component doesn't fit any existing category, create a new category section following the same pattern:

```markdown
### New Category

| Component | Description | Tier |
|-----------|-------------|------|
| `my-component` | Description here | 2 |
```

---

## Step 10 — Commit and push

Stage only the relevant files (never stage `node_modules`, `.env`, or `public/` which is gitignored):

```bash
cd /Users/klim/Projects/popapp/ui

git add \
  registry/components/my-component.tsx \
  registry.json \
  README.md

git commit -m "feat: add my-component

Description of what the component does.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

git push origin main
```

### What NOT to commit

- `public/` — gitignored, built by CI
- `node_modules/` — gitignored
- `pnpm-lock.yaml` — only commit if you added new devDeps
- `package.json` — only commit if you added new devDeps

---

## Step 11 — Verify GitHub Pages deployment

After pushing, GitHub Actions automatically:
1. Builds the CLI (`pnpm build`)
2. Builds the registry (`npx tsx scripts/build-registry.ts`)
3. Deploys `public/` to GitHub Pages

Watch the deployment:

```bash
cd /Users/klim/Projects/popapp/ui && gh run list --limit 1 --json databaseId --jq '.[0].databaseId' | xargs -I{} gh run watch {}
```

Verify the component is live:

```bash
curl -s https://popapp-ai.github.io/ui/r/my-component.json | head -5
```

Check total count:

```bash
curl -s https://popapp-ai.github.io/ui/r/index.json | python3 -m json.tool | grep '"name"' | wc -l
```

---

## Checklist

Before considering the migration complete, verify ALL of these:

- [ ] Component file written to `registry/components/` (or appropriate directory)
- [ ] All imports use `@popapp/*` canonical paths (NOT `@/`, NOT `./`, NOT bare package names for haptics/glass)
- [ ] Theme colors use `colors.foreground` (not `colors.text`), `colors.foregroundSecondary` (not `colors.textSecondary`), etc.
- [ ] Direct `expo-haptics` replaced with `@popapp/utils/haptics` safe wrapper
- [ ] Direct `expo-glass-effect` replaced with `@popapp/utils/glass` safe wrapper
- [ ] Entry added to `registry.json` with correct `dependencies`, `registryDependencies`, `files`, `meta`
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `pnpm build:registry` succeeds and shows the new component
- [ ] `README.md` updated with new component in the correct category table
- [ ] Changes committed and pushed to `main`
- [ ] GitHub Actions deployment succeeded
- [ ] Component accessible at `https://popapp-ai.github.io/ui/r/{name}.json`

---

## Existing registry items for reference

When setting `registryDependencies`, use these names:

**Core:** `theme`, `haptics`, `glass`, `use-color-scheme`
**Icons:** `icon-symbol`, `svg-icons`, `action-icon`, `theme-icon`
**Form:** `button`, `text-input`, `text-area`, `otp-input`, `date-picker`, `slider-bar`, `ruler-slider`
**Selection:** `choice-card`, `choice-binary`, `option-card`, `option-group`
**Display:** `card`, `badge`, `separator`, `skeleton`, `touchable-scale`, `progress-ring`, `ticker`, `markdown`
**Overlay:** `bottom-sheet` — requires `react-native-multiple-modals`, `react-native-keyboard-controller` (for ModalView and KeyboardStickyView)

---

## Common patterns

### Safe optional dependency (try/catch require)

```typescript
let SomeLib: any = null;
try {
  SomeLib = require("some-optional-package");
} catch {
  // not installed — gracefully skip
}
```

### Platform-specific files

Create `component.ios.tsx` for iOS-specific implementation and `component.tsx` as the default (Android/web). React Native's bundler automatically picks the right one. List BOTH files in `registry.json`.

### Exporting types separately

Put shared types in `component-name.types.ts` and import with:
```typescript
import type { MyType } from "@popapp/components/component-name.types";
```

### Component with glass prop

```typescript
import { SafeGlassView, isGlassAvailable } from "@popapp/utils/glass";

interface Props {
  glass?: boolean;
}

export function MyComponent({ glass = false }: Props) {
  const content = <View>...</View>;

  if (glass && isGlassAvailable()) {
    return <SafeGlassView style={styles.container}>{content}</SafeGlassView>;
  }
  return <View style={styles.container}>{content}</View>;
}
```
