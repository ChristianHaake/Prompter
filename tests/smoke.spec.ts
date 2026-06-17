import { test, expect, type Page } from '@playwright/test';

async function disableCountdown(page: Page) {
  await page
    .locator('.field')
    .filter({ hasText: '3-Sekunden Countdown' })
    .locator('label')
    .filter({ hasText: 'Aus' })
    .click();
}

test('has title, brand mark, and GitHub footer button', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Prompter/);
  await expect(page.locator('.brand__mark')).toHaveText('P');

  const githubLink = page.locator('.github-link');
  await expect(githubLink).toBeVisible();
  await expect(githubLink).toHaveAttribute('href', 'https://github.com/ChristianHaake/Prompter');
  await expect(githubLink).toContainText('GitHub');
});

test('can type text and use presentation controls', async ({ page }) => {
  await page.goto('/');

  await disableCountdown(page);
  await page.locator('#project-duration').fill('0.5');
  await page.locator('#project-text').fill('Willkommen zum Teleprompter Test!\n\n'.repeat(30));
  await page.locator('#btn-present').click();

  await expect(page.locator('#prompter-text')).toContainText('Willkommen zum Teleprompter Test!');
  await expect(page.locator('#btn-playpause')).toHaveText('Start');

  await page.keyboard.press('Space');
  await expect(page.locator('#btn-playpause')).toHaveText('Pause');

  await page.keyboard.press('Space');
  await expect(page.locator('#btn-playpause')).toHaveText('Fortsetzen');

  await page.keyboard.press('ArrowUp');
  await expect(page.locator('.speed-indicator')).toHaveText('1.1x');

  await page.keyboard.press('KeyR');
  await expect(page.locator('#time-elapsed')).toHaveText('0:00');
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

test('content routes render concrete pages', async ({ page }) => {
  await page.goto('/#/hilfe');
  await expect(page.locator('.markdown-body h1')).toHaveText('Hilfe');
  await expect(page.locator('.markdown-body')).toContainText('Projekt exportieren');

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
