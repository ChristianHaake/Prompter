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
  | 'editor.stats.words'
  | 'editor.stats.readTime'
  | 'editor.actions.reset'
  | 'editor.actions.import'
  | 'editor.actions.export'
  | 'editor.actions.present'
  | 'editor.prompt.reset'
  | 'editor.placeholder.title'
  | 'editor.placeholder.text'
  | 'presentation.back'
  | 'presentation.fullscreen'
  | 'presentation.start'
  | 'presentation.pause'
  | 'presentation.resume'
  | 'presentation.end'
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
    'editor.stats.words': 'Wörter',
    'editor.stats.readTime': 'Lesezeit',
    'editor.actions.reset': 'Neu',
    'editor.actions.import': 'Importieren',
    'editor.actions.export': 'Projekt speichern',
    'editor.actions.present': 'Präsentieren',
    'editor.prompt.reset': 'Möchtest du das aktuelle Projekt wirklich verwerfen? Alle ungespeicherten Änderungen gehen verloren.',
    'editor.placeholder.title': 'Neues Projekt',
    'editor.placeholder.text': 'Gib dein Skript hier ein oder füge es aus der Zwischenablage ein...',
    'presentation.back': 'Zurück',
    'presentation.fullscreen': 'Vollbild',
    'presentation.start': 'Start',
    'presentation.pause': 'Pause',
    'presentation.resume': 'Weiter',
    'presentation.end': 'Ende',
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
    'editor.stats.words': 'words',
    'editor.stats.readTime': 'read time',
    'editor.actions.reset': 'New',
    'editor.actions.import': 'Import',
    'editor.actions.export': 'Save Project',
    'editor.actions.present': 'Present',
    'editor.prompt.reset': 'Do you really want to discard the current project? All unsaved changes will be lost.',
    'editor.placeholder.title': 'New Project',
    'editor.placeholder.text': 'Type your script here or paste from clipboard...',
    'presentation.back': 'Back',
    'presentation.fullscreen': 'Fullscreen',
    'presentation.start': 'Start',
    'presentation.pause': 'Pause',
    'presentation.resume': 'Resume',
    'presentation.end': 'End',
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
