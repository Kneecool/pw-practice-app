import { test, expect } from '@playwright/test';
import { ROUTES } from '../helpers/navigation';

/**
 * NEGATIVE tests for Forms > Datepicker (/pages/forms/datepicker).
 *
 * The Min/Max picker is anchored to today (min = today-5 days, max = today+5,
 * see datepicker.component.ts), so it genuinely rejects out-of-range days in
 * the calendar — those tests PASS.
 *
 * The picker inputs, however, accept free-typed text and perform no visible
 * validation of a typed value. Tests asserting that a bad/out-of-range typed
 * date is rejected are therefore EXPECTED TO FAIL — they document the missing
 * input validation and give the Watchtower dashboard failed entries to inspect.
 *
 * Nebular renders the calendar in an overlay attached to <body>, so day cells
 * are matched by their `.day-cell` class rather than scoped to the card.
 */

const DAY_CELL = '.day-cell.ng-star-inserted:not(.bounding-month)';
const DISABLED_DAY = '.day-cell.ng-star-inserted.disabled';
const ERROR_INDICATOR = '.status-danger, [aria-invalid="true"], .error-message';

test.describe('Datepicker — reject behavior (passes)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.datepicker);
    await expect(page.locator('nb-card-header', { hasText: 'Common Datepicker' })).toBeVisible();
  });

  test('min/max picker disables out-of-range days', async ({ page }) => {
    await page.getByPlaceholder('Min Max Picker').click();
    await expect(page.locator('nb-calendar').first()).toBeVisible();
    // With a ±5 day window, most of the visible month renders as disabled.
    await expect(page.locator(DISABLED_DAY).first()).toBeVisible();
  });

  test('common picker (no constraint) leaves every day selectable', async ({ page }) => {
    await page.getByPlaceholder('Form Picker').click();
    await expect(page.locator('nb-calendar').first()).toBeVisible();
    // The unconstrained picker disables nothing — contrast with the min/max one.
    await expect(page.locator(DISABLED_DAY)).toHaveCount(0);
  });

  test('a disabled out-of-range day cannot be selected', async ({ page }) => {
    const input = page.getByPlaceholder('Min Max Picker');
    await input.click();
    await expect(page.locator('nb-calendar').first()).toBeVisible();

    // Force-click a disabled cell (Nebular blocks pointer events on it) and
    // confirm it does not populate the input.
    await page.locator(DISABLED_DAY).first().click({ force: true });
    await expect(input).toHaveValue('');
  });
});

test.describe('Datepicker — expected input validation (documents missing validation; EXPECTED TO FAIL)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.datepicker);
    await expect(page.locator('nb-card-header', { hasText: 'Common Datepicker' })).toBeVisible();
  });

  test('clears the input when a non-date string is typed', async ({ page }) => {
    const input = page.getByPlaceholder('Form Picker');
    await input.fill('not-a-date');
    await input.blur();
    // A validated picker would reject/clear unparseable text. The demo keeps it.
    await expect(input).toHaveValue('', { timeout: 3000 });
  });

  test('flags a typed date outside the allowed min/max window', async ({ page }) => {
    const input = page.getByPlaceholder('Min Max Picker');
    // A date years outside the ±5 day window.
    await input.fill('Jan 1, 2000');
    await input.blur();
    await expect(page.locator(ERROR_INDICATOR).first()).toBeVisible({ timeout: 3000 });
  });
});
