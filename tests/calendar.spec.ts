import { test, expect } from '@playwright/test';
import { ROUTES } from './helpers/navigation';

/** Extra Components > Calendar. */
test.describe('Calendar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.calendar);
    await expect(page.locator('nb-calendar').first()).toBeVisible();
  });

  test('selecting a day updates the "Selected date" label', async ({ page }) => {
    const container = page.locator('.calendar-container').first();
    await container.locator('.day-cell.ng-star-inserted').getByText('15', { exact: true }).first().click();

    await expect(container.locator('.subtitle')).toContainText('Selected date:');
    await expect(container.locator('.subtitle')).toContainText('15');
  });

  test('range calendar selects a start and end date', async ({ page }) => {
    const container = page.locator('.calendar-container').nth(1);
    const days = container.locator('.day-cell.ng-star-inserted');
    await days.getByText('10', { exact: true }).first().click();
    await days.getByText('20', { exact: true }).first().click();

    await expect(container.locator('.subtitle')).toContainText('Selected range:');
    // Both ends populated -> the label contains a hyphen with two dates.
    await expect(container.locator('.subtitle')).toContainText(/\w{3} \d{1,2}, \d{4} - \w{3} \d{1,2}, \d{4}/);
  });

  test('calendar exposes a month/year navigation header', async ({ page }) => {
    const firstCalendar = page.locator('nb-calendar').first();
    // The view-mode button shows the current month and year (e.g. "July 2026").
    const viewMode = firstCalendar.locator('nb-calendar-view-mode button').first();
    await expect(viewMode).toBeVisible();
    await expect(viewMode).toHaveText(/[A-Z][a-z]+ \d{4}/);

    // Prev/next pager buttons are present for this calendar.
    await expect(firstCalendar.locator('nb-calendar-pageable-navigation button')).toHaveCount(2);
  });
});
