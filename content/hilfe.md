# Hilfe

## Was macht Prompter?

Prompter ist ein lokaler Browser-Teleprompter. Du schreibst oder öffnest ein
Skript, stellst Zieldauer und Lesbarkeit ein und startest den Präsentationsmodus.

## Schnellstart

1. Text in das Textfeld einfügen.
2. Zieldauer direkt oder per Timer-Vorlage, Schriftgröße, Zeilenabstand,
   Schriftart, Farben, Spiegelmodus, Fokus-Linie und Countdown einstellen.
3. "Vorschau" prüfen oder "Präsentieren" starten.
4. Im Präsentationsmodus mit Leertaste pausieren oder fortsetzen.
5. Mit Pfeil hoch und Pfeil runter die Geschwindigkeit ändern.
6. Mit Pfeil rechts/links oder Bild auf/ab zwischen Überschriften und
   Abschnittsmarken springen.
7. Mit `R` zurücksetzen und mit Escape zum Editor zurückkehren. Abgeschlossene
   und abgebrochene Durchläufe erscheinen im Pitch-Verlauf.

## Vorschau und Formatierung

Die Vorschau nutzt dieselbe Darstellung wie der Präsentationsmodus, startet aber
keinen Lauf und schreibt keinen Pitch-Verlauf. Änderungen an Schriftgröße,
Zeilenabstand, Spiegelmodus und Fokus-Linie werden dort sofort sichtbar.

Der Editor unterstützt Markdown im Skript. Überschriften, **fette** und
*kursive* Hervorhebungen werden in Vorschau und Präsentation gerendert.
Horizontale Linien (`---`) können als Abschnittsmarken dienen.

## Projekte speichern und öffnen

Der aktuelle Entwurf wird automatisch im Browser gespeichert. Diese Speicherung
ist nur eine Wiederherstellungshilfe für denselben Browser.

Für ein dauerhaftes Backup speicherst du eine `.prompter`-Datei über "Projekt
speichern". Eine solche Datei kannst du später mit "Projekt öffnen" wieder
laden. Beim Öffnen wird der aktuelle Entwurf ersetzt; die App fragt vorher nach.

Du kannst auch `.txt`- und `.md`-Dateien direkt als Skripttext importieren. Diese
Dateien werden nicht als vollständige Projekte behandelt.

Ungültige Dateien, zu große Dateien und nicht unterstützte Projektversionen
werden abgelehnt. Der aktuelle Entwurf bleibt dann erhalten.

## Daten löschen

"Neu" entfernt den gespeicherten Entwurf aus diesem Browser und stellt das
Beispielprojekt wieder her. Der Pitch-Verlauf hat eine eigene Schaltfläche zum
Löschen und kann als CSV exportiert werden. Nach "Neu" und "Leeren" erscheint
eine Rückgängig-Aktion, bis du weiterarbeitest oder den Tab schließt. Zusätzlich
kannst du die Website-Daten in den Browser-Einstellungen löschen.

## Unterstützte Geräte und Grenzen

Prompter ist für moderne Desktop- und Mobilbrowser gebaut. Die App nutzt
`localStorage`, den Fullscreen-API des Browsers, Web Audio für das Endsignal,
optional Wake Lock während der Präsentation und einen Service Worker für PWA-
Funktionalität.

Projektdateien sind JSON-Dateien mit der Endung `.prompter`. Die aktuelle
Importgrenze liegt bei 500 KB. Sehr lange Texte werden auf 100.000 Zeichen
begrenzt.
