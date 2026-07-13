import { test, expect } from '@playwright/test';
import { ROUTES } from './helpers/navigation';

/** Tables & Data > Smart Table (ng2-smart-table) — full CRUD, filter, sort, paging. */
test.describe('Smart Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.smartTable);
    await expect(page.locator('nb-card-header', { hasText: 'Smart Table' })).toBeVisible();
    await expect(page.locator('tr.ng2-smart-row').first()).toBeVisible();
  });

  test('renders seeded data with a full page of rows', async ({ page }) => {
    await expect(page.locator('tr.ng2-smart-row', { hasText: 'mdo@gmail.com' })).toContainText('Mark');
    await expect(page.locator('tr.ng2-smart-row')).toHaveCount(10);
  });

  test('adds a new record', async ({ page }) => {
    const email = 'automation@test.com';
    await page.locator('a.ng2-smart-action-add-add').click();

    const addRow = page.locator('tr[ng2-st-thead-form-row]');
    await addRow.locator('input-editor').getByPlaceholder('ID').fill('999');
    await addRow.locator('input-editor').getByPlaceholder('First Name').fill('Auto');
    await addRow.locator('input-editor').getByPlaceholder('Last Name').fill('Mation');
    await addRow.locator('input-editor').getByPlaceholder('Username').fill('@auto');
    await addRow.locator('input-editor').getByPlaceholder('E-mail').fill(email);
    await addRow.locator('input-editor').getByPlaceholder('Age').fill('30');
    await page.locator('a.ng2-smart-action-add-create').click();

    // Confirm via the e-mail filter (new rows land on the last page).
    await page.locator('input-filter').getByPlaceholder('E-mail').fill(email);
    const match = page.locator('tr.ng2-smart-row', { hasText: email });
    await expect(match).toHaveCount(1);
    await expect(match).toContainText('Auto');
  });

  test('edits an existing record', async ({ page }) => {
    const row = page.locator('tr.ng2-smart-row').first();
    await row.locator('a.ng2-smart-action-edit-edit').click();

    const ageEditor = row.locator('input-editor').getByPlaceholder('Age');
    await ageEditor.fill('99');
    await row.locator('a:has(i.nb-checkmark)').click();

    await expect(page.locator('tr.ng2-smart-row').first()).toContainText('99');
  });

  test('deletes a record after confirming', async ({ page }) => {
    page.once('dialog', (dialog) => dialog.accept());

    const target = page.locator('tr.ng2-smart-row', { hasText: 'mdo@gmail.com' });
    await expect(target).toHaveCount(1);
    await target.locator('a.ng2-smart-action-delete-delete').click();

    await expect(page.locator('tr.ng2-smart-row', { hasText: 'mdo@gmail.com' })).toHaveCount(0);
  });

  test('keeps a record when delete is cancelled', async ({ page }) => {
    page.once('dialog', (dialog) => dialog.dismiss());

    const target = page.locator('tr.ng2-smart-row', { hasText: 'mdo@gmail.com' });
    await target.locator('a.ng2-smart-action-delete-delete').click();

    await expect(page.locator('tr.ng2-smart-row', { hasText: 'mdo@gmail.com' })).toHaveCount(1);
  });

  test('filters rows by e-mail', async ({ page }) => {
    await page.locator('input-filter').getByPlaceholder('E-mail').fill('mdo@gmail.com');
    await expect(page.locator('tr.ng2-smart-row')).toHaveCount(1);
    await expect(page.locator('tr.ng2-smart-row').first()).toContainText('Mark');
  });

  test('paginates to the next page', async ({ page }) => {
    const firstRowBefore = await page.locator('tr.ng2-smart-row').first().innerText();

    await page.locator('ng2-smart-table-pager').getByText('2', { exact: true }).click();

    await expect(page.locator('.ng2-smart-page-item.active')).toContainText('2');
    await expect(page.locator('tr.ng2-smart-row').first()).not.toHaveText(firstRowBefore);
  });

  test('sorts by First Name', async ({ page }) => {
    const sortLink = page.locator('a.ng2-smart-sort-link', { hasText: 'First Name' });
    const firstCell = () => page.locator('tr.ng2-smart-row').first().locator('td').nth(2);

    await sortLink.click();
    const ascending = await firstCell().innerText();
    await sortLink.click();
    const descending = await firstCell().innerText();

    expect(ascending).not.toEqual(descending);
  });
});
