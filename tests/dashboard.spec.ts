import { test, expect } from '@playwright/test';
import { ROUTES } from './helpers/navigation';

/** IoT Dashboard — status cards, temperature widget and dashboard widgets. */
test.describe('IoT Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.dashboard);
    await expect(page).toHaveURL(/\/pages\/iot-dashboard/);
  });

  test('renders the four status cards', async ({ page }) => {
    for (const title of ['Light', 'Roller Shades', 'Wireless Audio', 'Coffee Maker']) {
      await expect(page.locator('ngx-status-card', { hasText: title })).toBeVisible();
    }
  });

  test('toggling a status card switches it ON/OFF', async ({ page }) => {
    const light = page.locator('ngx-status-card', { hasText: 'Light' });
    await expect(light.locator('.status')).toHaveText('ON');

    await light.locator('nb-card').click();
    await expect(light.locator('.status')).toHaveText('OFF');

    await light.locator('nb-card').click();
    await expect(light.locator('.status')).toHaveText('ON');
  });

  test('temperature widget switches between Temperature and Humidity tabs', async ({ page }) => {
    const widget = page.locator('ngx-temperature');
    await expect(widget.locator('li.tab.active')).toContainText('Temperature');

    await widget.locator('a.tab-link', { hasText: 'Humidity' }).click();
    await expect(widget.locator('li.tab.active')).toContainText('Humidity');
    await expect(widget.locator('.value.humidity')).toBeVisible();

    await widget.locator('a.tab-link', { hasText: 'Temperature' }).click();
    await expect(widget.locator('li.tab.active')).toContainText('Temperature');
    await expect(widget.locator('.value.temperature')).toBeVisible();
  });

  test('shows the main dashboard widgets', async ({ page }) => {
    for (const selector of [
      'ngx-temperature',
      'ngx-electricity',
      'ngx-rooms',
      'ngx-contacts',
      'ngx-solar',
      'ngx-weather',
      'ngx-security-cameras',
    ]) {
      await expect(page.locator(selector)).toBeVisible();
    }
  });
});
