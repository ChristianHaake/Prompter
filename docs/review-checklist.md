# Release Review

## Redesign 1.1.0 — 2026-11-26

- [x] Core editor, local project format, import failure recovery, history, CSV,
  presentation, and offline Chromium shell remain covered by browser tests.
- [x] Five language dictionaries have matching typed keys. Browser tests exercise
  localized core actions, save/error states, project/CSV exports, and every
  content route in each language while preserving an edited draft.
- [x] Support links internally; external provider links open safely. The footer
  exposes help, examples, about, AGB, imprint, privacy, and haak3 attribution.
- [x] Mobile text entry precedes settings in document order. Shell links wrap
  instead of forcing horizontal scrolling; central shell controls have 44px
  targets.
- [x] `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`,
  `npm run audit`, Chromium Playwright (desktop/mobile), and WebKit Playwright
  (online tests) passed locally.
- [x] Firefox browser tests passed in Linux CI. Local macOS Firefox still fails
  in its `plugin-container` before the first page loads.
- [ ] Manual screen-reader, 200% zoom, contrast, reduced-motion, real phone and
  tablet, PWA install/offline, and export-artifact checks are recorded on Stage.
- [x] The operator approved `apps@haak3.de` as contact address for imprint and
  privacy notices.
- [ ] AGB, privacy, imprint, and translations are reviewed by the operator;
  the privacy notice date is updated.
- [x] Stage route and full browser smoke test are recorded. Worker version
  `17ce622f-5254-4372-9c4c-a8b476c98cf0` served all five language workflows;
  104 Chromium, mobile Chromium, and WebKit tests passed against the live Stage
  domain, with one known WebKit offline skip.
- [x] PR review and Linux CI passed. The current PR head passed 139 browser tests
  with one known WebKit offline skip in
  [run 45906186726](https://github.com/ChristianHaake/Prompter/actions/runs/45906186726).
- [x] Previous Stage Worker version
  `04d26a77-873b-4977-9016-ab008297e657` is recorded as the Stage rollback
  target.
- [ ] The exact production rollback artifact is recorded before production
  deployment.

Stage deployment completed on 2026-11-26; device results and operator approval
remain to be recorded. GitHub Actions was enabled for the repository on
2026-11-26, restricted to GitHub-owned actions. The first Linux run exposed a
Firefox manifest-download test issue and a WebKit timing assumption; both test
cases were corrected and the next CI run passed.

Cloudflare inserts a challenge precursor inline script into the Stage HTML.
The enforced CSP blocks that script; the app's scripts remain external. The
live-domain test checks that this is the only inline script, that its execution
is blocked, and that no other enforced CSP violation occurs. Cloudflare
report-only messages are not treated as blocked app behavior. A real Cloudflare
challenge flow has not been validated; if one is enabled for visitors, it needs
a separate Stage check before production.

Rollback source baseline: `c5b16b3` on `main`, with compatible
`prompter_project_v1`, `prompter_pitch_history_v1`, and `.prompter` schema 1.0.
The exact deployable rollback artifact must be recorded at release time.

### Reproduce the automated checks

```bash
npm run lint
npm run typecheck
npm run test
npm run audit
npm run build
npx playwright test --project=chromium --project=mobile-chromium
npx playwright test --project=webkit
npx playwright test --project=firefox
```

The WebKit offline-navigation test is skipped because Playwright WebKit reports
an internal error at `page.goto` while offline. This is a test-harness limit,
not evidence that installed Safari works offline. Stage device testing remains
required.

## Previous release review

Checklist source:
https://github.com/ChristianHaake/DEV-Memory/blob/main/standards/haak3-webapps/docs/review-checklist.md

## Release

- Version: `1.0.1`
- Review date: `2026-07-21`
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

Release 1.0.1 includes the full local-first Prompter workflow: editor autosave,
validated project open/save, `.txt`/`.md` script import, preview mode,
presentation mode, display customization, undo safeguards, pitch-history
analytics, CSV export, Markdown presentation styling, keyboard controls, PWA
shell, Cloudflare static-asset deployment wiring, Cloudflare Web Analytics CSP
alignment, runtime/layout fixes, and a school-oriented Photosynthesis example
project in `docs/examples/`.

Manual checks are specified in `docs/manual-release-checks.md`.

The app still needs manual device, PWA install, installed-app offline, 200% zoom,
high contrast, and screen-reader checks before a full release sign-off.
