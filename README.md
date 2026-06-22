# Prompter

Prompter ist eine browserbasierte Teleprompter-App für Pitches, Unterricht,
Workshops und kurze Präsentationen.

Die Anwendung läuft lokal im Browser. Es gibt kein Backend, keine Anmeldung und
keine serverseitige Speicherung eingegebener Inhalte.

Live application: [https://prompter.haak3.de](https://prompter.haak3.de)

## Zweck

Prompter hilft dabei, Skripte zu schreiben, als Teleprompter abzuspielen und als
editierbare Projektdatei zu sichern. Zielgruppe sind Lehrkräfte, Lernende,
Workshop-Teams und alle, die kurze Präsentationen kontrolliert vortragen wollen.

Der kürzeste Workflow:

1. Text in den Editor einfügen oder schreiben.
2. Zieldauer per Timer-Vorlage oder freiem Wert, Schriftgröße und
   Prompter-Optionen einstellen.
3. Präsentation starten und mit Leertaste, Pfeiltasten und Reset steuern.
4. Durchläufe im lokalen Pitch-Verlauf auswerten.
5. Projekt als `.prompter`-Datei exportieren, wenn ein dauerhaftes Backup nötig
   ist.

## Privacy and Storage

User-created content stays in the browser. The active project is stored in
`localStorage` under `prompter_project_v1` so the current draft survives reloads
in the same browser.

Presentation run history is stored separately under
`prompter_pitch_history_v1`. It contains timestamps, target duration, actual
duration, and whether a run was completed or cancelled. It can be cleared from
the editor.

Project files are JSON files with the `.prompter` extension and schema version
`1.0`. Imports are validated before replacing the current project. Plain `.txt`
and `.md` files can also be imported as script text. Unsupported future versions
and invalid project files are rejected.

Autosave is only a recovery mechanism. For durable backups, export a project
file. The current draft can be cleared from the app with "Lokale Daten
zurücksetzen"; pitch history has its own clear action. All local site data can
also be removed through the browser's site-data settings.

The static site is served through Cloudflare Pages. Cloudflare processes
technical connection data such as IP address, timestamp, requested files, and
browser metadata. The production site also uses Cloudflare Web Analytics as
documented in the privacy page.

## Development

Requirements:

- Node.js `>=20.0.0`
- npm compatible with the checked-in `package-lock.json`

```bash
npm ci
npm run dev
```

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run audit
npm run test:e2e
npm run build
npm run verify
```

`npm run verify` runs lint, typecheck, unit tests, production build, and
Playwright smoke tests against production preview headers. It also runs a
production dependency audit.

## Architecture

See [docs/architecture.md](docs/architecture.md).

## haak3 Standard

This app follows the
[haak3 Web App Standard](https://github.com/ChristianHaake/haak3-webapp-standard).
Conformance and known release gaps are documented in
[docs/standard-conformance.md](docs/standard-conformance.md).

## License

GNU General Public License v3.0 only. See [LICENSE](LICENSE).
