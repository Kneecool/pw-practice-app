import { test, expect } from '@playwright/test';
import { ROUTES } from './helpers/navigation';

/** Modal & Overlays > Window. */
test.describe('Window', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.window);
    await expect(page.getByRole('button', { name: 'Open window form' })).toBeVisible();
  });

  test('opens the window form, fills it and closes it', async ({ page }) => {
    await page.getByRole('button', { name: 'Open window form' }).click();

    const win = page.locator('nb-window');
    await expect(win).toBeVisible();
    await expect(win).toContainText('Window');

    await win.locator('#subject').fill('Automated subject');
    await win.locator('#text').fill('Some window body text');
    await expect(win.locator('#subject')).toHaveValue('Automated subject');

    // Header close button (last control in the window title bar).
    await win.locator('button').last().click();
    await expect(page.locator('nb-window')).toBeHidden();
  });

  test('opens a window from a template with passed context', async ({ page }) => {
    await page.getByRole('button', { name: 'Open window with template' }).first().click();

    const win = page.locator('nb-window');
    await expect(win).toContainText('Window content from template');
    await expect(win).toContainText('some text to pass into template');
  });

  test('opens a window without backdrop', async ({ page }) => {
    await page.getByRole('button', { name: 'Open window without backdrop' }).click();
    await expect(page.locator('nb-window')).toContainText('Window without backdrop');
  });
});
