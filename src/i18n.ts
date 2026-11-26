import { store } from './store';
import type { Language } from './types';

export type TranslationKey = 
  | 'app.title'
  | 'app.tagline'
  | 'app.privacyBadge'
  | 'app.footerPrivacy'
  | 'app.skipLink'
  | 'app.footerNavLabel'
  | 'nav.help'
  | 'nav.about'
  | 'nav.support'
  | 'nav.terms'
  | 'nav.examples'
  | 'nav.repository'
  | 'nav.privacy'
  | 'nav.imprint'
  | 'nav.github'
  | 'nav.teachers'
  | 'lang.switch'
  | 'lang.switchLabel'
  | 'lang.label'
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
  | 'editor.save.saved'
  | 'editor.save.pending'
  | 'editor.save.temporary'
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
  | 'content.back'
  | 'content.examplesTitle'
  | 'content.exampleOpen'
  | 'content.exampleConfirm'
  | 'content.exampleDescription'
  | 'content.exampleLoaded'
  | 'app.footerAttribution';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  de: {
    'app.title': 'Prompter',
    'app.tagline': 'Werkstatt für digitale Formate',
    'app.privacyBadge': 'Lokale Verarbeitung im Browser',
    'app.footerPrivacy': 'Dein Skript bleibt in diesem Browser. Cloudflare verarbeitet technische Verbindungsdaten.',
    'app.skipLink': 'Zum Inhalt springen',
    'app.footerNavLabel': 'Rechtliches und Hilfe',
    'app.footerAttribution': 'Ein Projekt von haak3',
    'nav.help': 'Hilfe',
    'nav.about': 'Über das Projekt',
    'nav.support': 'Unterstützen',
    'nav.terms': 'AGB',
    'nav.examples': 'Beispiele',
    'nav.repository': 'Repository auf GitHub',
    'nav.privacy': 'Datenschutz',
    'nav.imprint': 'Impressum',
    'nav.github': 'GitHub',
    'nav.teachers': 'Für Lehrkräfte',
    'lang.switch': 'EN',
    'lang.switchLabel': 'Sprache wechseln',
    'lang.label': 'Sprache',
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
    'editor.save.saved': 'Im Browser gespeichert.',
    'editor.save.pending': 'Noch nicht gespeichert.',
    'editor.save.temporary': 'Speichern im Browser fehlgeschlagen. Exportiere eine Projektdatei, um deinen Entwurf zu sichern.',
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
    'content.examplesTitle': 'Beispielprojekt',
    'content.exampleOpen': 'Beispielprojekt öffnen',
    'content.exampleConfirm': 'Das Beispielprojekt ersetzt den aktuellen Entwurf. Möchtest du fortfahren?',
    'content.exampleDescription': 'Öffne ein lokales Beispielprojekt zur Photosynthese und passe es an.',
    'content.exampleLoaded': 'Das Beispielprojekt wurde geöffnet.',
  },
  en: {
    'app.title': 'Prompter',
    'app.tagline': 'Digital format workshop',
    'app.privacyBadge': 'Local processing in browser',
    'app.footerPrivacy': 'Your script stays in this browser. Cloudflare processes technical connection data.',
    'app.skipLink': 'Skip to content',
    'app.footerNavLabel': 'Legal information and help',
    'app.footerAttribution': 'A project by haak3',
    'nav.help': 'Help',
    'nav.about': 'About the project',
    'nav.support': 'Support',
    'nav.terms': 'Terms and conditions',
    'nav.examples': 'Examples',
    'nav.repository': 'GitHub repository',
    'nav.privacy': 'Privacy',
    'nav.imprint': 'Imprint',
    'nav.github': 'GitHub',
    'nav.teachers': 'For Teachers',
    'lang.switch': 'DE',
    'lang.switchLabel': 'Switch language',
    'lang.label': 'Language',
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
    'editor.save.saved': 'Saved in this browser.',
    'editor.save.pending': 'Not saved yet.',
    'editor.save.temporary': 'Saving in this browser failed. Export a project file to keep your draft.',
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
    'content.examplesTitle': 'Example project',
    'content.exampleOpen': 'Open example project',
    'content.exampleConfirm': 'The example project will replace the current draft. Continue?',
    'content.exampleDescription': 'Open a local photosynthesis example project and adapt it.',
    'content.exampleLoaded': 'The example project was opened.',
  },
  fr: {
    'app.title': 'Prompter',
    'app.tagline': 'Atelier de formats numériques',
    'app.privacyBadge': 'Traitement local dans le navigateur',
    'app.footerPrivacy': 'Votre script reste dans ce navigateur. Cloudflare traite les données techniques de connexion.',
    'app.skipLink': 'Aller au contenu',
    'app.footerNavLabel': 'Informations légales et aide',
    'app.footerAttribution': 'Un projet de haak3',
    'nav.help': 'Aide', 'nav.about': 'À propos du projet', 'nav.support': 'Soutenir', 'nav.terms': 'Conditions générales', 'nav.examples': 'Exemples', 'nav.repository': 'Dépôt GitHub',
    'nav.privacy': 'Confidentialité', 'nav.imprint': 'Mentions légales', 'nav.github': 'GitHub', 'nav.teachers': 'Pour les enseignants',
    'lang.switch': 'DE', 'lang.switchLabel': 'Choisir la langue', 'lang.label': 'Langue',
    'editor.intro.eyebrow': 'LOCAL. EXPORTABLE. DANS LE NAVIGATEUR.',
    'editor.intro.title': 'Perfectionnez vos présentations.',
    'editor.intro.text': 'Rédigez vos scripts et utilisez le téléprompteur intégré pour présenter avec assurance. Sans compte et sans téléversement.',
    'editor.settings.title': 'Paramètres', 'editor.settings.projectTitle': 'Titre', 'editor.settings.duration': 'Durée cible (minutes)',
    'editor.settings.fontSize': 'Taille de police', 'editor.settings.lineHeight': 'Interligne', 'editor.settings.theme': 'Thème',
    'editor.settings.themeLight': 'Clair', 'editor.settings.themeDark': 'Sombre', 'editor.settings.themeHighContrast': 'Contraste élevé',
    'editor.settings.fontFamily': 'Police', 'editor.settings.textColorTheme': 'Couleurs du téléprompteur', 'editor.settings.focusLinePosition': 'Position de la ligne de focus',
    'editor.font.system': 'Système', 'editor.font.serif': 'Sérif', 'editor.font.mono': 'Monospace', 'editor.font.dyslexic': 'Facile à lire',
    'editor.textColor.dark': 'Clair sur fond sombre', 'editor.textColor.light': 'Sombre sur fond clair', 'editor.textColor.highContrast': 'Contraste élevé',
    'editor.shortcuts.title': 'Raccourcis clavier', 'editor.shortcuts.preview': 'Fermer l’aperçu', 'editor.shortcuts.present': 'Démarrer la présentation',
    'editor.shortcuts.playPause': 'Démarrer / pause / reprendre', 'editor.shortcuts.speed': 'Modifier la vitesse', 'editor.shortcuts.sections': 'Changer de section',
    'editor.shortcuts.resetExit': 'Réinitialiser / quitter', 'editor.settings.focusLine': 'Afficher la ligne de focus',
    'editor.settings.mirrorMode': 'Inverser le texte (mode miroir)', 'editor.settings.countdown': 'Décompte de 3 secondes avant le démarrage',
    'editor.timer.presets': 'Préréglages du minuteur', 'editor.timer.custom': 'Personnalisé', 'editor.history.title': 'Historique des présentations',
    'editor.history.clear': 'Effacer', 'editor.history.clearConfirm': 'Effacer l’historique des présentations dans ce navigateur ?',
    'editor.history.empty': 'Aucune présentation enregistrée.', 'editor.history.completed': 'Terminée', 'editor.history.cancelled': 'Interrompue',
    'editor.history.exportCsv': 'CSV', 'editor.analytics.completed': 'Présentations', 'editor.analytics.averageWpm': 'Vitesse moyenne',
    'editor.analytics.fastestSlowest': 'Plus rapide / plus lente', 'editor.analytics.averageDeviation': 'Écart moyen', 'editor.analytics.trend': 'Tendance',
    'editor.stats.words': 'mots', 'editor.stats.characters': 'caractères', 'editor.stats.readTime': 'temps de lecture',
    'editor.text.title': 'Texte', 'editor.text.label': 'Texte de présentation', 'editor.options.normal': 'Normal', 'editor.options.mirror': 'Miroir',
    'editor.options.on': 'Activé', 'editor.options.off': 'Désactivé', 'editor.actions.reset': 'Nouveau', 'editor.actions.import': 'Ouvrir un projet',
    'editor.actions.export': 'Enregistrer le projet', 'editor.save.saved': 'Enregistré dans ce navigateur.',
    'editor.save.temporary': 'Échec de l’enregistrement dans ce navigateur. Exportez un fichier projet pour conserver votre brouillon.',
    'editor.actions.preview': 'Aperçu', 'editor.actions.present': 'Présenter', 'editor.undo.action': 'Annuler',
    'editor.save.pending': 'Pas encore enregistré.',
    'editor.undo.resetReady': 'Le brouillon a été réinitialisé.', 'editor.undo.historyReady': 'L’historique des présentations a été effacé.',
    'editor.prompt.reset': 'Voulez-vous vraiment abandonner le projet actuel ? Toutes les modifications non enregistrées seront perdues.',
    'editor.prompt.resetLocal': 'Réinitialiser les données locales ? Le brouillon actuel sera supprimé de ce navigateur.',
    'editor.prompt.importReplace': 'L’ouverture d’un fichier projet remplace le brouillon local actuel. Voulez-vous continuer ?',
    'editor.alert.importTooLarge': 'Le fichier projet est trop volumineux. Choisissez un fichier .prompter de moins de 500 Ko.',
    'editor.alert.importFailure': 'Erreur lors de l’ouverture du fichier.', 'editor.alert.importReadError': 'Impossible de lire le fichier projet.',
    'editor.importError.invalidJson': 'Le fichier ne contient pas de JSON valide.', 'editor.importError.invalidObject': 'Le fichier projet n’a pas un format valide.',
    'editor.importError.unsupportedVersion': 'Seule la version 1.0 du projet est prise en charge.', 'editor.importError.missingTitle': 'Le titre du projet est absent ou invalide.',
    'editor.importError.missingText': 'Le texte du projet est absent ou invalide.', 'editor.placeholder.title': 'Nouveau projet',
    'editor.placeholder.text': 'Saisissez votre script ici ou collez-le depuis le presse-papiers…',
    'presentation.back': 'Retour', 'presentation.fullscreen': 'Plein écran', 'presentation.fullscreenExit': 'Quitter le plein écran',
    'presentation.fullscreenUnavailable': 'Plein écran indisponible', 'presentation.start': 'Démarrer', 'presentation.startHint': 'Démarrer (Espace)',
    'presentation.countdown': 'Décompte…', 'presentation.pause': 'Pause', 'presentation.resume': 'Reprendre', 'presentation.end': 'Fin',
    'presentation.reset': 'Réinitialiser', 'presentation.noScrollNeeded': 'Défilement inutile', 'presentation.speedDecrease': 'Ralentir',
    'presentation.speedIncrease': 'Accélérer', 'presentation.elapsed': 'Temps écoulé', 'presentation.remaining': 'Temps restant',
    'presentation.viewport': 'Texte du téléprompteur', 'presentation.sections': 'Sections', 'presentation.previousSection': 'Section précédente',
    'presentation.nextSection': 'Section suivante', 'preview.back': 'Fermer l’aperçu', 'preview.static': 'Aperçu', 'preview.settings': 'Paramètres de l’aperçu',
    'content.notFound': 'Page introuvable', 'content.back': 'Retour à l’application', 'content.examplesTitle': 'Projet exemple',
    'content.exampleOpen': 'Ouvrir le projet exemple', 'content.exampleConfirm': 'Le projet exemple remplacera le brouillon actuel. Continuer ?',
    'content.exampleDescription': 'Ouvrez et adaptez un projet local exemple sur la photosynthèse.', 'content.exampleLoaded': 'Le projet exemple a été ouvert.',
  },
  es: {
    'app.title': 'Prompter', 'app.tagline': 'Taller de formatos digitales', 'app.privacyBadge': 'Procesamiento local en el navegador',
    'app.footerPrivacy': 'Tu guion permanece en este navegador. Cloudflare procesa datos técnicos de conexión.',
    'app.skipLink': 'Saltar al contenido',
    'app.footerNavLabel': 'Información legal y ayuda',
    'app.footerAttribution': 'Un proyecto de haak3',
    'nav.help': 'Ayuda', 'nav.about': 'Sobre el proyecto', 'nav.support': 'Apoyar', 'nav.terms': 'Términos y condiciones', 'nav.examples': 'Ejemplos', 'nav.repository': 'Repositorio de GitHub',
    'nav.privacy': 'Privacidad', 'nav.imprint': 'Aviso legal', 'nav.github': 'GitHub', 'nav.teachers': 'Para docentes',
    'lang.switch': 'DE', 'lang.switchLabel': 'Seleccionar idioma', 'lang.label': 'Idioma',
    'editor.intro.eyebrow': 'LOCAL. EXPORTABLE. EN EL NAVEGADOR.', 'editor.intro.title': 'Perfecciona tus presentaciones.',
    'editor.intro.text': 'Prepara tus guiones y usa el teleprompter integrado para presentar con confianza. Sin cuenta ni subir archivos.',
    'editor.settings.title': 'Ajustes', 'editor.settings.projectTitle': 'Título', 'editor.settings.duration': 'Duración objetivo (minutos)',
    'editor.settings.fontSize': 'Tamaño de letra', 'editor.settings.lineHeight': 'Interlineado', 'editor.settings.theme': 'Tema',
    'editor.settings.themeLight': 'Claro', 'editor.settings.themeDark': 'Oscuro', 'editor.settings.themeHighContrast': 'Alto contraste',
    'editor.settings.fontFamily': 'Tipo de letra', 'editor.settings.textColorTheme': 'Colores del teleprompter', 'editor.settings.focusLinePosition': 'Posición de la línea de enfoque',
    'editor.font.system': 'Sistema', 'editor.font.serif': 'Serifa', 'editor.font.mono': 'Monoespaciada', 'editor.font.dyslexic': 'Fácil de leer',
    'editor.textColor.dark': 'Claro sobre oscuro', 'editor.textColor.light': 'Oscuro sobre claro', 'editor.textColor.highContrast': 'Alto contraste',
    'editor.shortcuts.title': 'Atajos de teclado', 'editor.shortcuts.preview': 'Cerrar vista previa', 'editor.shortcuts.present': 'Iniciar presentación',
    'editor.shortcuts.playPause': 'Iniciar / pausar / reanudar', 'editor.shortcuts.speed': 'Cambiar velocidad', 'editor.shortcuts.sections': 'Cambiar de sección',
    'editor.shortcuts.resetExit': 'Reiniciar / salir', 'editor.settings.focusLine': 'Mostrar línea de enfoque', 'editor.settings.mirrorMode': 'Invertir texto (modo espejo)',
    'editor.settings.countdown': 'Cuenta atrás de 3 segundos antes de empezar', 'editor.timer.presets': 'Duraciones predefinidas', 'editor.timer.custom': 'Personalizada',
    'editor.history.title': 'Historial de presentaciones', 'editor.history.clear': 'Borrar', 'editor.history.clearConfirm': '¿Borrar el historial de presentaciones de este navegador?',
    'editor.history.empty': 'Aún no hay presentaciones guardadas.', 'editor.history.completed': 'Completada', 'editor.history.cancelled': 'Cancelada',
    'editor.history.exportCsv': 'CSV', 'editor.analytics.completed': 'Presentaciones', 'editor.analytics.averageWpm': 'Velocidad media',
    'editor.analytics.fastestSlowest': 'Más rápida / más lenta', 'editor.analytics.averageDeviation': 'Desviación media', 'editor.analytics.trend': 'Tendencia',
    'editor.stats.words': 'palabras', 'editor.stats.characters': 'caracteres', 'editor.stats.readTime': 'tiempo de lectura',
    'editor.text.title': 'Texto', 'editor.text.label': 'Texto de la presentación', 'editor.options.normal': 'Normal', 'editor.options.mirror': 'Espejo',
    'editor.options.on': 'Activado', 'editor.options.off': 'Desactivado', 'editor.actions.reset': 'Nuevo', 'editor.actions.import': 'Abrir proyecto',
    'editor.actions.export': 'Guardar proyecto', 'editor.save.saved': 'Guardado en este navegador.',
    'editor.save.temporary': 'No se pudo guardar en este navegador. Exporta un archivo de proyecto para conservar el borrador.',
    'editor.actions.preview': 'Vista previa', 'editor.actions.present': 'Presentar', 'editor.undo.action': 'Deshacer',
    'editor.save.pending': 'Aún no se ha guardado.',
    'editor.undo.resetReady': 'Se ha restablecido el borrador.', 'editor.undo.historyReady': 'Se ha borrado el historial de presentaciones.',
    'editor.prompt.reset': '¿Seguro que quieres descartar el proyecto actual? Se perderán todos los cambios sin guardar.',
    'editor.prompt.resetLocal': '¿Restablecer los datos locales? El borrador actual se eliminará de este navegador.',
    'editor.prompt.importReplace': 'Al abrir un archivo de proyecto se sustituirá el borrador local actual. ¿Quieres continuar?',
    'editor.alert.importTooLarge': 'El archivo del proyecto es demasiado grande. Elige un archivo .prompter de menos de 500 KB.',
    'editor.alert.importFailure': 'Error al abrir el archivo.', 'editor.alert.importReadError': 'No se pudo leer el archivo del proyecto.',
    'editor.importError.invalidJson': 'El archivo no contiene JSON válido.', 'editor.importError.invalidObject': 'El archivo del proyecto no tiene un formato válido.',
    'editor.importError.unsupportedVersion': 'Solo se admite la versión 1.0 del proyecto.', 'editor.importError.missingTitle': 'El título del proyecto falta o no es válido.',
    'editor.importError.missingText': 'El texto del proyecto falta o no es válido.', 'editor.placeholder.title': 'Proyecto nuevo',
    'editor.placeholder.text': 'Escribe aquí tu guion o pégalo desde el portapapeles…',
    'presentation.back': 'Volver', 'presentation.fullscreen': 'Pantalla completa', 'presentation.fullscreenExit': 'Salir de pantalla completa',
    'presentation.fullscreenUnavailable': 'Pantalla completa no disponible', 'presentation.start': 'Iniciar', 'presentation.startHint': 'Iniciar (Espacio)',
    'presentation.countdown': 'Cuenta atrás…', 'presentation.pause': 'Pausar', 'presentation.resume': 'Reanudar', 'presentation.end': 'Fin',
    'presentation.reset': 'Reiniciar', 'presentation.noScrollNeeded': 'No hace falta desplazarse', 'presentation.speedDecrease': 'Reducir velocidad',
    'presentation.speedIncrease': 'Aumentar velocidad', 'presentation.elapsed': 'Tiempo transcurrido', 'presentation.remaining': 'Tiempo restante',
    'presentation.viewport': 'Texto del teleprompter', 'presentation.sections': 'Secciones', 'presentation.previousSection': 'Sección anterior',
    'presentation.nextSection': 'Sección siguiente', 'preview.back': 'Cerrar vista previa', 'preview.static': 'Vista previa', 'preview.settings': 'Ajustes de vista previa',
    'content.notFound': 'Página no encontrada', 'content.back': 'Volver a la aplicación', 'content.examplesTitle': 'Proyecto de ejemplo',
    'content.exampleOpen': 'Abrir proyecto de ejemplo', 'content.exampleConfirm': 'El proyecto de ejemplo sustituirá el borrador actual. ¿Continuar?',
    'content.exampleDescription': 'Abre y adapta un proyecto local de ejemplo sobre la fotosíntesis.', 'content.exampleLoaded': 'Se ha abierto el proyecto de ejemplo.',
  },
  nl: {
    'app.title': 'Prompter', 'app.tagline': 'Werkplaats voor digitale formats', 'app.privacyBadge': 'Lokale verwerking in de browser',
    'app.footerPrivacy': 'Je script blijft in deze browser. Cloudflare verwerkt technische verbindingsgegevens.',
    'app.skipLink': 'Naar de inhoud springen',
    'app.footerNavLabel': 'Juridische informatie en hulp',
    'app.footerAttribution': 'Een project van haak3',
    'nav.help': 'Help', 'nav.about': 'Over het project', 'nav.support': 'Steunen', 'nav.terms': 'Algemene voorwaarden', 'nav.examples': 'Voorbeelden', 'nav.repository': 'GitHub-repository',
    'nav.privacy': 'Privacy', 'nav.imprint': 'Colofon', 'nav.github': 'GitHub', 'nav.teachers': 'Voor docenten',
    'lang.switch': 'DE', 'lang.switchLabel': 'Taal kiezen', 'lang.label': 'Taal',
    'editor.intro.eyebrow': 'LOKAAL. EXPORTEERBAAR. IN DE BROWSER.', 'editor.intro.title': 'Maak je presentaties nog beter.',
    'editor.intro.text': 'Schrijf je script en gebruik de ingebouwde teleprompter om vol vertrouwen te presenteren. Zonder account en zonder uploads.',
    'editor.settings.title': 'Instellingen', 'editor.settings.projectTitle': 'Titel', 'editor.settings.duration': 'Doelduur (minuten)',
    'editor.settings.fontSize': 'Tekengrootte', 'editor.settings.lineHeight': 'Regelafstand', 'editor.settings.theme': 'Thema',
    'editor.settings.themeLight': 'Licht', 'editor.settings.themeDark': 'Donker', 'editor.settings.themeHighContrast': 'Hoog contrast',
    'editor.settings.fontFamily': 'Lettertype', 'editor.settings.textColorTheme': 'Teleprompterkleuren', 'editor.settings.focusLinePosition': 'Positie van de focuslijn',
    'editor.font.system': 'Systeem', 'editor.font.serif': 'Serif', 'editor.font.mono': 'Monospace', 'editor.font.dyslexic': 'Leesvriendelijk',
    'editor.textColor.dark': 'Licht op donker', 'editor.textColor.light': 'Donker op licht', 'editor.textColor.highContrast': 'Hoog contrast',
    'editor.shortcuts.title': 'Sneltoetsen', 'editor.shortcuts.preview': 'Voorbeeld sluiten', 'editor.shortcuts.present': 'Presentatie starten',
    'editor.shortcuts.playPause': 'Starten / pauzeren / hervatten', 'editor.shortcuts.speed': 'Snelheid aanpassen', 'editor.shortcuts.sections': 'Van onderdeel wisselen',
    'editor.shortcuts.resetExit': 'Opnieuw instellen / afsluiten', 'editor.settings.focusLine': 'Focuslijn tonen', 'editor.settings.mirrorMode': 'Tekst spiegelen (telepromptermodus)',
    'editor.settings.countdown': 'Aftellen van 3 seconden voor de start', 'editor.timer.presets': 'Timerinstellingen', 'editor.timer.custom': 'Aangepast',
    'editor.history.title': 'Presentatiegeschiedenis', 'editor.history.clear': 'Wissen', 'editor.history.clearConfirm': 'Presentatiegeschiedenis in deze browser wissen?',
    'editor.history.empty': 'Nog geen presentaties opgeslagen.', 'editor.history.completed': 'Voltooid', 'editor.history.cancelled': 'Geannuleerd',
    'editor.history.exportCsv': 'CSV', 'editor.analytics.completed': 'Presentaties', 'editor.analytics.averageWpm': 'Gemiddelde snelheid',
    'editor.analytics.fastestSlowest': 'Snelste / langzaamste', 'editor.analytics.averageDeviation': 'Gemiddelde afwijking', 'editor.analytics.trend': 'Trend',
    'editor.stats.words': 'woorden', 'editor.stats.characters': 'tekens', 'editor.stats.readTime': 'leestijd',
    'editor.text.title': 'Tekst', 'editor.text.label': 'Presentatietekst', 'editor.options.normal': 'Normaal', 'editor.options.mirror': 'Spiegel',
    'editor.options.on': 'Aan', 'editor.options.off': 'Uit', 'editor.actions.reset': 'Nieuw', 'editor.actions.import': 'Project openen',
    'editor.actions.export': 'Project opslaan', 'editor.save.saved': 'Opgeslagen in deze browser.',
    'editor.save.temporary': 'Opslaan in deze browser is mislukt. Exporteer een projectbestand om je concept te bewaren.',
    'editor.actions.preview': 'Voorbeeld', 'editor.actions.present': 'Presenteren', 'editor.undo.action': 'Ongedaan maken',
    'editor.save.pending': 'Nog niet opgeslagen.',
    'editor.undo.resetReady': 'Concept is opnieuw ingesteld.', 'editor.undo.historyReady': 'Presentatiegeschiedenis is gewist.',
    'editor.prompt.reset': 'Weet je zeker dat je het huidige project wilt weggooien? Alle niet-opgeslagen wijzigingen gaan verloren.',
    'editor.prompt.resetLocal': 'Lokale gegevens opnieuw instellen? Het huidige concept wordt uit deze browser verwijderd.',
    'editor.prompt.importReplace': 'Als je een projectbestand opent, wordt het huidige lokale concept vervangen. Doorgaan?',
    'editor.alert.importTooLarge': 'Het projectbestand is te groot. Kies een .prompter-bestand kleiner dan 500 KB.',
    'editor.alert.importFailure': 'Fout bij het openen van het bestand.', 'editor.alert.importReadError': 'Het projectbestand kon niet worden gelezen.',
    'editor.importError.invalidJson': 'Het bestand bevat geen geldige JSON.', 'editor.importError.invalidObject': 'Het projectbestand heeft geen geldig objectformaat.',
    'editor.importError.unsupportedVersion': 'Alleen projectversie 1.0 wordt ondersteund.', 'editor.importError.missingTitle': 'De projecttitel ontbreekt of is ongeldig.',
    'editor.importError.missingText': 'De projecttekst ontbreekt of is ongeldig.', 'editor.placeholder.title': 'Nieuw project',
    'editor.placeholder.text': 'Typ je script hier of plak het vanaf het klembord…',
    'presentation.back': 'Terug', 'presentation.fullscreen': 'Volledig scherm', 'presentation.fullscreenExit': 'Volledig scherm afsluiten',
    'presentation.fullscreenUnavailable': 'Volledig scherm niet beschikbaar', 'presentation.start': 'Starten', 'presentation.startHint': 'Starten (spatie)',
    'presentation.countdown': 'Aftellen…', 'presentation.pause': 'Pauzeren', 'presentation.resume': 'Hervatten', 'presentation.end': 'Einde',
    'presentation.reset': 'Opnieuw instellen', 'presentation.noScrollNeeded': 'Scrollen is niet nodig', 'presentation.speedDecrease': 'Langzamer',
    'presentation.speedIncrease': 'Sneller', 'presentation.elapsed': 'Verstreken tijd', 'presentation.remaining': 'Resterende tijd',
    'presentation.viewport': 'Telepromptertekst', 'presentation.sections': 'Onderdelen', 'presentation.previousSection': 'Vorig onderdeel',
    'presentation.nextSection': 'Volgend onderdeel', 'preview.back': 'Voorbeeld sluiten', 'preview.static': 'Voorbeeld', 'preview.settings': 'Voorbeeldinstellingen',
    'content.notFound': 'Pagina niet gevonden', 'content.back': 'Terug naar de app', 'content.examplesTitle': 'Voorbeeldproject',
    'content.exampleOpen': 'Voorbeeldproject openen', 'content.exampleConfirm': 'Het voorbeeldproject vervangt het huidige concept. Doorgaan?',
    'content.exampleDescription': 'Open en bewerk een lokaal voorbeeldproject over fotosynthese.', 'content.exampleLoaded': 'Het voorbeeldproject is geopend.',
  }
};

export function t(key: TranslationKey): string {
  const lang = store.getState().language;
  return translations[lang][key] || key;
}
