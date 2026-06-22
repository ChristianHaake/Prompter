import { store } from './store';

export type TranslationKey = 
  | 'app.title'
  | 'app.tagline'
  | 'app.privacyBadge'
  | 'app.educationNotice'
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
  | 'editor.settings.focusLine'
  | 'editor.settings.mirrorMode'
  | 'editor.settings.countdown'
  | 'editor.timer.presets'
  | 'editor.history.title'
  | 'editor.history.clear'
  | 'editor.history.clearConfirm'
  | 'editor.history.empty'
  | 'editor.history.completed'
  | 'editor.history.cancelled'
  | 'editor.stats.words'
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
  | 'editor.actions.present'
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
  | 'content.notFound'
  | 'content.back';

export const translations: Record<'de' | 'en', Record<TranslationKey, string>> = {
  de: {
    'app.title': 'Prompter',
    'app.tagline': 'Werkstatt für digitale Formate',
    'app.privacyBadge': 'Inhalte bleiben lokal',
    'app.educationNotice': 'Diese Simulation dient ausschließlich dem Bildungszweck.',
    'nav.help': 'Hilfe',
    'nav.about': 'Über',
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
    'editor.settings.focusLine': 'Fokus-Linie anzeigen',
    'editor.settings.mirrorMode': 'Für Spiegel umkehren (Mirror Mode)',
    'editor.settings.countdown': '3-Sekunden Countdown vor Start',
    'editor.timer.presets': 'Timer-Vorlagen',
    'editor.history.title': 'Pitch-Verlauf',
    'editor.history.clear': 'Leeren',
    'editor.history.clearConfirm': 'Pitch-Verlauf in diesem Browser löschen?',
    'editor.history.empty': 'Noch keine Durchläufe gespeichert.',
    'editor.history.completed': 'Abgeschlossen',
    'editor.history.cancelled': 'Abgebrochen',
    'editor.stats.words': 'Wörter',
    'editor.stats.readTime': 'Lesezeit',
    'editor.text.title': 'Text',
    'editor.text.label': 'Präsentationstext',
    'editor.options.normal': 'Normal',
    'editor.options.mirror': 'Spiegel',
    'editor.options.on': 'An',
    'editor.options.off': 'Aus',
    'editor.actions.reset': 'Neu',
    'editor.actions.import': 'Importieren',
    'editor.actions.export': 'Projekt speichern',
    'editor.actions.present': 'Präsentieren',
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
    'content.notFound': 'Seite nicht gefunden',
    'content.back': 'Zurück zur App',
  },
  en: {
    'app.title': 'Prompter',
    'app.tagline': 'Digital format workshop',
    'app.privacyBadge': 'Data stays local',
    'app.educationNotice': 'This simulation is for educational purposes only.',
    'nav.help': 'Help',
    'nav.about': 'About',
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
    'editor.settings.focusLine': 'Show focus line',
    'editor.settings.mirrorMode': 'Mirror text (Teleprompter mode)',
    'editor.settings.countdown': '3-second countdown before start',
    'editor.timer.presets': 'Timer presets',
    'editor.history.title': 'Pitch history',
    'editor.history.clear': 'Clear',
    'editor.history.clearConfirm': 'Delete pitch history in this browser?',
    'editor.history.empty': 'No runs saved yet.',
    'editor.history.completed': 'Completed',
    'editor.history.cancelled': 'Cancelled',
    'editor.stats.words': 'words',
    'editor.stats.readTime': 'read time',
    'editor.text.title': 'Text',
    'editor.text.label': 'Presentation text',
    'editor.options.normal': 'Normal',
    'editor.options.mirror': 'Mirror',
    'editor.options.on': 'On',
    'editor.options.off': 'Off',
    'editor.actions.reset': 'New',
    'editor.actions.import': 'Import',
    'editor.actions.export': 'Save Project',
    'editor.actions.present': 'Present',
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
    'content.notFound': 'Page not found',
    'content.back': 'Back to app',
  }
};

export function t(key: TranslationKey): string {
  const lang = store.getState().language;
  return translations[lang][key] || key;
}
