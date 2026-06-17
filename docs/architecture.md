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
  `src/PresentationView.ts`.
- Markdown: `marked` plus `DOMPurify` for bundled content pages and presentation
  text rendering.
- PWA: `vite-plugin-pwa` with generated service worker and local app icons.
- Tests: Vitest for store/import behavior and Playwright for browser smoke
  workflows.

Vanilla TypeScript is sufficient because the application has one compact editor,
one presentation view, and a small local store.

## Source Structure

- `src/main.ts`: shell routing, Markdown content pages, and view mounting.
- `src/store.ts`: app state, localStorage persistence, project validation, import
  and reset behavior.
- `src/EditorView.ts`: editor UI, import/export/reset controls, project form.
- `src/PresentationView.ts`: prompter playback, countdown, fullscreen, keyboard
  controls, progress and timing.
- `content/`: bundled Markdown pages for help, about, privacy, and imprint.
- `tests/`: Vitest unit tests and Playwright browser tests.

## State

The active project is held in memory by the `Store` class and persisted to
`localStorage` after project updates.

- Storage key: `prompter_project_v1`
- Project schema version: `1.0`
- Durable backup: user-exported `.prompter` JSON file
- Reset behavior: "Lokale Daten zurücksetzen" removes the localStorage entry and
  restores the default project in memory.

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
- Duration, font size, line height, and speed are clamped to application limits.

Failed imports preserve the current project.

## Network and Privacy

The app has no application backend and no runtime third-party assets. Production
CSP uses `connect-src 'none'`, so user-created content is not sent to an app
server by the application code.

The production site is served through Cloudflare Pages. Cloudflare receives
technical request metadata, and Cloudflare Web Analytics is documented on the
privacy page. User-created project content remains local to the browser unless a
user exports or imports a local `.prompter` file.

## Deployment

The app targets Cloudflare Pages.

- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback: Vite PWA uses `navigateFallback: /index.html`
- Headers: `public/_headers`
- Cache policy: HTML revalidates; fingerprinted assets are immutable.

## Decisions and Exceptions

Current known release gaps are documented in
`docs/standard-conformance.md`. No backend or account system is planned.
