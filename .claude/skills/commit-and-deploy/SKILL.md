---
name: commit-and-deploy
description: Review all staged/unstaged git changes, create a descriptive commit, build the registry, push to main, and verify GitHub Pages deployment. Use after making changes to the PopApp UI registry.
---

# PopApp UI — Commit & Deploy Skill

You are committing changes and deploying the **PopApp UI registry**.

**Registry repo:** `/Users/klim/Projects/popapp/ui`
**GitHub:** `popapp-ai/ui`
**Published at:** `https://popapp-ai.github.io/ui`

---

## Step 1 — Review all changed files

Run `git status` and `git diff` (both staged and unstaged) to understand what changed:

```bash
cd /Users/klim/Projects/popapp/ui
git status
git diff
git diff --cached
```

Categorize the changes:
- **New components/files** — added to registry
- **Modified components** — bug fixes, enhancements, refactors
- **Renamed/moved files** — restructuring
- **Config changes** — `registry.json`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`
- **New templates** — added to `registry/templates/`
- **New utils/hooks** — added to `registry/utils/` or `registry/hooks/`
- **Example app changes** — added/modified `example/` files
- **Skill/tooling changes** — `.claude/skills/`, scripts, etc.

---

## Step 2 — Run TypeScript check

```bash
cd /Users/klim/Projects/popapp/ui && npx tsc --noEmit
```

Fix any errors before proceeding.

---

## Step 3 — Build the registry

```bash
cd /Users/klim/Projects/popapp/ui && pnpm build:registry
```

Verify the build succeeds and all components are listed in the output.

---

## Step 4 — Craft a descriptive commit message

Based on the changes identified in Step 1, write a commit message following conventional commits:

### Commit type selection

| Type | When to use |
|------|------------|
| `feat` | New components, new features, new templates, new utilities |
| `fix` | Bug fixes, corrections to existing components |
| `refactor` | Code restructuring without behavior change (renames, moves) |
| `chore` | Config changes, dependency updates, tooling changes |
| `docs` | Documentation-only changes (README, CLAUDE.md, skills) |

### Message format

```
type: concise summary of changes

- Detail 1: what was added/changed/fixed
- Detail 2: what was added/changed/fixed

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### Examples

For adding multiple new components:
```
feat: add onboarding system, list component, animated-content, screen layout

- Add onboarding flow components (context, engine, layout, progress-bar, screen, store)
- Add list component with section support
- Add animated-content for enter/exit animations
- Add screen component for consistent page layouts
```

For fixes across multiple files:
```
fix: update button variants, fix card padding, improve ticker animation

- Button: add outline variant, fix disabled state
- Card: correct padding on compact mode
- Ticker: smooth animation on Android
```

### Rules

- If there are both new files AND modifications, prefer `feat` if new files are the primary change
- List the most important changes first
- Keep the summary line under 72 characters
- Group related changes in the detail lines
- Mention renames explicitly (e.g., "Rename touchable-scale to touchable")

---

## Step 5 — Stage and commit

Stage only relevant files. Never stage `node_modules/`, `.env`, or `public/` (gitignored).

```bash
cd /Users/klim/Projects/popapp/ui

# Stage all relevant changes
git add <files...>

# Commit with the crafted message
git commit -m "$(cat <<'EOF'
type: summary

- details
EOF
)"
```

### What to commit

- `registry/` — component, hook, util, theme, and template files
- `registry.json` — registry manifest
- `README.md` — if component tables were updated
- `package.json` and `pnpm-lock.yaml` — only if dependencies changed
- `pnpm-workspace.yaml` — only if workspace config changed
- `example/` — example app files
- `.claude/skills/` — skill definitions
- `scripts/` — build/tooling scripts

### What NOT to commit

- `public/` — gitignored, built by CI
- `node_modules/` — gitignored
- `.env` or secrets

---

## Step 6 — Push to main

```bash
cd /Users/klim/Projects/popapp/ui && git push origin main
```

---

## Step 7 — Verify GitHub Pages deployment

Watch the deployment:

```bash
cd /Users/klim/Projects/popapp/ui && gh run list --limit 1 --json databaseId --jq '.[0].databaseId' | xargs -I{} gh run watch {}
```

After deployment succeeds, verify the registry is live:

```bash
curl -s https://popapp-ai.github.io/ui/r/index.json | python3 -m json.tool | grep '"name"' | wc -l
```

---

## Checklist

- [ ] `git status` and `git diff` reviewed — all changes understood
- [ ] `npx tsc --noEmit` passes
- [ ] `pnpm build:registry` succeeds
- [ ] Commit message accurately describes all changes
- [ ] Only relevant files staged (no `public/`, `node_modules/`, `.env`)
- [ ] Changes pushed to `main`
- [ ] GitHub Actions deployment succeeded
- [ ] Registry accessible at `https://popapp-ai.github.io/ui/r/index.json`
