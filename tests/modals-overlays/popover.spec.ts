import { test, expect } from '@playwright/test';
import { ROUTES } from '../helpers/navigation';

/** Modal & Overlays > Popover. */
test.describe('Popover', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.popover);
    await expect(page.locator('nb-card-header', { hasText: 'Simple Popovers' })).toBeVisible();
  });

  test('shows a popover on click', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Simple Popovers' });
    await card.getByRole('button', { name: 'on click' }).click();

    const popover = page.locator('nb-popover');
    await expect(popover).toBeVisible();
    await expect(popover).toContainText('Hello, how are you today?');

    // Clicking again toggles it off.
    await card.getByRole('button', { name: 'on click' }).click();
    await expect(page.locator('nb-popover')).toBeHidden();
  });

  test('shows a popover on hover', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Simple Popovers' });
    await card.getByRole('button', { name: 'on hover' }).hover();
    await expect(page.locator('nb-popover')).toContainText('Hello, how are you today?');
  });

  test('renders a template popover with tabs', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Template Popovers' });
    await card.getByRole('button', { name: 'With tabs' }).click();

    const popover = page.locator('nb-popover');
    await expect(popover.locator('nb-tabset')).toBeVisible();
    await expect(popover).toContainText("What's up?");
  });

  test('renders a template popover with a card', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Template Popovers' });
    await card.getByRole('button', { name: 'With card' }).click();
    await expect(page.locator('nb-popover')).toContainText('Hello!');
  });
});
