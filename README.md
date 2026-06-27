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

### Release 1.0.0

- **Skript-Editor**: lokale Texteingabe mit Autosave, Titel, Wort- und
  Zeichenzählung, Lesezeit und Markdown-Ausgabe für Überschriften, Listen,
  Trennlinien sowie Fett- und Kursivformatierung.
- **Timer Studio**: 60-, 90- und 120-Sekunden-Vorlagen plus freie Zieldauer für
  Pitches, Unterrichtsbeiträge und kurze Präsentationen.
- **Live Preview**: typografisch identische Prompter-Vorschau ohne Countdown,
  Wake Lock, Fullscreen oder Pitch-History-Eintrag.
- **Teleprompter Runtime**: automatisches Scrollen, 3-Sekunden-Countdown,
  Live-Geschwindigkeit, Fortschrittsanzeige, Endsignal, Fullscreen,
  Abschnittsnavigation und optionaler Wake Lock.
- **Lesbarkeits-Setup**: Schriftgröße, Zeilenabstand, Schriftfamilie,
  Hell/Dunkel/High-Contrast-App-Theme, Prompter-Farben, Fokus-Linie mit
  Positionssteuerung und Mirror Mode für Teleprompter-Spiegel.
- **Lokale Projektdateien**: validierte `.prompter`-JSON-Dateien zum Öffnen und
  Speichern sowie direkter Skript-Import für `.txt` und `.md`.
- **Pitch History & Analytics**: lokaler Verlauf mit
  abgeschlossen/abgebrochen-Status, Zielzeit, Ist-Zeit, Wortzahl, CSV-Export,
  Durchschnittstempo, schnellstem/langsamstem Lauf, Zielzeit-Abweichung und
  Trend.
- **Recovery Flow**: Rückgängig-Funktion für destruktive Aktionen wie neues
  Projekt und Verlauf leeren.
- **Mehrsprachige App-Shell**: Deutsch/Englisch, Hilfe, Über das Projekt,
  Datenschutz, Impressum, Für Lehrkräfte, lokales Browser-Speichermodell und
  PWA-Unterstützung.

## Screenshots

Die Bilddateien für Blogposts und Social Media liegen in
`docs/screenshots/`:

- `prompter-blog-editor-desktop.png`: Editor, Einstellungen und Textbereich im
  Desktop-Layout.
- `prompter-blog-preview-desktop.png`: Prompter-Vorschau mit Fokus auf
  Typografie und Lesbarkeit.
- `prompter-blog-presentation-desktop.png`: laufende Präsentationsansicht mit
  Steuerleiste.
- `prompter-social-square.png`: quadratischer Social-Media-Ausschnitt.
- `prompter-social-mobile.png`: mobiles Hochformat für Stories/Reels/Posts.

## Release-Status

`1.0.0` ist die erste fertige Prompter-Version. Das automatisierte Release-Gate
ist `npm run verify`; manuelle Zielgeräte-, Screenreader- und PWA-Prüfungen
stehen in [docs/manual-release-checks.md](docs/manual-release-checks.md), weil
sie nicht ehrlich automatisiert abgehakt werden können.

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

Die Website wird über Cloudflare ausgeliefert. Der Produktions-Build erzeugt
statische Dateien in `dist`, die per Wrangler-Static-Assets-Konfiguration
bereitgestellt werden. Cloudflare verarbeitet technische Verbindungsdaten.
Cloudflare Web Analytics ist in der Datenschutzerklärung dokumentiert;
Skriptinhalte werden dabei nicht als App-Daten übertragen.

## Sicherheit

- Markdown wird mit `marked` gerendert und anschließend mit `DOMPurify`
  bereinigt.
- Projektimporte haben Größen-, Versions-, Schema- und Feldvalidierung.
- Exportdateinamen werden bereinigt.
- Produktions-Header liegen in `public/_headers` und werden in Playwright gegen
  eine Produktions-Preview geprüft.
- Produktionsabhängigkeiten werden mit `npm audit --omit=dev` geprüft.
- CSV-Export schützt Tabellenprogramme vor Formel-Injektionen.

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
- `public/_headers`: Produktions-Header für Cloudflare-Auslieferung.
- `tests/`: Vitest-Unit-Tests und Playwright-Smoke-Tests.
- `docs/`: Architektur, Review-Checklist und manuelle Release-Checks.

Weitere Details stehen in [docs/architecture.md](docs/architecture.md).

## Lizenz

GNU General Public License v3.0 only. Siehe [LICENSE](LICENSE).
