# haak3 Standard Conformance

Standard:
https://github.com/ChristianHaake/DEV-Memory/tree/main/standards/haak3-webapps

Standard version: `1.1.0-draft`

Last reviewed: `2026-11-26` (redesign implementation; release checks remain open)

## App-Specific Decisions

- Prompter remains a Vanilla TypeScript app. The workflow is small enough that a
  framework would add more surface than value.
- User content is stored only in `localStorage` and user-exported `.prompter`
  files. IndexedDB is not needed because the app does not manage images or large
  project archives.
- Project imports use JSON schema version `1.0`; new optional display fields
  default safely so older valid project files still open.
- Pitch-history CSV export is a local browser download. No history data is sent
  to an app backend.
- The editor, preview, and presentation use the existing Vanilla TypeScript
  views. The mobile layout puts text entry before settings, while the desktop
  layout retains the two-column workspace.
- The existing logo and stored project theme identifiers remain unchanged.
  Shell colors use the standard's neutral and orange semantic roles.
- CSV column names and status values remain stable machine-readable identifiers
  in every language; only the app's export control and surrounding text are
  localized. Changing CSV columns would break existing consumers.

## Exceptions and Release Gaps

```text
Rule: Full release accessibility review should include manual screen-reader checks.
Reason: Automated and keyboard-path tests can run locally, but manual screen-reader validation has not been recorded.
Scope: Primary editor, import errors, undo status, analytics, preview controls, presentation controls
Temporary or permanent: Temporary
Review date: Before public production release
```

```text
Rule: Terms, imprint, privacy notice, and their translations require operator review.
Reason: The AGB route contains a marked draft; imprint/privacy now use apps@haak3.de, but the operator must review their content and the privacy notice carries an older date.
Scope: All five language versions of AGB, imprint, and privacy; no production release before approval.
Temporary or permanent: Temporary
Review date: Before production release
```

```text
Rule: Browser and device validation must separate test harness failures from app behavior.
Reason: Local Playwright Firefox on this macOS host fails to start its plugin-container with Operation not permitted. Playwright WebKit reports an internal error on offline navigation; that one automated check is skipped for WebKit.
Scope: Firefox local run and Safari/WebKit offline navigation. Chromium and WebKit online flows run in Playwright; Firefox CI and real Safari/Firefox still need confirmation.
Temporary or permanent: Temporary
Review date: Before production release
```

```text
Rule: PWA installability and offline behavior should be checked on target devices.
Reason: PWA manifest and service worker are configured, but device install prompts and offline behavior still need manual browser validation.
Scope: PWA install and offline usage
Temporary or permanent: Temporary
Review date: Before public production release
```
