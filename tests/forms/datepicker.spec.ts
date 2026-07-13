import { test, expect } from '@playwright/test';
import { ROUTES } from '../helpers/navigation';

/**
 * Forms > Datepicker (/pages/forms/datepicker).
 *
 * Three cards: a common picker, a range picker, and a min/max constrained
 * picker. Nebular renders the calendar in an overlay attached to <body>, so day
 * cells are matched by their `.day-cell` class rather than scoped to the card.
 */
test.describe('Forms > Datepicker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.datepicker);
    await expect(page.locator('nb-card-header', { hasText: 'Common Datepicker' })).toBeVisible();
  });

  /** Format Nebular renders in the input, e.g. "Jul 15, 2026". */
  function formatDate(d: Date): string {
    const month = d.toLocaleString('en-US', { month: 'short' });
    return `${month} ${d.getDate()}, ${d.getFullYear()}`;
  }

  test('common picker opens a calendar on focus', async ({ page }) => {
    await page.getByPlaceholder('Form Picker').click();
    await expect(page.locator('nb-calendar').first()).toBeVisible();
  });

  test('common picker selects a day and fills the input', async ({ page }) => {
    const input = page.getByPlaceholder('Form Picker');
    await input.click();

    // Pick the 15th of the currently displayed month. Restricting to in-month
    // cells (".day-cell", not ".bounding-month") avoids the greyed-out spill
    // days from the previous/next month that share the same number.
    const target = new Date();
    target.setDate(15);
    await page
      .locator('.day-cell.ng-star-inserted:not(.bounding-month)')
      .getByText('15', { exact: true })
      .click();

    await expect(input).toHaveValue(formatDate(target));
  });

  test('range picker selects a start and end date', async ({ page }) => {
    const input = page.getByPlaceholder('Range Picker');
    await input.click();

    const dayCells = page.locator('.day-cell.ng-star-inserted:not(.bounding-month)');
    await dayCells.getByText('10', { exact: true }).first().click();
    await dayCells.getByText('20', { exact: true }).first().click();

    // A valid range renders "<start> - <end>" in the input.
    await expect(input).toHaveValue(/\w{3} \d{1,2}, \d{4} - \w{3} \d{1,2}, \d{4}/);
  });

  test('min-max picker opens a calendar', async ({ page }) => {
    const input = page.getByPlaceholder('Min Max Picker');
    await input.click();
    await expect(page.locator('nb-calendar').first()).toBeVisible();
  });

  test('min-max picker disables days outside the allowed window', async ({ page }) => {
    // The min/max window is anchored to "today" (see datepicker.component.ts:
    // min = today - 5 days, max = today + 5 days), so most days in the visible
    // month fall outside the window and render as disabled cells.
    await page.getByPlaceholder('Min Max Picker').click();
    await expect(page.locator('nb-calendar').first()).toBeVisible();

    const disabledDays = page.locator('.day-cell.ng-star-inserted.disabled');
    await expect(disabledDays.first()).toBeVisible();
  });
});
