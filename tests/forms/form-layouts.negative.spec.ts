import { test, expect } from '@playwright/test';
import { ROUTES } from '../helpers/navigation';

/**
 * NEGATIVE tests for Forms > Form Layouts (/pages/forms/layouts).
 *
 * Important context about the app under test: this page is a *static demo*.
 * Its inputs have no Angular form controls, validators, `required` attributes,
 * or submit handlers — so there is no app-level validation to exercise. That
 * splits negative testing into two groups:
 *
 *   1. "reject behavior" — what the browser/app genuinely rejects: native
 *      HTML5 constraint validation on type=email inputs, and password masking.
 *      These PASS.
 *
 *   2. "expected validation gaps" — behavior a properly validated form SHOULD
 *      have (surface an error, block submit on bad input). The demo does none
 *      of this, so these assertions are EXPECTED TO FAIL. They are not broken
 *      tests: they document the absent validation and give the Watchtower
 *      dashboard real failed entries to inspect. If this page ever gains real
 *      validation, these turn green.
 */

const BASIC = { email: '#exampleInputEmail1', password: '#exampleInputPassword1' };
// Field-level validation feedback in a validated Nebular form. Deliberately
// scoped to inputs/messages (input.status-danger, p.caption.status-danger,
// aria-invalid) and NOT bare `.status-danger` — the Basic form's Submit button
// is status="danger", so a broad `.status-danger` would match the button and
// mask the missing validation.
const ERROR_INDICATOR = 'input.status-danger, [aria-invalid="true"], .error-message, p.caption.status-danger';

test.describe('Form Layouts — reject behavior (passes)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.formLayouts);
    await expect(page.locator(BASIC.email)).toBeVisible();
  });

  test('HTML5 validation rejects an address with no @ symbol', async ({ page }) => {
    const email = page.locator(BASIC.email);
    await email.fill('notanemail');
    expect(await email.evaluate((el: HTMLInputElement) => el.checkValidity())).toBe(false);
    expect(await email.evaluate((el: HTMLInputElement) => el.validationMessage)).not.toBe('');
  });

  test('HTML5 validation rejects an address with no domain', async ({ page }) => {
    const email = page.locator(BASIC.email);
    await email.fill('user@');
    expect(await email.evaluate((el: HTMLInputElement) => el.checkValidity())).toBe(false);
  });

  test('a well-formed address clears HTML5 validation', async ({ page }) => {
    const email = page.locator(BASIC.email);
    await email.fill('valid@example.com');
    expect(await email.evaluate((el: HTMLInputElement) => el.checkValidity())).toBe(true);
  });

  test('the password field keeps its value masked', async ({ page }) => {
    const pwd = page.locator(BASIC.password);
    await pwd.fill('supersecret');
    // A password field must never expose the secret as plain text.
    await expect(pwd).toHaveAttribute('type', 'password');
  });
});

test.describe('Form Layouts — expected validation gaps (documents missing validation; EXPECTED TO FAIL)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.formLayouts);
    await expect(page.locator(BASIC.email)).toBeVisible();
  });

  test('flags the email field after a malformed address is entered and blurred', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Basic form' });
    await card.locator(BASIC.email).fill('notanemail');
    await card.locator(BASIC.email).blur();
    // A validated form would mark the field invalid on blur. The demo does not.
    await expect(card.locator(ERROR_INDICATOR).first()).toBeVisible({ timeout: 3000 });
  });

  test('shows a required-field error when the email is left empty', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Basic form' });
    await card.locator(BASIC.email).click();
    await card.locator(BASIC.email).blur();
    await expect(card.locator(ERROR_INDICATOR).first()).toBeVisible({ timeout: 3000 });
  });

  test('blocks submission and surfaces an error for an invalid email', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Basic form' });
    await card.locator(BASIC.email).fill('notanemail');
    await card.getByRole('button', { name: 'Submit' }).click();
    await expect(card.locator(ERROR_INDICATOR).first()).toBeVisible({ timeout: 3000 });
  });

  test('rejects a password shorter than 8 characters', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Basic form' });
    await card.locator(BASIC.password).fill('123');
    await card.locator(BASIC.password).blur();
    await expect(card.locator(ERROR_INDICATOR).first()).toBeVisible({ timeout: 3000 });
  });
});
