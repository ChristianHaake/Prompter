# Project Plan

## Kurzbeschreibung

Prompter ist ein browserbasierter, lokaler Teleprompter für kurze
Präsentationen, Pitches, Unterrichtsbeiträge, Erklärvideos und Workshop-Skripte
mit integrierter Zeitsteuerung.

## Zielgruppe

- Schülerinnen und Schüler
- Lehrkräfte
- Fortbildende
- Personen, die kurze geskriptete Vorträge oder Aufnahmen vorbereiten

## Einsatzszenarien

- Referate und mündliche Prüfungen
- Pitches und kurze Präsentationen
- Erklärvideos und Videostatements
- Unterrichts- und Workshop-Beiträge
- Podcast- oder Nachrichtenformate mit vorbereitetem Skript

## User Story

Als präsentierende Person möchte ich meinen Sprechtext lokal schreiben,
speichern, testen und automatisch scrollen lassen, damit ich flüssig
präsentieren und eine vorgegebene Zeit einhalten kann.

## Release 1.0.0 Scope

- Texteditor mit Autosave, Wort-/Zeichenzählung und Lesezeit.
- Markdown-Darstellung für Skripte und Inhaltsseiten.
- Timer-Vorlagen, freie Zieldauer, Countdown und Live-Geschwindigkeit.
- Vorschau ohne Pitch-Aufzeichnung.
- Präsentationsmodus mit Auto-Scroll, Fullscreen, Fokus-Linie,
  Spiegelmodus, Abschnittsnavigation, Fortschritt und optionalem Wake Lock.
- Lokaler Projekt-Export/-Import als validierte `.prompter`-Datei.
- Direktimport von `.txt` und `.md` als Skripttext.
- Lokaler Pitch-Verlauf mit Analytics und CSV-Export.
- Undo für Projekt-Reset und Verlauf leeren.
- Deutsch/Englisch UI, Datenschutz-/Impressums-/Hilfe-/Lehrkräfte-Seiten.
- PWA-Shell und Cloudflare-Static-Assets-Deployment.

## Akzeptanzkriterien

- Text kann erstellt, eingefügt, automatisch gespeichert und als Projekt
  exportiert werden.
- `.prompter`-Dateien werden validiert importiert; fehlerhafte Importe ersetzen
  den aktuellen Entwurf nicht.
- `.txt`- und `.md`-Dateien können als Skripttext importiert werden.
- Zielzeit, Darstellung, Fokus-Linie, Spiegelmodus und Countdown sind steuerbar.
- Vorschau und Präsentation verwenden dieselbe bereinigte Markdown-Ausgabe.
- Präsentation ist per Buttons und Tastatur steuerbar.
- Durchläufe werden lokal als abgeschlossen oder abgebrochen gespeichert und als
  CSV exportiert.
- Datenschutzmodell, Produktions-Header und Release-Gate sind dokumentiert.

## Nicht im 1.0.0 Scope

- Benutzerkonten, Backend-Speicherung oder Cloud-Synchronisation.
- Fernsteuerung über ein zweites Gerät.
- Kollaboration oder Freigabelinks.
- Manuelle Zielgeräte-, Screen-Reader- und PWA-Installationsfreigabe; diese
  Checks stehen in `docs/manual-release-checks.md`.
