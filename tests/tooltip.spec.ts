import { test, expect } from '@playwright/test';
import { ROUTES } from './helpers/navigation';

/** Modal & Overlays > Tooltip. */
test.describe('Tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.tooltip);
    await expect(page.locator('nb-card-header', { hasText: 'Tooltip With Icon' })).toBeVisible();
  });

  test('shows a tooltip on hover', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Tooltip With Icon' });
    await card.getByRole('button', { name: 'Show Tooltip' }).first().hover();

    const tooltip = page.locator('nb-tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('This is a tooltip');
  });

  test('hides the tooltip when the pointer leaves', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Tooltip With Icon' });
    await card.getByRole('button', { name: 'Show Tooltip' }).first().hover();
    await expect(page.locator('nb-tooltip')).toBeVisible();

    // Move the pointer away.
    await page.locator('nb-card-header', { hasText: 'Tooltip With Icon' }).hover();
    await expect(page.locator('nb-tooltip')).toBeHidden();
  });

  test('shows tooltips for each placement', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Tooltip Placements' });
    for (const name of ['Top', 'Right', 'Bottom', 'Left']) {
      await card.getByRole('button', { name, exact: true }).hover();
      await expect(page.locator('nb-tooltip')).toContainText('This is a tooltip');
      // Move away to dismiss before the next placement.
      await page.locator('nb-card-header', { hasText: 'Tooltip Placements' }).hover();
    }
  });
});
