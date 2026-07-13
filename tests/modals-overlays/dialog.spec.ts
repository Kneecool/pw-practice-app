import { test, expect } from '@playwright/test';
import { ROUTES } from '../helpers/navigation';

/** Modal & Overlays > Dialog. */
test.describe('Dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.dialog);
    await expect(page.getByRole('button', { name: 'Open Dialog with component' }).first()).toBeVisible();
  });

  test('opens a component dialog and dismisses it', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Dialog with component' }).first().click();

    const dialog = page.locator('nb-dialog-container');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Dismiss Dialog' })).toBeVisible();

    await dialog.getByRole('button', { name: 'Dismiss Dialog' }).click();
    await expect(dialog).toBeHidden();
  });

  test('opens a template dialog and closes it', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Dialog with template' }).click();

    const dialog = page.locator('nb-dialog-container');
    await expect(dialog).toContainText('Template Dialog');
    await dialog.getByRole('button', { name: 'Close Dialog' }).click();
    await expect(dialog).toBeHidden();
  });

  test('template dialog closes on Escape', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Dialog with esc close' }).first().click();
    await expect(page.locator('nb-dialog-container')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('nb-dialog-container')).toBeHidden();
  });

  test('returns a name from the prompt dialog and lists it', async ({ page }) => {
    await page.getByRole('button', { name: 'Enter Name' }).click();

    const dialog = page.locator('nb-dialog-container');
    await expect(dialog).toContainText('Enter your name');
    await dialog.getByPlaceholder('Name').fill('Nicole');
    await dialog.getByRole('button', { name: 'Submit' }).click();

    await expect(dialog).toBeHidden();
    await expect(page.locator('.result-from-dialog li', { hasText: 'Nicole' })).toBeVisible();
  });

  test('prompt dialog can be cancelled without adding a name', async ({ page }) => {
    await page.getByRole('button', { name: 'Enter Name' }).click();
    const dialog = page.locator('nb-dialog-container');
    await dialog.getByPlaceholder('Name').fill('ShouldNotAppear');
    await dialog.getByRole('button', { name: 'Cancel' }).click();

    await expect(dialog).toBeHidden();
    await expect(page.locator('.result-from-dialog li', { hasText: 'ShouldNotAppear' })).toHaveCount(0);
  });
});
