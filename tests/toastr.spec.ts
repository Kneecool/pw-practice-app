import { test, expect } from '@playwright/test';
import { ROUTES } from './helpers/navigation';

/** Modal & Overlays > Toastr. */
test.describe('Toastr', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.toastr);
    await expect(page.locator('nb-card-header', { hasText: 'Toaster configuration' })).toBeVisible();
  });

  test('shows a configured toast with custom title and content', async ({ page }) => {
    await page.locator('input[name="title"]').fill('Automation Title');
    await page.locator('input[name="content"]').fill('Automation content body');

    // The type select is the one in the config card that is not the position select.
    const typeSelect = page
      .locator('nb-card', { hasText: 'Toaster configuration' })
      .locator('nb-select:not(.position-select)');
    await typeSelect.click();
    await page.locator('nb-option', { hasText: 'success' }).click();

    await page.getByRole('button', { name: 'Show toast', exact: true }).click();

    const toast = page.locator('nb-toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Automation Title');
    await expect(toast).toContainText('Automation content body');
  });

  test('shows a random toast', async ({ page }) => {
    await page.getByRole('button', { name: 'Random toast' }).click();
    await expect(page.locator('nb-toast').first()).toBeVisible();
  });

  test('changing position moves the toast container', async ({ page }) => {
    const positionSelect = page.locator('nb-select.position-select');
    await positionSelect.click();
    await page.locator('nb-option', { hasText: 'bottom-right' }).click();

    await page.getByRole('button', { name: 'Show toast', exact: true }).click();
    await expect(page.locator('nb-toast').first()).toBeVisible();
  });

  test('toast can be dismissed on click', async ({ page }) => {
    // Make the toast persistent (0 = no auto-hide) so the click is what dismisses it.
    await page.locator('input[name="timeout"]').fill('0');
    // "Hide on click" is enabled by default; click the toast to dismiss it.
    await page.getByRole('button', { name: 'Show toast', exact: true }).click();
    const toast = page.locator('nb-toast').first();
    await expect(toast).toBeVisible();
    await toast.click();
    await expect(toast).toBeHidden();
  });
});
