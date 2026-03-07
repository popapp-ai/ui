#!/usr/bin/env python3
"""
Video capture pipeline for PopApp UI docs.
Records animated component demos from the iOS simulator and produces
cropped, loopable MP4 videos for documentation.

Usage: python3 capture_video.py [video_id ...]
If no IDs given, captures all defined videos.
"""

import subprocess
import sys
import signal
import time
from pathlib import Path

DOCS_VIDEOS = Path("/Users/klim/Projects/popapp/docs/public/videos")
DOCS_VIDEOS.mkdir(exist_ok=True)
TMP = Path("/tmp/popapp-videos")
TMP.mkdir(exist_ok=True)

# Map video ID → (output filename, duration in seconds)
VIDEO_MAP = {
    "anim-progress-ring": ("progress-ring.mp4", 3.0),
    "anim-ticker": ("ticker.mp4", 5.0),
    "anim-skeleton": ("skeleton.mp4", 3.0),
}


def get_crop_bounds(screenshot_path: Path, threshold: int = 2, padding: int = 60):
    """Analyze a screenshot to find content bounds for cropping.
    Returns (top, bottom) pixel coordinates."""
    from PIL import Image

    img = Image.open(screenshot_path)
    w, h = img.size
    pixels = img.load()

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

    return top, bottom, w, h


def capture_video(video_id: str, filename: str, duration: float):
    """Record animated component: start recording first, then trigger animation."""
    raw_video = TMP / f"{video_id}-raw.mov"
    raw_screenshot = TMP / f"{video_id}-bounds.png"
    output = DOCS_VIDEOS / filename

    # Remove stale raw video
    raw_video.unlink(missing_ok=True)

    # Navigate to the animated entry itself to get crop bounds.
    # The animation will start, but we only need one frame for bounds.
    subprocess.run(
        ["xcrun", "simctl", "openurl", "booted", f"popapp-demo:///screenshot?id={video_id}"],
        check=True,
    )
    time.sleep(2.0)  # let animation play so content is fully visible

    # Take screenshot for crop bounds
    subprocess.run(
        ["xcrun", "simctl", "io", "booted", "screenshot", str(raw_screenshot)],
        check=True, capture_output=True,
    )
    top, bottom, w, h = get_crop_bounds(raw_screenshot)
    crop_h = bottom - top

    # Start recording FIRST, before triggering the animation
    rec_proc = subprocess.Popen(
        ["xcrun", "simctl", "io", "booted", "recordVideo", "--codec=h264", str(raw_video)],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE,
    )
    time.sleep(0.5)  # let recorder initialize

    # Now navigate to the animated entry — animation starts on mount
    subprocess.run(
        ["xcrun", "simctl", "openurl", "booted", f"popapp-demo:///screenshot?id={video_id}"],
        check=True,
    )

    # Wait for the animation to play out
    time.sleep(duration)

    # Stop recording (send SIGINT like Ctrl+C)
    rec_proc.send_signal(signal.SIGINT)
    rec_proc.wait(timeout=10)

    if not raw_video.exists():
        print(f"  ✗ {filename} — recording failed")
        return

    # Crop video with ffmpeg: remove status bar and home indicator area
    # The simulator records at device resolution, same as screenshots
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-i", str(raw_video),
            "-vf", f"crop={w}:{crop_h}:0:{top}",
            "-c:v", "libx264",
            "-preset", "slow",
            "-crf", "22",
            "-pix_fmt", "yuv420p",
            "-an",  # no audio
            "-movflags", "+faststart",  # web-friendly
            str(output),
        ],
        check=True, capture_output=True,
    )

    # Get file size
    size_kb = output.stat().st_size / 1024
    print(f"  ✓ {filename} ({w}x{crop_h}, {duration}s, {size_kb:.0f}KB)")


def main():
    ids = sys.argv[1:] if len(sys.argv) > 1 else list(VIDEO_MAP.keys())

    print(f"Capturing {len(ids)} videos...")
    for vid in ids:
        if vid not in VIDEO_MAP:
            print(f"  ✗ Unknown ID: {vid}")
            continue
        filename, duration = VIDEO_MAP[vid]
        capture_video(vid, filename, duration)

    print("Done!")


if __name__ == "__main__":
    main()
