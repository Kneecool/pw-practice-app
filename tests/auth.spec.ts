import { test, expect } from '@playwright/test';
import { ROUTES } from './helpers/navigation';

/** Auth — Login, Register, Request Password, Reset Password (Nebular auth). */
test.describe('Auth', () => {
  test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(ROUTES.login);
      await expect(page.locator('h1#title')).toHaveText('Login');
    });

    test('renders the login form', async ({ page }) => {
      await expect(page.locator('#input-email')).toBeVisible();
      await expect(page.locator('#input-password')).toBeVisible();
      await expect(page.locator('nb-checkbox', { hasText: 'Remember me' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
    });

    test('accepts valid credentials input', async ({ page }) => {
      await page.locator('#input-email').fill('user@test.com');
      await page.locator('#input-password').fill('Passw0rd');
      await page.locator('nb-checkbox', { hasText: 'Remember me' }).click();

      await expect(page.locator('#input-email')).toHaveValue('user@test.com');
      await expect(page.getByRole('button', { name: 'Log In' })).toBeEnabled();
    });

    test('shows a validation message for an invalid email', async ({ page }) => {
      await page.locator('#input-email').fill('not-an-email');
      await page.locator('#input-password').click(); // blur the email field
      await expect(page.getByText('Email should be the real one!')).toBeVisible();
    });

    test('exposes links to register and request-password pages', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Register' })).toHaveAttribute('href', '/auth/register');
      await expect(page.getByRole('link', { name: 'Forgot Password?' })).toHaveAttribute(
        'href',
        '/auth/request-password',
      );
    });
  });

  test.describe('Register', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(ROUTES.register);
      await expect(page.locator('h1#title')).toHaveText('Register');
    });

    test('renders the register form', async ({ page }) => {
      await expect(page.locator('#input-name')).toBeVisible();
      await expect(page.locator('#input-email')).toBeVisible();
      await expect(page.locator('#input-password')).toBeVisible();
      await expect(page.locator('#input-re-password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
    });

    test('flags mismatched password confirmation with a danger status', async ({ page }) => {
      await page.locator('#input-name').fill('Nicole Tester');
      await page.locator('#input-email').fill('user@test.com');
      await page.locator('#input-password').fill('Passw0rd');
      await page.locator('#input-re-password').fill('Different1');
      await page.locator('#input-name').click(); // blur confirm field

      await expect(page.locator('#input-re-password')).toHaveClass(/status-danger/);
    });

    test('exposes a link back to login', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/auth/login');
    });
  });

  test.describe('Request Password', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(ROUTES.requestPassword);
      await expect(page.locator('h1#title')).toHaveText('Forgot Password');
    });

    test('renders the email field and submit button', async ({ page }) => {
      await expect(page.locator('#input-email')).toBeVisible();
      await page.locator('#input-email').fill('user@test.com');
      await expect(page.getByRole('button')).toBeVisible();
    });

    test('exposes a link back to login', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Back to Log In' })).toHaveAttribute('href', '/auth/login');
    });
  });

  test.describe('Reset Password', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(ROUTES.resetPassword);
      await expect(page.locator('h1#title')).toHaveText('Change password');
    });

    test('renders the new-password and confirm fields', async ({ page }) => {
      await expect(page.locator('#input-password')).toBeVisible();
      await expect(page.locator('#input-re-password')).toBeVisible();
      await page.locator('#input-password').fill('NewPass1');
      await page.locator('#input-re-password').fill('NewPass1');
      await expect(page.getByRole('button')).toBeVisible();
    });

    test('exposes a link back to login', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Back to Log In' })).toHaveAttribute('href', '/auth/login');
    });
  });
});
