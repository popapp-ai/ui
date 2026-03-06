---
name: capture-screenshots
description: Capture component screenshots from the iOS simulator for documentation. Use when updating docs screenshots, adding new component previews, or refreshing existing images.
---

# PopApp UI — Screenshot Capture Skill

You are capturing component screenshots from the iPhone simulator and saving them to the docs site.

**Example app:** `/Users/klim/conductor/workspaces/ui/hamburg/example`
**Screenshot route:** `example/src/app/screenshot.tsx`
**Docs images:** `/Users/klim/conductor/workspaces/docs/almaty/public/images/`
**Capture script:** `.context/capture.py`
**Deep link scheme:** `popapp-demo`

---

## Prerequisites

- iPhone simulator must be booted and running the example app
- Python venv with Pillow at `/tmp/imgtools/` (create if missing)

Check simulator:
```bash
xcrun simctl list devices booted
```

Create venv if missing:
```bash
python3 -m venv /tmp/imgtools && /tmp/imgtools/bin/pip install Pillow
```

---

## Option A: Capture specific screenshots

Use the capture script with specific IDs:

```bash
/tmp/imgtools/bin/python3 .context/capture.py card badge-variants button-variants
```

This deep-links to each screenshot, captures, smart-crops (removes status bar + home indicator + whitespace), and saves to docs.

---

## Option B: Capture all screenshots

```bash
/tmp/imgtools/bin/python3 .context/capture.py
```

Captures all 24 registered screenshots.

---

## Available screenshot IDs

| ID | Output file | Component |
|---|---|---|
| `card` | `card.png` | Card with header/content/footer |
| `badge-variants` | `badge-variants.png` | All badge color variants |
| `button-variants` | `button-variants.png` | All button style variants |
| `button-sizes` | `button-sizes.png` | XS/SM/MD/LG buttons |
| `button-variants-full-width` | `button-variants-full-width.png` | Full-width button styles |
| `input-states` | `input-states.png` | TextInput: empty, filled, error, disabled |
| `input-sizes` | `input-sizes.png` | TextInput size variants |
| `textarea-states` | `textarea-states.png` | TextArea: default and error |
| `input-otp` | `input-otp.png` | OTP digit input boxes |
| `input-stepper` | `input-stepper.png` | Numeric stepper in card |
| `action-icons-variations` | `action-icons-variations.png` | ActionIcon variants and sizes |
| `theme-icons-variations` | `theme-icons-variations.png` | ThemeIcon color grid |
| `option-group-single-select` | `option-group-single-select.png` | Radio-style selection |
| `option-group-multi-select` | `option-group-multi-select.png` | Checkbox-style selection |
| `skeleton` | `skeleton.png` | Loading skeleton in card |
| `progress-ring` | `progress-ring.png` | Circular progress at 73% |
| `ticker` | `ticker.png` | Animated number display |
| `list-cell-nav` | `list-cell-nav.png` | Navigation list cells |
| `list-cell-toggle` | `list-cell-toggle.png` | Toggle switch list cells |
| `list-cell-action` | `list-cell-action.png` | Action/destructive list cells |
| `markdown` | `markdown.png` | Rendered markdown in card |
| `date-picker-wheel` | `date-picker-wheel.png` | Date picker wheels |
| `slider-bar` | `slider-bar.png` | Slider with labels |
| `ruler-slider` | `ruller-slider.png` | iOS-style ruler picker |

---

## Adding a new screenshot

### Step 1 — Add entry to screenshot.tsx

Open `example/src/app/screenshot.tsx` and add a new entry to the `SCREENSHOTS` map:

```tsx
"my-component": () => {
  const { colors } = useTheme();
  return (
    // Render JUST the component — no titles, no DemoSection, no descriptions.
    // Show the component as it would appear in a real app.
    <MyComponent prop="value" />
  );
},
```

**Rules for screenshot entries:**
- No `DemoSection` wrapper — just the raw component
- No section titles or descriptive text
- Show realistic content (real names, real data, not "Lorem ipsum")
- For variants, show them in a row/column with `styles.row` or `styles.list`
- For in-context examples, wrap in a `Card` if that's how it would be used
- Import any new components at the top of the file

### Step 2 — Add to capture script

Open `.context/capture.py` and add the mapping in `SCREENSHOT_MAP`:

```python
SCREENSHOT_MAP = {
    # ... existing entries
    "my-component": "my-component.png",
}
```

### Step 3 — Reload and capture

```bash
# Relaunch app to pick up new route content
xcrun simctl terminate booted dev.popapp.demo
sleep 1
xcrun simctl launch booted dev.popapp.demo
sleep 3

# Capture just the new screenshot
/tmp/imgtools/bin/python3 .context/capture.py my-component
```

### Step 4 — Verify

Check the output image:
```bash
open /Users/klim/conductor/workspaces/docs/almaty/public/images/my-component.png
```

The image should be:
- White background
- Component centered horizontally and vertically
- Tightly cropped (no status bar, no home indicator, minimal whitespace)
- Full device width (1260px @3x)

### Step 5 — Reference in docs

In the component's MDX file at `almaty/pages/components/my-component.mdx`:

```mdx
import { PreviewImage } from '../../components/preview-image'

<PreviewImage src="/images/my-component.png" alt="My Component" />
```

---

## How the pipeline works

1. **Deep link** — `xcrun simctl openurl booted "popapp-demo:///screenshot?id=<name>"` navigates the simulator to the screenshot route with the component rendered on a blank white background
2. **Wait** — `sleep 1.5` for render + animations to settle
3. **Capture** — `xcrun simctl io booted screenshot` takes a full simulator screenshot (1260x2736 on iPhone Air @3x)
4. **Smart crop** — Python/Pillow scans pixel rows to find content bounds:
   - Skips top 190px (status bar)
   - Skips bottom 100px (home indicator)
   - Finds first/last non-white row
   - Adds 60px padding
   - Crops to content bounds (width unchanged)
5. **Save** — Writes directly to `almaty/public/images/`

---

## Troubleshooting

**"Unmatched Route" on simulator:**
The app needs to reload to pick up new route changes:
```bash
xcrun simctl terminate booted dev.popapp.demo && sleep 1 && xcrun simctl launch booted dev.popapp.demo
```

**Pillow not available:**
```bash
python3 -m venv /tmp/imgtools && /tmp/imgtools/bin/pip install Pillow
```

**Crop looks wrong (too much/little whitespace):**
Adjust the `padding` parameter in `capture.py`'s `smart_crop()` function (default: 60px).

**Screenshot is blank white:**
The `id` param doesn't match any entry in `SCREENSHOTS`. Check spelling matches exactly.
