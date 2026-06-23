import { readFile } from 'node:fs/promises';
import { test, expect, type Page } from '@playwright/test';

async function disableCountdown(page: Page) {
  await page
    .locator('.field')
    .filter({ hasText: '3-Sekunden Countdown' })
    .locator('label')
    .filter({ hasText: 'Aus' })
    .click();
}

test('has title, brand logo, and GitHub footer button', async ({ page }) => {
  const response = await page.goto('/');
  const csp = response?.headers()['content-security-policy'] ?? '';
  expect(csp).toContain("style-src 'self'");
  expect(csp).toContain('https://static.cloudflareinsights.com/beacon.min.js');

  await expect(page).toHaveTitle(/Prompter/);
  await expect(page.locator('.brand__logo')).toBeVisible();
  await expect(page.locator('.brand__logo')).toHaveAttribute('alt', 'Prompter Logo');

  const githubLink = page.locator('.github-link');
  await expect(githubLink).toBeVisible();
  await expect(githubLink).toHaveAttribute('href', 'https://github.com/ChristianHaake/Prompter');
  await expect(githubLink).toContainText('GitHub');
});

test('can type text and use presentation controls', async ({ page }) => {
  await page.goto('/');

  await disableCountdown(page);
  await page.locator('[data-timer-preset="30"]').click();
  await expect(page.locator('#project-duration')).toHaveValue('0.5');
  await page.locator('#project-duration').fill('0.5');
  await page.locator('#project-text').fill('Willkommen zum Teleprompter Test!\n\n'.repeat(30));
  await expect(page.locator('#word-count')).toHaveText('120');
  await expect(page.locator('#read-time')).toHaveText('0:55');
  await page.locator('#btn-present').click();

  await expect(page.locator('#prompter-text')).toContainText('Willkommen zum Teleprompter Test!');
  await expect(page.locator('#btn-playpause')).toHaveText('Start');

  await page.keyboard.press('Space');
  await expect(page.locator('#btn-playpause')).toHaveText('Pause');
  await page.waitForTimeout(200);

  await page.keyboard.press('Space');
  await expect(page.locator('#btn-playpause')).toHaveText('Weiter');

  await page.keyboard.press('ArrowUp');
  await expect(page.locator('.speed-indicator')).toHaveText('1.1x');

  await page.keyboard.press('KeyR');
  await expect(page.locator('#time-elapsed')).toHaveText('0:00');

  await page.keyboard.press('Escape');
  await expect(page.locator('.pitch-history')).toContainText('Abgebrochen');
});

test('preview reflects settings without recording pitch history', async ({ page }) => {
  await page.goto('/');

  await page.locator('#project-text').fill('# Abschnitt\n\nVorschau Text');
  await page.locator('#btn-preview').click();
  await expect(page.locator('#prompter-text h1')).toHaveText('Abschnitt');
  await expect(page.locator('#btn-playpause')).toBeDisabled();

  await page.locator('#preview-fontsize').fill('80');
  await page.keyboard.press('Space');
  await expect(page.locator('#btn-playpause')).toHaveText('Vorschau');
  await expect(page.locator('#time-elapsed')).toHaveText('0:00');
  await page.keyboard.press('KeyR');
  await expect(page.locator('#time-elapsed')).toHaveText('0:00');
  await expect(page.locator('#prompter-text')).toHaveCSS('font-size', '80px');
  await page.locator('#preview-mirror').selectOption('true');
  await expect
    .poll(async () => page.locator('#prompter-text').evaluate(el => (el as HTMLElement).style.transform))
    .toContain('scaleX(-1)');

  await page.keyboard.press('Escape');
  await expect(page.locator('.pitch-history')).toContainText('Noch keine Durchläufe gespeichert.');
});

test('short presentations keep timer progress even when no scrolling is needed', async ({ page }) => {
  await page.goto('/');

  await disableCountdown(page);
  await page.locator('#project-duration').fill('0.5');
  await page.locator('#project-text').fill('Kurz.');
  await page.locator('#btn-present').click();

  await page.keyboard.press('Space');
  await page.waitForTimeout(250);

  await expect(page.locator('#time-remaining')).not.toHaveText('0:00');
  await expect(page.locator('#btn-playpause')).toHaveText('Pause');
});

test('completed presentation runs are recorded once', async ({ page }) => {
  await page.goto('/');

  await disableCountdown(page);
  await page.locator('#project-duration').fill('0.1');
  await page.locator('#project-text').fill('Automatischer Abschluss\n\n'.repeat(220));
  await page.locator('#btn-present').click();

  for (let index = 0; index < 30; index++) {
    await page.keyboard.press('ArrowUp');
  }
  await page.keyboard.press('Space');

  await expect(page.locator('#btn-playpause')).toHaveText('Ende', { timeout: 8000 });
  await page.keyboard.press('Escape');

  await expect(page.locator('.pitch-history')).toContainText('Abgeschlossen');
  await expect(page.locator('.pitch-history__item')).toHaveCount(1);
});

test('imported project immediately updates the visible editor', async ({ page }) => {
  await page.goto('/');
  await page.locator('#project-text').fill('Aktueller Entwurf');

  await page.setInputFiles('#file-import', {
    name: 'import.prompter',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        version: '1.0',
        title: 'Importiert',
        text: 'Importierter Text',
        targetDurationSeconds: 120,
        manualSpeed: 1,
        fontSize: 64,
        lineHeight: 1.5,
        theme: 'light',
        mirrorMode: false,
        focusLine: true,
        countdownEnabled: false,
        updatedAt: new Date().toISOString(),
      }),
    ),
  });

  await expect(page.locator('#project-title')).toHaveValue('Importiert');
  await expect(page.locator('#project-text')).toHaveValue('Importierter Text');
  await expect(page.locator('#project-fontsize')).toHaveValue('64');
});

test('imports text and markdown scripts directly into the editor', async ({ page }) => {
  await page.goto('/');

  await page.setInputFiles('#file-import', {
    name: 'pitch-notizen.md',
    mimeType: 'text/markdown',
    buffer: Buffer.from('# Pitch\n\nDirekt importierter Skripttext.'),
  });

  await expect(page.locator('#project-title')).toHaveValue('pitch-notizen');
  await expect(page.locator('#project-text')).toHaveValue('# Pitch\n\nDirekt importierter Skripttext.');
});

test('rejects oversized project files without modifying the draft', async ({ page }) => {
  page.on('dialog', dialog => dialog.accept());

  await page.goto('/');
  await page.locator('#project-text').fill('Bleibt erhalten');

  await page.setInputFiles('#file-import', {
    name: 'too-large.prompter',
    mimeType: 'application/json',
    buffer: Buffer.from('x'.repeat(500_001)),
  });

  await expect(page.locator('#project-text')).toHaveValue('Bleibt erhalten');
});


test('loads and clears pitch history from local storage', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'prompter_pitch_history_v1',
      JSON.stringify({
        version: 1,
        records: [
          {
            id: 'run-1',
            date: '2026-01-02T03:04:05.000Z',
          targetDurationSeconds: 90,
          actualDurationSeconds: 75,
          wordCount: 180,
          status: 'completed',
        },
        ],
      }),
    );
  });
  page.on('dialog', dialog => dialog.accept());

  await page.goto('/');

  await expect(page.locator('.pitch-history')).toContainText('Pitch-Verlauf');
  await expect(page.locator('.pitch-history')).toContainText('Abgeschlossen');
  await expect(page.locator('.pitch-history')).toContainText('1:15');
  await expect(page.locator('#analytics-panel')).toContainText('144 WPM');
  await page.locator('#btn-clear-pitch-history').click();
  await expect(page.locator('.pitch-history')).toContainText('Noch keine Durchläufe gespeichert.');
});

test('undo restores reset draft and cleared pitch history', async ({ page }) => {
  page.on('dialog', dialog => dialog.accept());

  await page.goto('/');
  await page.locator('#project-title').fill('Undo Projekt');
  await page.locator('#project-text').fill('Dieser Entwurf kommt zurueck.');
  await page.locator('#btn-reset-project').click();
  await page.locator('#btn-undo-last-action').click();
  await expect(page.locator('#project-title')).toHaveValue('Undo Projekt');
  await expect(page.locator('#project-text')).toHaveValue('Dieser Entwurf kommt zurueck.');

  await page.evaluate(() => {
    window.localStorage.setItem(
      'prompter_pitch_history_v1',
      JSON.stringify({
        version: 1,
        records: [
          {
            id: 'run-undo',
            date: '2026-01-02T03:04:05.000Z',
            targetDurationSeconds: 60,
            actualDurationSeconds: 60,
            wordCount: 120,
            status: 'completed',
          },
        ],
      }),
    );
  });
  await page.reload();
  await page.locator('#btn-clear-pitch-history').click();
  await page.locator('#btn-undo-last-action').click();
  await expect(page.locator('.pitch-history')).toContainText('Abgeschlossen');
});

test('reset clears pending editor text updates', async ({ page }) => {
  page.on('dialog', dialog => dialog.accept());

  await page.goto('/');
  await page.locator('#project-text').fill('This pending text must not return after reset.');
  await page.locator('#btn-reset-project').click();

  await expect(page.locator('#project-text')).toHaveValue(/Hallo und herzlich willkommen/);
  await page.waitForTimeout(250);
  await expect(page.locator('#project-text')).toHaveValue(/Hallo und herzlich willkommen/);
});

test('language switch updates visible and accessible shell text', async ({ page }) => {
  await page.goto('/');

  await page.locator('#lang-switch-btn').click();

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#lang-switch-btn')).toHaveAttribute('aria-label', 'Switch language');
  await expect(page.locator('#btn-present')).toContainText('Present');

  await page.goto('/#/datenschutz');
  await expect(page.locator('.markdown-body h1')).toHaveText('Privacy Policy');
  await expect(page.locator('.markdown-body')).toContainText('Cloudflare Web Analytics');
  await expect(page.locator('.markdown-body')).not.toContainText('No Tracking');
});

test('export and sanitized presentation work under production CSP', async ({ page }) => {
  const cspErrors: string[] = [];
  page.on('console', message => {
    const text = message.text();
    if (/Content Security Policy|violates|Refused/.test(text)) {
      cspErrors.push(text);
    }
  });

  await page.goto('/');
  await disableCountdown(page);
  await page.locator('#project-title').fill('Runtime / Audit: File?');
  await page.locator('#project-fontsize').fill('72');
  await page.locator('#project-lineheight').fill('1.8');
  await page.locator('#project-fontfamily').selectOption('serif');
  await page.locator('#project-textcolor').selectOption('highContrast');
  await page.locator('#project-text').fill('# Heading\n\n<img src=x onerror="window.__xss=1">[bad](javascript:alert(1))\n\n**safe**');

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#btn-export').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('Runtime - Audit- File-.prompter');

  const path = await download.path();
  expect(path).toBeTruthy();
  const exported = JSON.parse(await readFile(path!, 'utf8'));
  expect(exported.title).toBe('Runtime / Audit: File?');
  expect(exported.text).toContain('window.__xss');
  expect(exported.lineHeight).toBe(1.8);
  expect(exported.fontFamily).toBe('serif');
  expect(exported.textColorTheme).toBe('highContrast');

  await page.locator('input[name="focusLine"][value="true"]').check({ force: true });
  await page.locator('input[name="mirror"][value="true"]').check({ force: true });
  await page.locator('#btn-present').click();

  await expect(page.locator('#prompter-text')).toBeVisible();
  await expect(page.locator('#prompter-text h1')).toHaveText('Heading');
  await expect(page.locator('.focus-line')).toBeVisible();
  await expect(page.locator('#prompter-text')).toHaveCSS('font-size', '72px');
  await expect(page.locator('#prompter-text')).toHaveCSS('line-height', '129.6px');
  await expect(page.locator('#prompter-text')).not.toContainText('javascript:');
  const renderedHtml = await page.locator('#prompter-text').innerHTML();
  expect(renderedHtml).not.toContain('onerror');
  expect(renderedHtml).not.toContain('javascript:');
  expect(await page.locator('#prompter-text').evaluate(el => el.style.transform)).toContain('scaleX(-1)');
  expect(cspErrors).toEqual([]);
});

test('analytics history exports as CSV', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'prompter_pitch_history_v1',
      JSON.stringify({
        version: 1,
        records: [
          {
            id: 'run,csv',
            date: '2026-01-02T03:04:05.000Z',
            targetDurationSeconds: 60,
            actualDurationSeconds: 45,
            wordCount: 120,
            status: 'completed',
          },
        ],
      }),
    );
  });
  await page.goto('/');

  await expect(page.locator('#analytics-panel')).toContainText('160 WPM');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#btn-export-pitch-history').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('pitch-history.csv');
  const path = await download.path();
  expect(path).toBeTruthy();
  const csv = await readFile(path!, 'utf8');
  expect(csv).toContain('"run,csv"');
  expect(csv).toContain('wordsPerMinute');
});

test('content routes render concrete pages', async ({ page }) => {
  await page.goto('/#/hilfe');
  await expect(page.locator('.markdown-body h1')).toHaveText('Hilfe');
  await expect(page.locator('.markdown-body')).toContainText('Projekt speichern');

  await page.goto('/#/datenschutz');
  await expect(page.locator('.markdown-body h1')).toHaveText('Datenschutzerklärung');
  await expect(page.locator('.markdown-body')).toContainText('prompter_project_v1');
});

test('mobile editor and presentation do not overflow horizontally', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect
    .poll(async () => page.evaluate(() => document.body.scrollWidth <= window.innerWidth))
    .toBe(true);

  await disableCountdown(page);
  await page.locator('#project-text').fill('Mobiler Prompter Test\n\n'.repeat(40));
  await page.locator('#btn-present').click();

  await expect(page.locator('#prompter-text')).toBeVisible();
  await expect
    .poll(async () => page.evaluate(() => document.body.scrollWidth <= window.innerWidth))
    .toBe(true);
});
