# Architecture

## Product

- App: `Prompter`
- Live URL: `https://prompter.haak3.de`
- Repository: `https://github.com/ChristianHaake/Prompter`
- Intended users: people preparing pitches, classroom presentations, workshop
  talks, and short scripted recordings.

Prompter is a local-first teleprompter. The core workflow is editing text,
configuring presentation settings, and running a browser-based scrolling
prompter.

## Stack

- Runtime: static browser app, no backend.
- Build: Vite with Vanilla TypeScript.
- Rendering: direct DOM components in `src/EditorView.ts` and
  mode-aware `src/PresentationView.ts`.
- Markdown: `marked` plus `DOMPurify` for bundled content pages and presentation
  text rendering.
- PWA: `vite-plugin-pwa` with generated service worker and local app icons.
- Tests: Vitest for store/import behavior and Playwright for browser smoke
  workflows, production-preview CSP checks, PWA manifest/service-worker checks,
  and an automated app-shell offline fallback check.

Vanilla TypeScript is sufficient because the application has one compact editor,
one presentation view, and a small local store.

## Source Structure

- `src/main.ts`: shell routing, Markdown content pages, and view mounting.
- `src/store.ts`: app state, localStorage persistence, project validation, import
  and reset behavior, undo snapshots, pitch run history.
- `src/EditorView.ts`: editor UI, text/project import, export/reset controls,
  project form, timer presets, analytics, pitch history.
- `src/PresentationView.ts`: preview and presentation rendering, countdown,
  fullscreen, keyboard controls, section navigation, progress, timing, wake lock,
  end signal, run recording.
- `src/analytics.ts`: pure pitch-history analytics and CSV export mapping.
- `content/`: bundled Markdown pages for help, about, privacy, and imprint.
- `tests/`: Vitest unit tests and Playwright browser tests.

## State

The active project is held in memory by the `Store` class and persisted to
`localStorage` after project updates.

- Storage key: `prompter_project_v1`
- Project schema version: `1.0`
- Durable backup: user-exported `.prompter` JSON file
- Reset behavior: "Neu" removes the localStorage entry and restores the default
  project in memory. The previous project can be restored from an in-memory undo
  snapshot until another edit/import or tab close occurs.

Presentation run history is held in the same store and persisted separately.

- Storage key: `prompter_pitch_history_v1`
- History schema version: `1`
- Maximum records: 50
- Recorded fields: timestamp, target duration, actual duration, word count,
  completed or cancelled status.
- Clear behavior: the editor's pitch-history clear action removes only the
  history entry, not the current project. The previous history can be restored
  from an in-memory undo snapshot until another edit/history mutation or tab
  close occurs.

Imported and restored projects are validated at runtime. Invalid files,
unsupported versions, missing title/text fields, and malformed JSON are rejected
before state replacement.

## Project Files

- Extension: `.prompter`
- Media type on export: `application/json`
- Schema version: `1.0`
- Maximum import size: 500 KB
- Maximum title length: 120 characters
- Maximum text length: 100,000 characters
- Duration, font size, line height, focus-line position, color theme, font
  family, and speed are clamped or defaulted to application limits.

Failed imports preserve the current project.

Plain `.txt` and `.md` files can be imported as script text. They are not project
files and do not bypass the same text-length clamp used by manual editor input.

## Presentation Runtime

Presentation playback uses `requestAnimationFrame` and derives scroll speed from
the configured target duration and current manual speed multiplier. Timer
presets in the editor write the same `targetDurationSeconds` project field as
manual duration input.

Preview mode uses the same sanitized Markdown rendering and typography settings
as presentation mode, but it does not start playback, request wake lock, enter
fullscreen, or record pitch history.

When a presentation reaches the end, Prompter records a completed run and plays a
short local Web Audio signal. Reset or exit after elapsed playback records a
cancelled run. The screen Wake Lock API is requested while playback is active
when the browser supports it; lack of support is ignored. Keyboard shortcuts
cover play/pause, exit, reset, speed changes, and section jumps.

## Network and Privacy

The app has no application backend and does not send user-created project
content to an app server. Production CSP allows same-origin connections for
Cloudflare hosting behavior and Cloudflare Web Analytics and is enforced in
production-preview browser tests.

The production site is served through Cloudflare as static assets from the
Vite-built `dist` directory. Cloudflare receives technical request metadata, and
Cloudflare Web Analytics is documented on the privacy page. User-created
project content remains local to the browser unless a user exports or imports a
local `.prompter` file.

## Deployment

The app targets Cloudflare static asset deployment via Wrangler.

- Build command: `npm run build`
- Output directory: `dist`
- Wrangler config: `wrangler.jsonc`
- SPA fallback: Vite PWA uses `navigateFallback: /index.html`
- Headers: `public/_headers`
- Cache policy: HTML, service worker, registration script, manifest, and
  favicon revalidate; fingerprinted assets are immutable.
- Manual device, install, and screen-reader release checks are listed in
  `docs/manual-release-checks.md`.

## Decisions and Exceptions

Current known release gaps are documented in
`docs/standard-conformance.md`. No backend or account system is planned.
