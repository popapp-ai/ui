import React from "react";

import { useRouter } from "expo-router";
import { useTheme } from "@popapp/theme/use-theme";
import { Screen, ScreenHeader, ScreenContent } from "@popapp/components/screen";
import { ActionIcon } from "@popapp/components/action-icon";
import { Markdown } from "@popapp/components/markdown";
import { Card, CardHeader, CardTitle, CardContent } from "@popapp/components/card";

import { Separator } from "@popapp/components/separator";
import { DemoSection } from "@/components/demo-section";

const RELEASE_NOTES = `## What's New in v2.4.0

We've been working hard on this release. Here are the highlights:

### New Features

- **Dark Mode**: Full system-level dark mode support across all screens
- **Offline Mode**: Access your recent documents without internet
- **Quick Actions**: Long-press the app icon for shortcuts

### Improvements

- Faster loading times (up to \`40%\` improvement)
- Reduced memory usage on older devices
- Better accessibility with VoiceOver support

### Bug Fixes

- Fixed crash when opening large files
- Resolved sync issues with iCloud
- Corrected date formatting in Asian locales

---

*Thank you for using our app!*`;

const API_DOCS = `## Authentication

All API requests require a Bearer token in the \`Authorization\` header:

\`\`\`
Authorization: Bearer sk_live_abc123...
\`\`\`

### Rate Limits

| Plan | Requests/min | Burst |
|------|-------------|-------|
| Free | 60 | 10 |
| Pro | 600 | 100 |
| Team | 6000 | 1000 |

### Example Request

\`\`\`json
{
  "model": "gpt-4",
  "messages": [
    {"role": "user", "content": "Hello!"}
  ],
  "temperature": 0.7
}
\`\`\`

> **Note**: Always use HTTPS for API calls. HTTP requests will be rejected.`;

const HELP_ARTICLE = `# Getting Started

Welcome to the app! Here's how to get set up:

1. **Create an account** using your email or sign in with Apple
2. **Set up your profile** with a photo and display name
3. **Connect your accounts** to sync data across devices

## Tips & Tricks

- Use **swipe gestures** to quickly navigate between screens
- *Double-tap* the tab bar to scroll to top
- Hold the \`+\` button to access templates

### Keyboard Shortcuts

- \`Cmd + N\`: New document
- \`Cmd + S\`: Save
- \`Cmd + Shift + F\`: Search everything`;

export default function ContentScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <ScreenHeader
        title="Markdown"
        leftSection={<ActionIcon name="chevron.left" onPress={() => router.back()} />}
      />
      <ScreenContent>
        {/* ── Real-world: Release Notes ───────────────────────── */}
        <DemoSection title="In Context" description="Release notes rendered with Markdown">
          <Card>
            <CardContent>
              <Markdown>{RELEASE_NOTES}</Markdown>
            </CardContent>
          </Card>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── API Documentation ───────────────────────────────── */}
        <DemoSection title="API Documentation" description="Technical docs with code blocks and tables">
          <Markdown>{API_DOCS}</Markdown>
        </DemoSection>

        <Separator style={{ marginBottom: 24 }} />

        {/* ── Help Article ────────────────────────────────────── */}
        <DemoSection title="Help Article" description="Onboarding guide with numbered lists">
          <Markdown>{HELP_ARTICLE}</Markdown>
        </DemoSection>
      </ScreenContent>
    </Screen>
  );
}