#!/usr/bin/env python3
"""
Screenshot capture pipeline for PopApp UI docs.
Usage: python3 capture.py [screenshot_id ...]
If no IDs given, captures all defined screenshots.
"""

import subprocess
import sys
import time
from PIL import Image
from pathlib import Path

DOCS_IMAGES = Path("/Users/klim/Projects/popapp/docs/public/images")
TMP = Path("/tmp/popapp-screenshots")
TMP.mkdir(exist_ok=True)

# Map screenshot ID → output filename
SCREENSHOT_MAP = {
    "card": "card.png",
    "badge-variants": "badge-variants.png",
    "button-variants": "button-variants.png",
    "button-sizes": "button-sizes.png",
    "button-variants-full-width": "button-variants-full-width.png",
    "input-states": "input-states.png",
    "input-variants": "input-variants.png",
    "input-with-icons": "input-with-icons.png",
    "input-sizes": "input-sizes.png",
    "textarea-states": "textarea-states.png",
    "textarea-variants": "textarea-variants.png",
    "textarea-error": "textarea-error.png",
    "input-otp": "input-otp.png",
    "input-stepper": "input-stepper.png",
    "action-icons-variations": "action-icons-variations.png",
    "action-icon-variants": "action-icon-variants.png",
    "action-icon-sizes": "action-icon-sizes.png",
    "theme-icons-variations": "theme-icons-variations.png",
    "option-group-single-select": "option-group-single-select.png",
    "option-group-multi-select": "option-group-multi-select.png",
    "skeleton": "skeleton.png",
    "progress-ring": "progress-ring.png",
    "ticker": "ticker.png",
    "list-cell-nav": "list-cell-nav.png",
    "list-cell-toggle": "list-cell-toggle.png",
    "list-cell-action": "list-cell-action.png",
    "markdown": "markdown.png",
    "date-picker-wheel": "date-picker-wheel.png",
    "slider-bar": "slider-bar.png",
    "ruler-slider": "ruller-slider.png",
}


def smart_crop(input_path: Path, output_path: Path, padding: int = 60):
    """Crop top/bottom whitespace, keeping full width.

    Uses a two-pass approach: first a sensitive pass (threshold=2) to catch
    subtle edges like Liquid Glass shadows, then adds padding beyond that.
    This prevents overcropping translucent components.
    """
    img = Image.open(input_path)
    w, h = img.size
    pixels = img.load()

    # Threshold of 2 catches Liquid Glass shadows/borders that are nearly white.
    # Scanning every 3rd pixel horizontally for speed while still catching subtle edges.
    threshold = 2

    # Find first non-white row (skip status bar, top 190px)
    top = 190
    for y in range(190, h):
        for x in range(0, w, 3):
            r, g, b = pixels[x, y][:3]
            if abs(r - 255) > threshold or abs(g - 255) > threshold or abs(b - 255) > threshold:
                top = max(190, y - padding)
                break
        else:
            continue
        break

    # Find last non-white row (skip home indicator, bottom 100px)
    bottom = h - 100
    for y in range(h - 100, 0, -1):
        for x in range(0, w, 3):
            r, g, b = pixels[x, y][:3]
            if abs(r - 255) > threshold or abs(g - 255) > threshold or abs(b - 255) > threshold:
                bottom = min(h, y + padding)
                break
        else:
            continue
        break

    cropped = img.crop((0, top, w, bottom))
    cropped.save(output_path)
    return w, bottom - top


def capture(screenshot_id: str, filename: str):
    """Deep link → screenshot → crop → save to docs."""
    raw = TMP / f"{screenshot_id}-raw.png"
    output = DOCS_IMAGES / filename

    # Navigate
    subprocess.run(
        ["xcrun", "simctl", "openurl", "booted", f"popapp-demo:///screenshot?id={screenshot_id}"],
        check=True,
    )
    time.sleep(1.5)

    # Screenshot
    subprocess.run(
        ["xcrun", "simctl", "io", "booted", "screenshot", str(raw)],
        check=True, capture_output=True,
    )

    # Crop
    w, h = smart_crop(raw, output)
    print(f"  ✓ {filename} ({w}x{h})")


def main():
    ids = sys.argv[1:] if len(sys.argv) > 1 else list(SCREENSHOT_MAP.keys())

    print(f"Capturing {len(ids)} screenshots...")
    for sid in ids:
        if sid not in SCREENSHOT_MAP:
            print(f"  ✗ Unknown ID: {sid}")
            continue
        capture(sid, SCREENSHOT_MAP[sid])

    print("Done!")


if __name__ == "__main__":
    main()
