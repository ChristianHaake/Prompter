import { readFile } from 'node:fs/promises';
import { test, expect } from '@playwright/test';

const locales = {
  de: {
    preview: 'Vorschau', present: 'Präsentieren', import: 'Projekt öffnen', export: 'Projekt speichern',
    saved: 'Im Browser gespeichert.', importError: 'Fehler beim Öffnen der Datei. Die Datei enthält kein gültiges JSON.',
    history: 'Pitch-Verlauf',
    previewBack: 'Vorschau schließen', back: 'Zurück', fullscreen: 'Vollbild', faster: 'Geschwindigkeit erhöhen',
    helpBody: 'lokaler Browser-Teleprompter',
    headings: ['Hilfe', 'Über Prompter', 'Für Lehrkräfte', 'Unterstützen', 'Nutzungsbedingungen (AGB)', 'Datenschutzerklärung', 'Impressum'],
    example: 'Beispielprojekt', exampleAction: 'Beispielprojekt öffnen', exampleBody: 'lokales Beispielprojekt zur Photosynthese',
  },
  en: {
    preview: 'Preview', present: 'Present', import: 'Open Project', export: 'Save Project',
    saved: 'Saved in this browser.', importError: 'Error opening the file. The file does not contain valid JSON.',
    history: 'Pitch history',
    previewBack: 'Close preview', back: 'Back', fullscreen: 'Fullscreen', faster: 'Increase speed',
    helpBody: 'local browser teleprompter',
    headings: ['Help', 'About Prompter', 'For Teachers', 'Support Prompter', 'Terms and conditions', 'Privacy Policy', 'Imprint'],
    example: 'Example project', exampleAction: 'Open example project', exampleBody: 'local photosynthesis example project',
  },
  fr: {
    preview: 'Aperçu', present: 'Présenter', import: 'Ouvrir un projet', export: 'Enregistrer le projet',
    saved: 'Enregistré dans ce navigateur.', importError: 'Erreur lors de l’ouverture du fichier. Le fichier ne contient pas de JSON valide.',
    history: 'Historique des présentations',
    previewBack: 'Fermer l’aperçu', back: 'Retour', fullscreen: 'Plein écran', faster: 'Accélérer',
    helpBody: 'téléprompteur local dans le navigateur',
    headings: ['Aide', 'À propos de Prompter', 'Pour les enseignants', 'Soutenir Prompter', 'Conditions d’utilisation (AGB)', 'Politique de confidentialité', 'Mentions légales'],
    example: 'Projet exemple', exampleAction: 'Ouvrir le projet exemple', exampleBody: 'projet local exemple sur la photosynthèse',
  },
  es: {
    preview: 'Vista previa', present: 'Presentar', import: 'Abrir proyecto', export: 'Guardar proyecto',
    saved: 'Guardado en este navegador.', importError: 'Error al abrir el archivo. El archivo no contiene JSON válido.',
    history: 'Historial de presentaciones',
    previewBack: 'Cerrar vista previa', back: 'Volver', fullscreen: 'Pantalla completa', faster: 'Aumentar velocidad',
    helpBody: 'teleprónter local que funciona en el navegador',
    headings: ['Ayuda', 'Acerca de Prompter', 'Para docentes', 'Apoyar', 'Condiciones de uso (AGB)', 'Política de privacidad', 'Aviso legal'],
    example: 'Proyecto de ejemplo', exampleAction: 'Abrir proyecto de ejemplo', exampleBody: 'proyecto local de ejemplo sobre la fotosíntesis',
  },
  nl: {
    preview: 'Voorbeeld', present: 'Presenteren', import: 'Project openen', export: 'Project opslaan',
    saved: 'Opgeslagen in deze browser.', importError: 'Fout bij het openen van het bestand. Het bestand bevat geen geldige JSON.',
    history: 'Presentatiegeschiedenis',
    previewBack: 'Voorbeeld sluiten', back: 'Terug', fullscreen: 'Volledig scherm', faster: 'Sneller',
    helpBody: 'lokale teleprompter in de browser',
    headings: ['Hulp', 'Over Prompter', 'Voor docenten', 'Steunen', 'Gebruiksvoorwaarden (algemene voorwaarden)', 'Privacyverklaring', 'Colofon'],
    example: 'Voorbeeldproject', exampleAction: 'Voorbeeldproject openen', exampleBody: 'lokaal voorbeeldproject over fotosynthese',
  },
} as const;

const routes = ['hilfe', 'ueber', 'fuer-lehrkraefte', 'unterstuetzung', 'agb', 'datenschutz', 'impressum'];

for (const [language, expected] of Object.entries(locales)) {
  test(`${language}: localized core workflow, content, errors and exports`, async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('prompter_pitch_history_v1', JSON.stringify({
        version: 1,
        records: [{
          id: 'locale-run', date: '2026-11-26T12:00:00.000Z', targetDurationSeconds: 60,
          actualDurationSeconds: 50, wordCount: 100, status: 'completed',
        }],
      }));
    });
    await page.goto('/');
    await page.locator('#lang-select').selectOption(language);
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('#btn-preview')).toHaveText(expected.preview);
    await expect(page.locator('#btn-present')).toHaveText(expected.present);
    await expect(page.locator('#btn-import')).toHaveText(expected.import);
    await expect(page.locator('#btn-export')).toHaveText(expected.export);
    await expect(page.locator('#pitch-history-title')).toHaveText(expected.history);

    await page.locator('#project-title').fill(`Locale ${language}`);
    await page.locator('#project-text').fill(`# Locale ${language}\n\nA persistent draft.`);
    await expect(page.locator('#save-status')).toHaveText(expected.saved);
    await page.reload();
    await expect(page.locator('#lang-select')).toHaveValue(language);
    await expect(page.locator('#project-text')).toHaveValue(`# Locale ${language}\n\nA persistent draft.`);

    const projectDownload = page.waitForEvent('download');
    await page.locator('#btn-export').click();
    const exportedProjectPath = await (await projectDownload).path();
    expect(exportedProjectPath).toBeTruthy();
    const exportedProject = JSON.parse(await readFile(exportedProjectPath!, 'utf8'));
    expect(exportedProject.title).toBe(`Locale ${language}`);
    expect(exportedProject.text).toContain('A persistent draft.');

    const csvDownload = page.waitForEvent('download');
    await page.locator('#btn-export-pitch-history').click();
    const csvPath = await (await csvDownload).path();
    expect(csvPath).toBeTruthy();
    const csv = await readFile(csvPath!, 'utf8');
    expect(csv).toContain('locale-run');
    expect(csv).toContain('wordsPerMinute');

    const alertText = new Promise<string>(resolve => page.once('dialog', dialog => {
      resolve(dialog.message());
      void dialog.accept();
    }));
    await page.setInputFiles('#file-import', {
      name: 'invalid.prompter', mimeType: 'application/json', buffer: Buffer.from('{invalid'),
    });
    expect(await alertText).toBe(expected.importError);
    await expect(page.locator('#project-text')).toHaveValue(`# Locale ${language}\n\nA persistent draft.`);

    await page.locator('#btn-preview').click();
    await expect(page.locator('#prompter-text')).toContainText('A persistent draft.');
    await expect(page.locator('#btn-exit')).toContainText(expected.previewBack);
    await page.keyboard.press('Escape');
    await page.locator('#btn-present').click();
    await expect(page.locator('#prompter-text')).toContainText('A persistent draft.');
    await expect(page.locator('#btn-exit')).toContainText(expected.back);
    await expect(page.locator('#btn-fullscreen')).toHaveText(expected.fullscreen);
    await expect(page.locator('#btn-faster')).toHaveAttribute('aria-label', expected.faster);
    await page.keyboard.press('Escape');

    for (const [index, route] of routes.entries()) {
      await page.goto(`/#/${route}`);
      await expect(page.locator('.markdown-body h1')).toHaveText(expected.headings[index]);
      if (route === 'hilfe') await expect(page.locator('.markdown-body')).toContainText(expected.helpBody);
    }
    await page.goto('/#/beispiele');
    await expect(page.locator('h1')).toHaveText(expected.example);
    await expect(page.locator('#load-example')).toHaveText(expected.exampleAction);
    await expect(page.locator('.markdown-body')).toContainText(expected.exampleBody);
    await page.goto('/');
    await expect(page.locator('#project-text')).toHaveValue(`# Locale ${language}\n\nA persistent draft.`);
  });
}
