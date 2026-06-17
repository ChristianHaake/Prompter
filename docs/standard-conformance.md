# haak3 Standard Conformance

Standard:
https://github.com/ChristianHaake/haak3-webapp-standard

Standard version: `1.0.0-draft`

Last reviewed: `2026-06-17`

## App-Specific Decisions

- Prompter remains a Vanilla TypeScript app. The workflow is small enough that a
  framework would add more surface than value.
- User content is stored only in `localStorage` and user-exported `.prompter`
  files. IndexedDB is not needed because the app does not manage images or large
  project archives.
- Project imports use JSON schema version `1.0` and reject unsupported future
  versions.

## Exceptions and Release Gaps

```text
Rule: Full release accessibility review should include manual screen-reader checks.
Reason: Automated and keyboard-path tests can run locally, but manual screen-reader validation has not been recorded.
Scope: Primary editor, import errors, reset confirmation, presentation controls
Temporary or permanent: Temporary
Review date: Before public production release
```

```text
Rule: PWA installability and offline behavior should be checked on target devices.
Reason: PWA manifest and service worker are configured, but device install prompts and offline behavior still need manual browser validation.
Scope: PWA install and offline usage
Temporary or permanent: Temporary
Review date: Before public production release
```
