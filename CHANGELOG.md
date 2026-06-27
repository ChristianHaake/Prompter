# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

No unreleased changes yet.

## [1.0.0] - 2026-06-27

### Added
- Local-first editor for short scripts with autosave, word count, character
  count, estimated reading time, and a default example pitch.
- Markdown rendering for script and content pages with support for headings,
  lists, separators, emphasis, and line breaks.
- Timer presets for 60, 90, and 120 seconds plus custom target durations.
- Preview mode that uses the presentation typography without starting a run,
  requesting Wake Lock, entering fullscreen, or writing pitch-history records.
- Presentation mode with automatic scrolling, optional countdown, live speed
  controls, progress display, end signal, fullscreen support, section jumps, and
  optional screen Wake Lock.
- Display controls for font size, line height, font family, light/dark/high
  contrast themes, Prompter color theme, focus line, focus-line position, and
  mirror mode.
- Local `.prompter` project open/save flow with schema validation, size limits,
  field coercion, and import failure handling that preserves current work.
- Direct `.txt` and `.md` script import.
- Local pitch history with completed/cancelled status, target duration, actual
  duration, word count, capped storage, CSV export, and analytics for average
  pace, fastest/slowest runs, timing deviation, and recent trend.
- Undo flow for destructive project reset and pitch-history clear actions.
- German/English UI with help, about, privacy, imprint, and teachers content
  pages.
- PWA manifest, app icons, generated service worker, and app-shell offline
  fallback coverage.
- Cloudflare static-assets deployment configuration and production headers.

### Changed
- Standardized visible product identity, package metadata, documentation, and
  app shell around `Prompter`.
- Reworked the app shell so editor, preview, presentation, and static content
  pages mount cleanly from the same Vanilla TypeScript runtime.
- Hardened project and history persistence around versioned localStorage keys.
- Mirrored production Content Security Policy into local production-preview
  testing.
- Normalized legacy default playback speeds to the current 5.0x default.

### Security
- Sanitized Markdown with `DOMPurify` after `marked` rendering.
- Added strict import validation for JSON project files and bounded imported
  text size.
- Sanitized downloaded project filenames.
- Hardened CSV export against spreadsheet formula injection.
- Documented local-only content handling and Cloudflare/Web Analytics behavior
  in privacy content and README.

### Verification
- Added Vitest coverage for store persistence, import validation, undo behavior,
  pitch history, analytics, and CSV export.
- Added Playwright smoke coverage for the editor workflow, production-preview
  headers, PWA manifest/service worker, and app-shell offline fallback.
- Wired `npm run verify` as the release gate for lint, typecheck, unit tests,
  production dependency audit, build, and Playwright checks.

### Known release gaps
- Manual target-device checks, manual screen-reader review, PWA installability,
  and installed-app offline validation remain tracked in
  `docs/manual-release-checks.md`.
