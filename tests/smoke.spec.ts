import { test, expect } from '@playwright/test';

test('has title and brand mark', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Prompter/);

  // Expect the brand mark "P" to be visible
  const brandMark = page.locator('.brand__mark');
  await expect(brandMark).toBeVisible();
  await expect(brandMark).toHaveText('P');
});

test('can type text and start presentation', async ({ page }) => {
  await page.goto('/');

  // Enter text in editor
  const editor = page.locator('#project-text');
  await editor.fill('Willkommen zum Teleprompter Test!');

  // Start presentation
  const presentBtn = page.locator('#btn-present');
  await presentBtn.click();

  // Verify presentation view is active and text is present
  const prompterText = page.locator('#prompter-text');
  await expect(prompterText).toBeVisible();
  await expect(prompterText).toContainText('Willkommen zum Teleprompter Test!');
});
