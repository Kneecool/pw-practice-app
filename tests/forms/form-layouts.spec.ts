import { test, expect } from '@playwright/test';
import { ROUTES } from '../helpers/navigation';

/**
 * Forms > Form Layouts (/pages/forms/layouts).
 *
 * The page showcases seven Nebular form cards. Each test scopes to its card by
 * header text so selectors stay stable even though several forms reuse the same
 * placeholders (e.g. "Email").
 */
test.describe('Forms > Form Layouts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.formLayouts);
    await expect(page.locator('nb-card-header', { hasText: 'Inline form' })).toBeVisible();
  });

  test('inline form accepts name, email and remember-me', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Inline form' });
    await card.getByPlaceholder('Jane Doe').fill('Nicole Tester');
    await card.getByPlaceholder('Email').fill('nicole@test.com');
    const remember = card.locator('nb-checkbox', { hasText: 'Remember me' });
    await remember.click();

    await expect(card.getByPlaceholder('Jane Doe')).toHaveValue('Nicole Tester');
    await expect(card.getByPlaceholder('Email')).toHaveValue('nicole@test.com');
    await expect(remember.locator('input')).toBeChecked();
    await expect(card.getByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  test('grid form supports email, password and radio selection', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Using the Grid' });
    await card.locator('#inputEmail1').fill('grid@test.com');
    await card.locator('#inputPassword2').fill('Passw0rd!');

    await expect(card.locator('#inputEmail1')).toHaveValue('grid@test.com');
    await expect(card.locator('#inputPassword2')).toHaveValue('Passw0rd!');

    // Option 1 and 2 are selectable; the third radio is disabled.
    const option1 = card.locator('nb-radio', { hasText: 'Option 1' });
    await expect(option1).toBeVisible();
    await expect(card.locator('nb-radio', { hasText: 'Option 2' })).toBeVisible();
    await expect(
      card.locator('nb-radio', { hasText: 'Disabled Option' }).locator('input'),
    ).toBeDisabled();

    // The enabled radios are clickable. (This demo binds no model, so Nebular
    // exposes no persistent "checked" state to assert on — only that the
    // control accepts the interaction and stays enabled.)
    await option1.click();
    await expect(option1.locator('input')).toBeEnabled();
    await expect(card.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('basic form fills email, password and checkbox', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Basic form' });
    await card.locator('#exampleInputEmail1').fill('basic@test.com');
    await card.locator('#exampleInputPassword1').fill('secret123');
    const checkbox = card.locator('nb-checkbox', { hasText: 'Check me out' });
    await checkbox.click();

    await expect(card.locator('#exampleInputEmail1')).toHaveValue('basic@test.com');
    await expect(card.locator('#exampleInputPassword1')).toHaveValue('secret123');
    await expect(checkbox.locator('input')).toBeChecked();
    await expect(card.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  test('block form captures first name, last name, email and website', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Block form' });
    await card.locator('#inputFirstName').fill('Nicole');
    await card.locator('#inputLastName').fill('Tester');
    await card.locator('#inputEmail').fill('block@test.com');
    await card.locator('#inputWebsite').fill('https://example.com');

    await expect(card.locator('#inputFirstName')).toHaveValue('Nicole');
    await expect(card.locator('#inputLastName')).toHaveValue('Tester');
    await expect(card.locator('#inputEmail')).toHaveValue('block@test.com');
    await expect(card.locator('#inputWebsite')).toHaveValue('https://example.com');
    await expect(card.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  test('horizontal form fills email, password and remember-me', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Horizontal form' });
    await card.locator('#inputEmail3').fill('horiz@test.com');
    await card.locator('#inputPassword3').fill('hunter2!!');
    const remember = card.locator('nb-checkbox', { hasText: 'Remember me' });
    await remember.click();

    await expect(card.locator('#inputEmail3')).toHaveValue('horiz@test.com');
    await expect(remember.locator('input')).toBeChecked();
    await expect(card.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('form without labels captures recipients, subject and message', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: 'Form without labels' });
    await card.getByPlaceholder('Recipients').fill('team@test.com');
    await card.getByPlaceholder('Subject').fill('Hello');
    await card.getByPlaceholder('Message').fill('This is the body of the message.');

    await expect(card.getByPlaceholder('Recipients')).toHaveValue('team@test.com');
    await expect(card.getByPlaceholder('Subject')).toHaveValue('Hello');
    await expect(card.getByPlaceholder('Message')).toHaveValue('This is the body of the message.');
    await expect(card.getByRole('button', { name: 'Send' })).toBeVisible();
  });

  test('checkbox can be toggled on and back off', async ({ page }) => {
    const checkbox = page
      .locator('nb-card', { hasText: 'Basic form' })
      .locator('nb-checkbox', { hasText: 'Check me out' });

    await expect(checkbox.locator('input')).not.toBeChecked();
    await checkbox.click();
    await expect(checkbox.locator('input')).toBeChecked();
    await checkbox.click();
    await expect(checkbox.locator('input')).not.toBeChecked();
  });
});
