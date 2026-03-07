---
name: capture-videos
description: Record animated component videos from the iOS simulator for documentation. Use when adding looped animation previews for components like ProgressRing, Ticker, Skeleton, or any component with motion.
---

# PopApp UI — Video Capture Skill

You are recording animated component demos from the iPhone simulator and saving them as looped MP4 videos for the docs site.

**Example app:** `/Users/klim/Projects/popapp/ui/example`
**Screenshot route:** `example/src/app/screenshot.tsx` (animated entries prefixed with `anim-`)
**Docs videos:** `/Users/klim/Projects/popapp/docs/public/videos/`
**Capture script:** `.claude/skills/capture-videos/capture_video.py`
**Deep link scheme:** `popapp-demo`

---

## Prerequisites

- iPhone simulator must be booted and running the example app
- Python venv with Pillow at `/tmp/imgtools/` (create if missing)
- ffmpeg installed (`brew install ffmpeg`)

Check simulator:
```bash
xcrun simctl list devices booted
```

Create venv if missing:
```bash
python3 -m venv /tmp/imgtools && /tmp/imgtools/bin/pip install Pillow
```

---

## Option A: Capture specific videos

```bash
/tmp/imgtools/bin/python3 .claude/skills/capture-videos/capture_video.py anim-progress-ring anim-ticker
```

## Option B: Capture all videos

```bash
/tmp/imgtools/bin/python3 .claude/skills/capture-videos/capture_video.py
```

---

## Available video IDs

| ID | Output file | Duration | Component |
|---|---|---|---|
| `anim-progress-ring` | `progress-ring.mp4` | 3s | Ring fills 0→73% with ticker counting up |
| `anim-ticker` | `ticker.mp4` | 5s | Numbers cycle through 3 value sets |
| `anim-skeleton` | `skeleton.mp4` | 3s | Shimmer loading effect on cards |

---

## Adding a new video

### Step 1 — Add animated entry to screenshot.tsx

Open `example/src/app/screenshot.tsx` and add an entry prefixed with `anim-`. Use `useState` + `useEffect` to trigger animation on mount:

```tsx
"anim-my-component": () => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setValue(targetValue), 500);
    return () => clearTimeout(timer);
  }, []);
  return <MyComponent value={value} />;
},
```

**Rules for animated entries:**
- Prefix ID with `anim-` to distinguish from static screenshots
- Animation must be self-contained — triggered by state changes on mount
- Use `useEffect` with `setTimeout` or `setInterval` for timing
- Keep total animation under the capture duration
- No user interaction needed — everything auto-plays

### Step 2 — Add to capture script

Open `.claude/skills/capture-videos/capture_video.py` and add the mapping in `VIDEO_MAP`:

```python
VIDEO_MAP = {
    # ... existing entries
    "anim-my-component": ("my-component.mp4", 3.0),  # (filename, duration_seconds)
}
```

### Step 3 — Sync and capture

```bash
# Sync screenshot.tsx to metro-watched directory
cp example/src/app/screenshot.tsx /Users/klim/Projects/popapp/ui/example/src/app/screenshot.tsx
sleep 2

# Capture the video
/tmp/imgtools/bin/python3 .claude/skills/capture-videos/capture_video.py anim-my-component
```

### Step 4 — Verify

```bash
# Quick check with QuickTime
open /Users/klim/Projects/popapp/docs/public/videos/my-component.mp4

# Or extract a frame
ffmpeg -i /Users/klim/Projects/popapp/docs/public/videos/my-component.mp4 -ss 1.5 -vframes 1 /tmp/check.png
```

### Step 5 — Reference in docs

In the component's MDX file, use a video element with loop/autoplay:

```mdx
<video
  src="/videos/my-component.mp4"
  autoPlay
  loop
  muted
  playsInline
  style={{ width: '100%', borderRadius: 12 }}
/>
```

---

## How the pipeline works

1. **Navigate** — Deep-link to the `anim-*` entry. Wait 2s for content to render and animation to settle (used for crop bounds measurement).
2. **Measure crop bounds** — Take a screenshot and use Pillow to find content bounds (same smart crop as screenshots: threshold=2 for Liquid Glass, skip status bar/home indicator).
3. **Start recording** — `xcrun simctl io booted recordVideo --codec=h264` begins before the animation.
4. **Trigger animation** — Re-navigate to the entry, causing React to remount and the animation to restart from initial state.
5. **Wait** — Let the animation play for the specified duration.
6. **Stop** — Send SIGINT to the recording process.
7. **Crop with ffmpeg** — Apply the measured crop bounds to the video. Output H.264 MP4 with:
   - `yuv420p` pixel format (browser compatible)
   - `-an` no audio
   - `+faststart` for web streaming
   - CRF 22 quality

---

## Troubleshooting

**Video is very short / nearly empty:**
The recording process needs time to initialize. The script waits 0.5s after starting `recordVideo` before triggering the animation. If still too short, increase this delay in the script.

**Crop is wrong (content cut off):**
The bounds are measured from a screenshot of the animated entry after 2s. If the animation changes layout size (e.g., content appears later), increase the initial wait time.

**New entries not rendering:**
Copy screenshot.tsx to the metro-watched directory:
```bash
cp example/src/app/screenshot.tsx /Users/klim/Projects/popapp/ui/example/src/app/screenshot.tsx
```

**ffmpeg not found:**
```bash
brew install ffmpeg
```
