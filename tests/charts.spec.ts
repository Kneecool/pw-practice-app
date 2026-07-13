import { test, expect } from '@playwright/test';
import { ROUTES } from './helpers/navigation';

/** Charts > Echarts. */
test.describe('Echarts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.echarts);
    await expect(page.locator('nb-card-header', { hasText: 'Pie' })).toBeVisible();
  });

  test('renders every showcased chart card', async ({ page }) => {
    // Exact match so "Bar" does not also match "Bar Animation".
    for (const title of ['Pie', 'Bar', 'Line', 'Multiple x-axis', 'Area Stack', 'Bar Animation', 'Radar']) {
      await expect(page.locator('nb-card-header').getByText(title, { exact: true })).toBeVisible();
    }
  });

  test('each chart draws a canvas', async ({ page }) => {
    const canvases = page.locator('nb-card-body canvas');
    // One canvas per chart card (7 charts).
    await expect(async () => {
      expect(await canvases.count()).toBeGreaterThanOrEqual(7);
    }).toPass();
    await expect(canvases.first()).toBeVisible();
  });

  test('charts have non-zero dimensions', async ({ page }) => {
    const firstCanvas = page.locator('nb-card-body canvas').first();
    const box = await firstCanvas.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(0);
    expect(box?.height ?? 0).toBeGreaterThan(0);
  });
});
