import { test, expect } from '@playwright/test';
import { openMenuItem } from './helpers/navigation';

/**
 * Cross-cutting layout & navigation: sidebar menu routing, header controls,
 * theme switcher and sidebar collapse.
 */
test.describe('Navigation & Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nb-menu')).toBeVisible();
  });

  test('lands on the IoT Dashboard by default', async ({ page }) => {
    await expect(page).toHaveURL(/\/pages\/iot-dashboard/);
    await expect(page.locator('a.logo')).toContainText('PW-');
  });

  const menuCases: Array<[string, string, RegExp]> = [
    ['Forms', 'Form Layouts', /\/pages\/forms\/layouts/],
    ['Forms', 'Datepicker', /\/pages\/forms\/datepicker/],
    ['Modal & Overlays', 'Dialog', /\/pages\/modal-overlays\/dialog/],
    ['Modal & Overlays', 'Window', /\/pages\/modal-overlays\/window/],
    ['Modal & Overlays', 'Popover', /\/pages\/modal-overlays\/popover/],
    ['Modal & Overlays', 'Toastr', /\/pages\/modal-overlays\/toastr/],
    ['Modal & Overlays', 'Tooltip', /\/pages\/modal-overlays\/tooltip/],
    ['Extra Components', 'Calendar', /\/pages\/extra-components\/calendar/],
    ['Charts', 'Echarts', /\/pages\/charts\/echarts/],
    ['Tables & Data', 'Smart Table', /\/pages\/tables\/smart-table/],
    ['Tables & Data', 'Tree Grid', /\/pages\/tables\/tree-grid/],
  ];

  for (const [group, child, urlRe] of menuCases) {
    test(`sidebar navigates to ${group} > ${child}`, async ({ page }) => {
      await openMenuItem(page, group, child);
      await expect(page).toHaveURL(urlRe);
    });
  }

  test('sidebar toggle collapses and expands the menu', async ({ page }) => {
    const sidebar = page.locator('nb-sidebar');
    await expect(sidebar).toHaveClass(/expanded/);

    await page.locator('a.sidebar-toggle').click();
    await expect(sidebar).toHaveClass(/compacted/);

    await page.locator('a.sidebar-toggle').click();
    await expect(sidebar).toHaveClass(/expanded/);
  });

  test('theme switcher changes the selected theme', async ({ page }) => {
    const themeSelect = page.locator('ngx-header nb-select');
    await expect(themeSelect).toContainText('Light');

    await themeSelect.click();
    await page.locator('nb-option', { hasText: 'Dark' }).click();

    await expect(themeSelect).toContainText('Dark');
  });

  test('header exposes search, email, notification and user controls', async ({ page }) => {
    await expect(page.locator('ngx-header nb-search')).toBeVisible();
    await expect(page.locator('ngx-header nb-action[icon="email-outline"]')).toBeVisible();
    await expect(page.locator('ngx-header nb-action[icon="bell-outline"]')).toBeVisible();
    await expect(page.locator('ngx-header nb-user')).toBeVisible();
  });
});
