---
name: update-docs
description: Create or update component documentation pages for the PopApp UI registry. Use when a new component is added, an existing component changes, or docs need screenshots/videos refreshed.
---

# PopApp UI — Update Docs Skill

You are creating or updating documentation for PopApp UI registry components. This involves ensuring the example app has a showcase entry, the docs MDX page exists and is up-to-date, and screenshots/videos are captured.

---

## Workspace layout

| What | Path |
|------|------|
| **UI registry** | Current workspace (e.g. `/Users/klim/conductor/workspaces/ui/<name>/`) |
| **Docs site** | Sibling workspace at `../docs/<name>/` — or `/Users/klim/conductor/workspaces/docs/<name>/` |
| **Example app** | `example/src/app/` within the UI workspace |
| **Screenshot route** | `example/src/app/screenshot.tsx` |
| **Registry components** | `registry/components/` |
| **Docs pages** | `pages/components/` in docs workspace |
| **Docs images** | `public/images/` in docs workspace |
| **Docs videos** | `public/videos/` in docs workspace |
| **Metro-watched dir** | `/Users/klim/Projects/popapp/ui/` (copy screenshot.tsx here for hot reload) |
| **Docs public (canonical)** | `/Users/klim/Projects/popapp/docs/public/` (capture scripts save here) |

To find the docs workspace, check `../docs/` relative to the UI workspace, or look at other active workspaces listed in the system prompt.

---

## Full workflow for a component

### Step 1 — Read the component source

Read `registry/components/<component-name>.tsx` to understand:
- Props interface and defaults
- Visual variants, sizes, states
- Dependencies (npm and registry)
- Animation tier (Tier 1 = none, Tier 2 = Reanimated, Tier 3 = Reanimated + GestureHandler + possibly Skia)
- Platform support

### Step 2 — Ensure example app has showcase entries

Open `example/src/app/screenshot.tsx` and check if entries exist for the component. Each visual state or variant that needs a screenshot/video should have its own entry in the `SCREENSHOTS` map.

**Static entries** (for screenshots):
```tsx
"component-name": () => (
  <ComponentName prop="value" />
),
"component-name-variants": () => (
  <View style={styles.row}>
    <ComponentName variant="a" />
    <ComponentName variant="b" />
  </View>
),
```

**Animated entries** (for videos — prefix with `anim-`):
```tsx
"anim-component-name": () => {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    // animate on mount
  }, []);
  return <ComponentName value={value} />;
},
```

Rules:
- No `DemoSection` wrapper — just the raw component
- No titles or descriptions
- Use realistic content (real names, not "Lorem ipsum")
- `styles.row` for horizontal groups, `styles.list` for vertical stacking
- Import new components at the top of the file
- For gesture components, add a semi-transparent finger cursor overlay (54px circle, `rgba(90, 90, 90, 0.25)` with 2px `rgba(60, 60, 60, 0.3)` border, `zIndex: 999`)

After editing, sync to Metro:
```bash
cp example/src/app/screenshot.tsx /Users/klim/Projects/popapp/ui/example/src/app/screenshot.tsx
```

### Step 3 — Capture screenshots and videos

Use the existing capture skills:

**Screenshots** — add mapping to `.claude/skills/capture-screenshots/capture.py` `SCREENSHOT_MAP`, then:
```bash
/tmp/imgtools/bin/python3 .claude/skills/capture-screenshots/capture.py <screenshot-id>
```

**Videos** — add mapping to `.claude/skills/capture-videos/capture_video.py` `VIDEO_MAP`, then:
```bash
/tmp/imgtools/bin/python3 .claude/skills/capture-videos/capture_video.py <video-id>
```

Copy captured assets to the docs workspace:
```bash
cp /Users/klim/Projects/popapp/docs/public/images/<file>.png <docs-workspace>/public/images/
cp /Users/klim/Projects/popapp/docs/public/videos/<file>.mp4 <docs-workspace>/public/videos/
```

### Step 4 — Create or update the MDX page

Docs pages live at `<docs-workspace>/pages/components/<component-name>.mdx`.

**MDX page template:**

```mdx
import { PreviewImage } from '../../components/preview-image'
import { PreviewVideo } from '../../components/preview-video'

# ComponentName

One-sentence description of what it does and key features.

- **Tier X** — dependency summary
- **npm deps:** `package-a`, `package-b` (if any external deps)
- **Registry deps:** [Theme](/theme), [OtherComponent](/components/other-component)
- **Platforms:** iOS, Android

` ``bash [Terminal]
npx popapp add component-name
` ``

## Usage

<PreviewVideo src="/videos/component-name.mp4" />
<!-- or for static: -->
<PreviewImage src="/images/component-name.png" alt="Component name" />

` ``tsx
import { ComponentName } from "@/components/ui/component-name";

<ComponentName value={value} onValueChange={setValue} />
` ``

## Variant Name

<PreviewImage src="/images/component-name-variant.png" alt="Variant" />

` ``tsx
<ComponentName variant="other" />
` ``

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Current value |
| `onValueChange` | `(v: number) => void` | — | Change handler |
```

**Conventions:**
- Import only `PreviewImage` and/or `PreviewVideo` as needed
- Asset paths are absolute: `/images/foo.png`, `/videos/foo.mp4`
- Place `<PreviewImage>` or `<PreviewVideo>` immediately above the code example for that section
- Use `:::tip`, `:::note`, `:::warning` callouts sparingly
- Props table: 4 columns (Prop, Type, Default, Description)
- Code blocks: ` ```tsx ` for React, ` ```bash [Terminal] ` for CLI
- No YAML frontmatter
- Use animated video previews for gesture-based or animated components
- Use static image previews for layout/state-based components

### Step 5 — Update SKILL.md tables

Add new entries to the relevant capture skill's `SKILL.md`:
- `.claude/skills/capture-screenshots/SKILL.md` — "Available screenshot IDs" table
- `.claude/skills/capture-videos/SKILL.md` — "Available video IDs" table

### Step 6 — Verify

Check the docs page renders correctly:
```bash
# Quick visual check of captured assets
open <docs-workspace>/public/images/<component>.png
open <docs-workspace>/public/videos/<component>.mp4
```

---

## Prerequisites

- iPhone simulator must be booted and running the example app
- Python venv with Pillow at `/tmp/imgtools/` (create if missing: `python3 -m venv /tmp/imgtools && /tmp/imgtools/bin/pip install Pillow`)
- ffmpeg installed (`brew install ffmpeg`) — only needed for video capture

Check simulator:
```bash
xcrun simctl list devices booted
```

---

## Checklist

When updating docs for a component, ensure:

- [ ] Component source read and understood (`registry/components/<name>.tsx`)
- [ ] Screenshot entries exist in `example/src/app/screenshot.tsx` for each visual state
- [ ] Animated entries (prefixed `anim-`) exist for gesture/animated components
- [ ] Entries registered in capture script(s) (`SCREENSHOT_MAP` / `VIDEO_MAP`)
- [ ] Screenshots/videos captured and copied to docs workspace
- [ ] MDX page exists at `<docs>/pages/components/<name>.mdx`
- [ ] MDX page has correct imports, description, tier, deps, install command
- [ ] Each section has a preview (image or video) above its code example
- [ ] Props table is complete and matches the component's actual interface
- [ ] Capture skill SKILL.md tables updated with new IDs
