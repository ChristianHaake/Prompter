# Release Review

Checklist source:
https://github.com/ChristianHaake/haak3-webapp-standard/blob/main/docs/review-checklist.md

## Release

- Version: `1.0.0-quality-pass`
- Review date: `2026-06-17`
- Reviewer: Codex

## Results

- [x] Intended users and educational purpose are explicit.
- [x] Core workflow works without login.
- [x] Autosave, project import/export, and reset behavior are implemented.
- [x] Imported projects are validated before replacing state.
- [x] Failed imports preserve current work.
- [x] Footer links to help, about, privacy, imprint, and GitHub.
- [x] Markdown content is sanitized before rendering.
- [x] Build, lint, typecheck, unit tests, and Playwright smoke tests are wired
  through `npm run verify`.
- [x] Production dependency audit is wired through `npm run verify`.
- [x] Playwright smoke tests run against production preview headers.
- [x] PWA manifest and local PNG icons are configured with correct pixel sizes.
- [x] Production precache avoids oversized public image assets.
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

Current production build precaches 16 entries at about 681 KB.

The app still needs manual device, PWA install, offline, and screen-reader
checks before a full release sign-off.
