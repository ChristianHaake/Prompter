import { store } from './store';

export type TranslationKey = 
  | 'app.title'
  | 'app.tagline'
  | 'app.privacyBadge'
  | 'app.footerPrivacy'
  | 'nav.help'
  | 'nav.about'
  | 'nav.privacy'
  | 'nav.imprint'
  | 'nav.github'
  | 'nav.teachers'
  | 'lang.switch'
  | 'lang.switchLabel'
  | 'editor.intro.eyebrow'
  | 'editor.intro.title'
  | 'editor.intro.text'
  | 'editor.settings.title'
  | 'editor.settings.projectTitle'
  | 'editor.settings.duration'
  | 'editor.settings.fontSize'
  | 'editor.settings.lineHeight'
  | 'editor.settings.theme'
  | 'editor.settings.themeLight'
  | 'editor.settings.themeDark'
  | 'editor.settings.themeHighContrast'
  | 'editor.settings.fontFamily'
  | 'editor.settings.textColorTheme'
  | 'editor.settings.focusLinePosition'
  | 'editor.font.system'
  | 'editor.font.serif'
  | 'editor.font.mono'
  | 'editor.font.dyslexic'
  | 'editor.textColor.dark'
  | 'editor.textColor.light'
  | 'editor.textColor.highContrast'
  | 'editor.shortcuts.title'
  | 'editor.shortcuts.preview'
  | 'editor.shortcuts.present'
  | 'editor.shortcuts.playPause'
  | 'editor.shortcuts.speed'
  | 'editor.shortcuts.sections'
  | 'editor.shortcuts.resetExit'
  | 'editor.settings.focusLine'
  | 'editor.settings.mirrorMode'
  | 'editor.settings.countdown'
  | 'editor.timer.presets'
  | 'editor.timer.custom'
  | 'editor.history.title'
  | 'editor.history.clear'
  | 'editor.history.clearConfirm'
  | 'editor.history.empty'
  | 'editor.history.completed'
  | 'editor.history.cancelled'
  | 'editor.history.exportCsv'
  | 'editor.analytics.completed'
  | 'editor.analytics.averageWpm'
  | 'editor.analytics.fastestSlowest'
  | 'editor.analytics.averageDeviation'
  | 'editor.analytics.trend'
  | 'editor.stats.words'
  | 'editor.stats.characters'
  | 'editor.stats.readTime'
  | 'editor.text.title'
  | 'editor.text.label'
  | 'editor.options.normal'
  | 'editor.options.mirror'
  | 'editor.options.on'
  | 'editor.options.off'
  | 'editor.actions.reset'
  | 'editor.actions.import'
  | 'editor.actions.export'
  | 'editor.actions.preview'
  | 'editor.actions.present'
  | 'editor.undo.action'
  | 'editor.undo.resetReady'
  | 'editor.undo.historyReady'
  | 'editor.prompt.reset'
  | 'editor.prompt.resetLocal'
  | 'editor.prompt.importReplace'
  | 'editor.alert.importTooLarge'
  | 'editor.alert.importFailure'
  | 'editor.alert.importReadError'
  | 'editor.importError.invalidJson'
  | 'editor.importError.invalidObject'
  | 'editor.importError.unsupportedVersion'
  | 'editor.importError.missingTitle'
  | 'editor.importError.missingText'
  | 'editor.placeholder.title'
  | 'editor.placeholder.text'
  | 'presentation.back'
  | 'presentation.fullscreen'
  | 'presentation.fullscreenExit'
  | 'presentation.fullscreenUnavailable'
  | 'presentation.start'
  | 'presentation.startHint'
  | 'presentation.countdown'
  | 'presentation.pause'
  | 'presentation.resume'
  | 'presentation.end'
  | 'presentation.reset'
  | 'presentation.noScrollNeeded'
  | 'presentation.speedDecrease'
  | 'presentation.speedIncrease'
  | 'presentation.elapsed'
  | 'presentation.remaining'
  | 'presentation.viewport'
  | 'presentation.sections'
  | 'presentation.previousSection'
  | 'presentation.nextSection'
  | 'preview.back'
  | 'preview.static'
  | 'preview.settings'
  | 'content.notFound'
  | 'content.back';

export const translations: Record<'de' | 'en', Record<TranslationKey, string>> = {
  de: {
    'app.title': 'Prompter',
    'app.tagline': 'Werkstatt für digitale Formate',
    'app.privacyBadge': 'Lokale Verarbeitung im Browser',
    'app.footerPrivacy': 'Alle Daten bleiben lokal im Browser. Keine Serverübertragung.',
    'nav.help': 'Hilfe',
    'nav.about': 'Über das Projekt',
    'nav.privacy': 'Datenschutz',
    'nav.imprint': 'Impressum',
    'nav.github': 'GitHub',
    'nav.teachers': 'Für Lehrkräfte',
    'lang.switch': 'EN',
    'lang.switchLabel': 'Sprache wechseln',
    'editor.intro.eyebrow': 'LOKAL. EXPORTIERBAR. BROWSERBASIERT.',
    'editor.intro.title': 'Perfektioniere deine Vorträge.',
    'editor.intro.text': 'Gestalte deine Skripte und nutze den integrierten Teleprompter, um deine Präsentationen fehlerfrei zu halten. Ohne Anmeldung und ohne Upload.',
    'editor.settings.title': 'Einstellungen',
    'editor.settings.projectTitle': 'Titel',
    'editor.settings.duration': 'Zieldauer (Minuten)',
    'editor.settings.fontSize': 'Schriftgröße',
    'editor.settings.lineHeight': 'Zeilenabstand',
    'editor.settings.theme': 'Farbschema',
    'editor.settings.themeLight': 'Hell',
    'editor.settings.themeDark': 'Dunkel',
    'editor.settings.themeHighContrast': 'Hoher Kontrast',
    'editor.settings.fontFamily': 'Schriftart',
    'editor.settings.textColorTheme': 'Prompter-Farben',
    'editor.settings.focusLinePosition': 'Position der Fokus-Linie',
    'editor.font.system': 'System',
    'editor.font.serif': 'Serif',
    'editor.font.mono': 'Monospace',
    'editor.font.dyslexic': 'Lesefreundlich',
    'editor.textColor.dark': 'Hell auf Dunkel',
    'editor.textColor.light': 'Dunkel auf Hell',
    'editor.textColor.highContrast': 'Hoher Kontrast',
    'editor.shortcuts.title': 'Tastaturkürzel',
    'editor.shortcuts.preview': 'Vorschau schließen',
    'editor.shortcuts.present': 'Präsentation starten',
    'editor.shortcuts.playPause': 'Start/Pause/Fortsetzen',
    'editor.shortcuts.speed': 'Geschwindigkeit ändern',
    'editor.shortcuts.sections': 'Abschnitt wechseln',
    'editor.shortcuts.resetExit': 'Zurücksetzen / Beenden',
    'editor.settings.focusLine': 'Fokus-Linie anzeigen',
    'editor.settings.mirrorMode': 'Für Spiegel umkehren (Mirror Mode)',
    'editor.settings.countdown': '3-Sekunden Countdown vor Start',
    'editor.timer.presets': 'Timer-Vorlagen',
    'editor.timer.custom': 'Benutzerdefiniert',
    'editor.history.title': 'Pitch-Verlauf',
    'editor.history.clear': 'Leeren',
    'editor.history.clearConfirm': 'Pitch-Verlauf in diesem Browser löschen?',
    'editor.history.empty': 'Noch keine Durchläufe gespeichert.',
    'editor.history.completed': 'Abgeschlossen',
    'editor.history.cancelled': 'Abgebrochen',
    'editor.history.exportCsv': 'CSV',
    'editor.analytics.completed': 'Durchläufe',
    'editor.analytics.averageWpm': 'Ø Tempo',
    'editor.analytics.fastestSlowest': 'Schnell/Langsam',
    'editor.analytics.averageDeviation': 'Ø Abweichung',
    'editor.analytics.trend': 'Trend',
    'editor.stats.words': 'Wörter',
    'editor.stats.characters': 'Zeichen',
    'editor.stats.readTime': 'Lesezeit',
    'editor.text.title': 'Text',
    'editor.text.label': 'Präsentationstext',
    'editor.options.normal': 'Normal',
    'editor.options.mirror': 'Spiegel',
    'editor.options.on': 'An',
    'editor.options.off': 'Aus',
    'editor.actions.reset': 'Neu',
    'editor.actions.import': 'Projekt öffnen',
    'editor.actions.export': 'Projekt speichern',
    'editor.actions.preview': 'Vorschau',
    'editor.actions.present': 'Präsentieren',
    'editor.undo.action': 'Rückgängig',
    'editor.undo.resetReady': 'Entwurf wurde zurückgesetzt.',
    'editor.undo.historyReady': 'Pitch-Verlauf wurde geleert.',
    'editor.prompt.reset': 'Möchtest du das aktuelle Projekt wirklich verwerfen? Alle ungespeicherten Änderungen gehen verloren.',
    'editor.prompt.resetLocal': 'Lokale Daten zurücksetzen? Der aktuelle Entwurf wird aus diesem Browser entfernt.',
    'editor.prompt.importReplace': 'Das Öffnen einer Projektdatei ersetzt den aktuellen lokalen Entwurf. Trotzdem öffnen?',
    'editor.alert.importTooLarge': 'Die Projektdatei ist zu groß. Bitte öffne eine .prompter-Datei unter 500 KB.',
    'editor.alert.importFailure': 'Fehler beim Öffnen der Datei.',
    'editor.alert.importReadError': 'Die Projektdatei konnte nicht gelesen werden.',
    'editor.importError.invalidJson': 'Die Datei enthält kein gültiges JSON.',
    'editor.importError.invalidObject': 'Die Projektdatei hat kein gültiges Objektformat.',
    'editor.importError.unsupportedVersion': 'Unterstützt wird nur Projektversion 1.0.',
    'editor.importError.missingTitle': 'Der Projekttitel fehlt oder ist ungültig.',
    'editor.importError.missingText': 'Der Projekttext fehlt oder ist ungültig.',
    'editor.placeholder.title': 'Neues Projekt',
    'editor.placeholder.text': 'Gib dein Skript hier ein oder füge es aus der Zwischenablage ein...',
    'presentation.back': 'Zurück',
    'presentation.fullscreen': 'Vollbild',
    'presentation.fullscreenExit': 'Vollbild beenden',
    'presentation.fullscreenUnavailable': 'Vollbild nicht verfügbar',
    'presentation.start': 'Start',
    'presentation.startHint': 'Start (Leertaste)',
    'presentation.countdown': 'Countdown...',
    'presentation.pause': 'Pause',
    'presentation.resume': 'Weiter',
    'presentation.end': 'Ende',
    'presentation.reset': 'Zurücksetzen',
    'presentation.noScrollNeeded': 'Kein Scroll nötig',
    'presentation.speedDecrease': 'Geschwindigkeit verringern',
    'presentation.speedIncrease': 'Geschwindigkeit erhöhen',
    'presentation.elapsed': 'Verstrichene Zeit',
    'presentation.remaining': 'Verbleibende Zeit',
    'presentation.viewport': 'Teleprompter-Text',
    'presentation.sections': 'Abschnitte',
    'presentation.previousSection': 'Vorheriger Abschnitt',
    'presentation.nextSection': 'Nächster Abschnitt',
    'preview.back': 'Vorschau schließen',
    'preview.static': 'Vorschau',
    'preview.settings': 'Vorschau-Einstellungen',
    'content.notFound': 'Seite nicht gefunden',
    'content.back': 'Zurück zur App',
  },
  en: {
    'app.title': 'Prompter',
    'app.tagline': 'Digital format workshop',
    'app.privacyBadge': 'Local processing in browser',
    'app.footerPrivacy': 'All data stays local in the browser. No server transfer.',
    'nav.help': 'Help',
    'nav.about': 'About the project',
    'nav.privacy': 'Privacy',
    'nav.imprint': 'Imprint',
    'nav.github': 'GitHub',
    'nav.teachers': 'For Teachers',
    'lang.switch': 'DE',
    'lang.switchLabel': 'Switch language',
    'editor.intro.eyebrow': 'LOCAL. EXPORTABLE. BROWSER-BASED.',
    'editor.intro.title': 'Perfect your presentations.',
    'editor.intro.text': 'Design your scripts and use the built-in teleprompter to deliver flawless presentations. No login and no uploads required.',
    'editor.settings.title': 'Settings',
    'editor.settings.projectTitle': 'Title',
    'editor.settings.duration': 'Target duration (minutes)',
    'editor.settings.fontSize': 'Font size',
    'editor.settings.lineHeight': 'Line height',
    'editor.settings.theme': 'Theme',
    'editor.settings.themeLight': 'Light',
    'editor.settings.themeDark': 'Dark',
    'editor.settings.themeHighContrast': 'High contrast',
    'editor.settings.fontFamily': 'Font family',
    'editor.settings.textColorTheme': 'Prompter colors',
    'editor.settings.focusLinePosition': 'Focus line position',
    'editor.font.system': 'System',
    'editor.font.serif': 'Serif',
    'editor.font.mono': 'Monospace',
    'editor.font.dyslexic': 'Readable',
    'editor.textColor.dark': 'Light on dark',
    'editor.textColor.light': 'Dark on light',
    'editor.textColor.highContrast': 'High contrast',
    'editor.shortcuts.title': 'Keyboard shortcuts',
    'editor.shortcuts.preview': 'Close preview',
    'editor.shortcuts.present': 'Start presentation',
    'editor.shortcuts.playPause': 'Start/pause/resume',
    'editor.shortcuts.speed': 'Change speed',
    'editor.shortcuts.sections': 'Change section',
    'editor.shortcuts.resetExit': 'Reset / exit',
    'editor.settings.focusLine': 'Show focus line',
    'editor.settings.mirrorMode': 'Mirror text (Teleprompter mode)',
    'editor.settings.countdown': '3-second countdown before start',
    'editor.timer.presets': 'Timer presets',
    'editor.timer.custom': 'Custom',
    'editor.history.title': 'Pitch history',
    'editor.history.clear': 'Clear',
    'editor.history.clearConfirm': 'Delete pitch history in this browser?',
    'editor.history.empty': 'No runs saved yet.',
    'editor.history.completed': 'Completed',
    'editor.history.cancelled': 'Cancelled',
    'editor.history.exportCsv': 'CSV',
    'editor.analytics.completed': 'Runs',
    'editor.analytics.averageWpm': 'Avg speed',
    'editor.analytics.fastestSlowest': 'Fast/slow',
    'editor.analytics.averageDeviation': 'Avg deviation',
    'editor.analytics.trend': 'Trend',
    'editor.stats.words': 'words',
    'editor.stats.characters': 'characters',
    'editor.stats.readTime': 'read time',
    'editor.text.title': 'Text',
    'editor.text.label': 'Presentation text',
    'editor.options.normal': 'Normal',
    'editor.options.mirror': 'Mirror',
    'editor.options.on': 'On',
    'editor.options.off': 'Off',
    'editor.actions.reset': 'New',
    'editor.actions.import': 'Open Project',
    'editor.actions.export': 'Save Project',
    'editor.actions.preview': 'Preview',
    'editor.actions.present': 'Present',
    'editor.undo.action': 'Undo',
    'editor.undo.resetReady': 'Draft was reset.',
    'editor.undo.historyReady': 'Pitch history was cleared.',
    'editor.prompt.reset': 'Do you really want to discard the current project? All unsaved changes will be lost.',
    'editor.prompt.resetLocal': 'Reset local data? The current draft will be removed from this browser.',
    'editor.prompt.importReplace': 'Opening a project file replaces the current local draft. Open it anyway?',
    'editor.alert.importTooLarge': 'The project file is too large. Please open a .prompter file under 500 KB.',
    'editor.alert.importFailure': 'Error opening the file.',
    'editor.alert.importReadError': 'The project file could not be read.',
    'editor.importError.invalidJson': 'The file does not contain valid JSON.',
    'editor.importError.invalidObject': 'The project file is not a valid object.',
    'editor.importError.unsupportedVersion': 'Only project version 1.0 is supported.',
    'editor.importError.missingTitle': 'The project title is missing or invalid.',
    'editor.importError.missingText': 'The project text is missing or invalid.',
    'editor.placeholder.title': 'New Project',
    'editor.placeholder.text': 'Type your script here or paste from clipboard...',
    'presentation.back': 'Back',
    'presentation.fullscreen': 'Fullscreen',
    'presentation.fullscreenExit': 'Exit fullscreen',
    'presentation.fullscreenUnavailable': 'Fullscreen unavailable',
    'presentation.start': 'Start',
    'presentation.startHint': 'Start (Space)',
    'presentation.countdown': 'Countdown...',
    'presentation.pause': 'Pause',
    'presentation.resume': 'Resume',
    'presentation.end': 'End',
    'presentation.reset': 'Reset',
    'presentation.noScrollNeeded': 'No scrolling needed',
    'presentation.speedDecrease': 'Decrease speed',
    'presentation.speedIncrease': 'Increase speed',
    'presentation.elapsed': 'Elapsed time',
    'presentation.remaining': 'Remaining time',
    'presentation.viewport': 'Teleprompter text',
    'presentation.sections': 'Sections',
    'presentation.previousSection': 'Previous section',
    'presentation.nextSection': 'Next section',
    'preview.back': 'Close preview',
    'preview.static': 'Preview',
    'preview.settings': 'Preview settings',
    'content.notFound': 'Page not found',
    'content.back': 'Back to app',
  }
};

export function t(key: TranslationKey): string {
  const lang = store.getState().language;
  return translations[lang][key] || key;
}
