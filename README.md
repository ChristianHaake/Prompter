# Prompter

Prompter ist eine lokale, browserbasierte Teleprompter-App für kurze
Präsentationen, Pitches, Unterrichtsbeiträge und Workshop-Skripte.

Live: [https://prompter.haak3.de](https://prompter.haak3.de)

## Ziel

Prompter hilft dabei, Skripte zu schreiben, als Teleprompter zu prüfen und in
einer kontrollierten Präsentationsansicht abzuspielen. Die App benötigt kein
Login, kein Backend und keinen Upload der Skriptinhalte.

Der Kernworkflow:

1. Skript schreiben oder als `.txt` / `.md` importieren.
2. Zieldauer, Schriftgröße, Zeilenabstand, Farben, Fokus-Linie und Mirror-Modus
   einstellen.
3. Vorschau öffnen, Darstellung prüfen und Einstellungen live anpassen.
4. Präsentation starten und per Tastatur oder Buttons steuern.
5. Durchläufe lokal auswerten, Pitch-Verlauf als CSV exportieren und Projekt als
   `.prompter`-Datei sichern.

## Funktionen

- Markdown-Skripte mit Überschriften, Fett- und Kursivformatierung.
- Vorschau-Modus ohne Countdown, Wake Lock, Fullscreen oder Pitch-History-Eintrag.
- Präsentationsmodus mit automatischem Scrollen, Countdown, Fokus-Linie,
  Mirror-Modus, Abschnittsnavigation und optionalem Wake Lock.
- Projekt öffnen/speichern über validierte `.prompter`-JSON-Dateien.
- Skript-Import für `.txt` und `.md`.
- Lokaler Pitch-Verlauf mit Status, Zielzeit, Ist-Zeit, Wortzahl und CSV-Export.
- Analytics für durchschnittliches Tempo, schnellste/langsamste Läufe und
  Zielzeit-Abweichung.
- Undo für destruktive Aktionen wie neues Projekt und Verlauf leeren.
- Deutsch/Englisch UI, Help/About/Privacy/Imprint-Seiten und PWA-Unterstützung.

## Tastatursteuerung

- `Space`: Start, Pause, Fortsetzen.
- `Escape`: Vorschau oder Präsentation schließen.
- `ArrowUp` / `ArrowDown`: Geschwindigkeit erhöhen oder verringern.
- `ArrowLeft` / `ArrowRight`: vorheriger oder nächster Abschnitt.
- `PageUp` / `PageDown`: vorheriger oder nächster Abschnitt.
- `R`: Präsentation zurücksetzen.

## Datenschutz und Speicherung

Skript- und Projektdaten bleiben im Browser. Es gibt keine App-Accounts, keine
App-Datenbank und keinen Upload der eingegebenen Inhalte an den Betreiber.

Lokale Speicherorte:

- `prompter_project_v1`: aktuelles Projekt im `localStorage`.
- `prompter_pitch_history_v1`: lokale Pitch-History im `localStorage`.
- `prompter_language`: gewählte Sprache.

Projektdateien sind lokale JSON-Dateien mit der Endung `.prompter` und
Schema-Version `1.0`. Importierte Projekte werden vor dem Ersetzen des aktuellen
Entwurfs validiert. Fehlerhafte, zu große oder zukünftige Projektdateien werden
abgelehnt, ohne den aktuellen Entwurf zu ändern.

Die Website wird über Cloudflare Pages ausgeliefert. Cloudflare verarbeitet
technische Verbindungsdaten. Cloudflare Web Analytics ist in der
Datenschutzerklärung dokumentiert; Skriptinhalte werden dabei nicht als
App-Daten übertragen.

## Sicherheit

- Markdown wird mit `marked` gerendert und anschließend mit `DOMPurify`
  bereinigt.
- Projektimporte haben Größen-, Schema- und Feldvalidierung.
- Exportdateinamen werden bereinigt.
- Produktions-Header liegen in `public/_headers` und werden in Playwright gegen
  eine Produktions-Preview geprüft.
- Produktionsabhängigkeiten werden mit `npm audit --omit=dev` geprüft.

## Entwicklung

Voraussetzungen:

- Node.js `>=20.0.0`
- npm kompatibel mit `package-lock.json`

```bash
npm ci
npm run dev
```

Nützliche Befehle:

```bash
npm run clean
npm run lint
npm run typecheck
npm run test
npm run audit
npm run build
npm run test:e2e
npm run verify
```

`npm run verify` ist das Release-Gate. Es führt Linting, Typecheck, Unit-Tests,
Produktions-Audit, Build und Playwright-Tests gegen eine Produktions-Preview aus.

## Projektstruktur

- `src/EditorView.ts`: Editor, Einstellungen, Import/Export, Verlauf, Analytics.
- `src/PresentationView.ts`: Vorschau und Präsentationsruntime.
- `src/store.ts`: Projektzustand, Validierung, Persistenz, Undo, Pitch-History.
- `src/analytics.ts`: Analytics und CSV-Export.
- `content/`: gebündelte Markdown-Seiten.
- `public/_headers`: Produktions-Header für Cloudflare Pages.
- `tests/`: Vitest-Unit-Tests und Playwright-Smoke-Tests.
- `docs/`: Architektur, Review-Checklist und manuelle Release-Checks.

Weitere Details stehen in [docs/architecture.md](docs/architecture.md).

## Release

Vor einem 1.0-Release müssen mindestens diese Checks grün sein:

```bash
npm run verify
```

Zusätzlich bleiben manuelle Checks notwendig:

- Mobile, Tablet und Desktop auf echten Zielbrowsern.
- 200% Zoom und High-Contrast-Darstellung.
- Screen-Reader-Basisprüfung.
- PWA-Installierbarkeit und Offline-Verhalten.
- Rechtstexte und Cloudflare/Web-Analytics-Aussagen durch den Betreiber prüfen.

Die offenen manuellen Punkte stehen in
[docs/manual-release-checks.md](docs/manual-release-checks.md) und
[docs/standard-conformance.md](docs/standard-conformance.md).

## Standard

Prompter folgt dem
[haak3 Web App Standard](https://github.com/ChristianHaake/haak3-webapp-standard).
Abweichungen und offene Release-Gaps werden in
[docs/standard-conformance.md](docs/standard-conformance.md) dokumentiert.

## Lizenz

GNU General Public License v3.0 only. Siehe [LICENSE](LICENSE).
