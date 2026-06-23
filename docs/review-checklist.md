# Release Review

Checklist source:
https://github.com/ChristianHaake/haak3-webapp-standard/blob/main/docs/review-checklist.md

## Release

- Version: `1.0.0-phased-v1`
- Review date: `2026-06-23`
- Reviewer: Codex

## Results

- [x] Intended users and educational purpose are explicit.
- [x] Core workflow works without login.
- [x] Autosave, project open/save, preview, and reset behavior are implemented.
- [x] Destructive reset/history-clear actions expose an undo path.
- [x] Imported projects are validated before replacing state.
- [x] Failed imports preserve current work.
- [x] Footer links to help, about, privacy, imprint, and GitHub.
- [x] Markdown content is sanitized before rendering.
- [x] Pitch history analytics and CSV export are local browser features.
- [x] Build, lint, typecheck, unit tests, and Playwright smoke tests are wired
  through `npm run verify`.
- [x] Production dependency audit is wired through `npm run verify`.
- [x] Playwright smoke tests run against production preview headers.
- [x] Playwright smoke tests cover PWA manifest, generated service worker, and
  app-shell offline fallback.
- [x] PWA manifest and local PNG icons are configured with correct pixel sizes.
- [x] Production precache avoids oversized or unreferenced public image assets.
- [x] Service worker, Workbox runtime, registration script, manifest, and
  favicon revalidate instead of relying on long-lived edge cache.
- [x] CI runs the same `npm run verify` gate used locally.
- [ ] Mobile and tablet workflow manually tested on target devices.
- [ ] Manual screen-reader check completed.
- [x] Legal and privacy content populated from the operator's existing
  Feedbackbogen-Generator imprint/privacy reference.
- [x] Production hosting provider, live URL, analytics status, and retention
  details documented.
- [ ] PWA installability and offline behavior manually checked in production-like
  browser conditions.

## Notes

This pass fixes the previously known prototype gaps: import/editor state drift,
stubbed tests, mobile overflow in core controls, dead header controls, missing
reset behavior, weak project validation, placeholder product documentation,
wrong word-count parsing, stale E2E selectors, and oversized PWA image assets.

Manual checks are specified in `docs/manual-release-checks.md`.

Current production build precaches 10 referenced app-shell entries at about
171 KB and avoids the old unused icon sprite.

This pass adds preview mode, display customization, undo safeguards, analytics,
CSV history export, markdown presentation styling, and keyboard section jumps.

The app still needs manual device, PWA install, installed-app offline, 200% zoom,
high contrast, and screen-reader checks before a full release sign-off.
