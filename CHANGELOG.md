# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-07-22

### Added
- Preview mode is now playable: it runs the auto-scroll like presentation mode
  so users can rehearse the scroll, while still skipping the countdown and never
  writing a pitch-history record. Preview gains a working play/pause and reset.

### Fixed
- Footer and section icon buttons (reset, section jump) no longer turn
  white-on-white on hover in the dark and high-contrast text themes; the hover
  state now keeps the translucent background so the glyph stays visible.

### Changed
- Preview mode no longer shows a disabled static play button; the play and reset
  controls are active, superseding the muted-disabled-button behavior from 1.0.1.
- Help content now describes the playable preview (runs, skips countdown, writes
  no pitch history).
- Privacy content refers to the actual "New"/"Neu" control instead of a
  non-existent "Reset local data" label.

### Security
- Updated `dompurify` from 3.4.11 to 3.4.12 to clear advisory GHSA-c2j3-45gr-mqc4
  (`CUSTOM_ELEMENT_HANDLING` sanitizer bypass).

## [1.0.1] - 2026-07-21

### Added
- Cloudflare Web Analytics, with the analytics domain added to the
  Content-Security-Policy and a smoke test asserting the CSP entry.
- A school-ready Photosynthesis 90-second `.prompter` example plus generated
  editor, preview, and presentation screenshots in `docs/examples/`.

### Fixed
- Removed a stray `.DS_Store` file from `public/` so macOS metadata is no
  longer copied into release builds.
- Presentation view now honors `focusLinePosition` (default 50%) instead of
  always centering the focus line, and long words wrap instead of overflowing
  the layout.
- Escape now always exits the presentation, even while a settings control is
  focused.
- Screen Wake Lock is re-acquired when the presentation tab regains
  visibility mid-run instead of staying released.
- Preview mode syncs settings changes without a full re-render, so focus and
  in-progress edits in preview settings inputs are no longer lost.
- Fixed footer no longer overlaps page content on tablet-width viewports
  (`--fixed-footer-space` is now reserved between 641px and 1024px, not just
  below 640px).
- Presentation controls no longer sit as a crisp block over the last lines of
  scrolling script text on tablet and mobile; the readable-text fade now
  scales with the actual control-bar height instead of a fixed 15%.
- The reset button icon is visible in all themes (was rendering white-on-white
  outside the themed control groups).
- The disabled state of the preview mode's static play button is now visibly
  muted instead of looking identical to an active button.
- Navigating to a content page (Help, About, Privacy, Imprint, For Teachers)
  or resetting the draft with "New" now scrolls back to the top instead of
  leaving the view stuck mid-scroll on a blank section.

### Changed
- Extracted word-counting into a reusable `countScriptWords` helper and
  removed a redundant editor `change` listener.

## [1.0.0] - 2026-06-28

### Feature names
- Script Editor for local drafting, autosave, Markdown rendering, word count,
  character count, and reading-time feedback.
- Timer Studio for 60-, 90-, and 120-second presets plus custom target
  durations.
- Live Preview for checking final Prompter typography without starting a run.
- Teleprompter Runtime for automatic scrolling, countdown, live speed changes,
  progress, fullscreen, section jumps, end signal, and optional Wake Lock.
- Readability Setup for font size, line height, font family, app theme,
  Prompter color theme, focus line, focus-line position, and Mirror Mode.
- Local Project Files for validated `.prompter` open/save plus `.txt` and `.md`
  script import.
- Pitch History & Analytics for local run records, CSV export, pace analysis,
  timing deviation, and trend.
- Recovery Flow for undoing destructive project-reset and history-clear actions.
- Multilingual App Shell with German/English UI, help, about, privacy, imprint,
  teacher guidance, local storage, and PWA support.
- Screenshot Asset Pack in `docs/screenshots/` for blog and social posts.

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
