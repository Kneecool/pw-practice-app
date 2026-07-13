import { test, expect } from '@playwright/test';
import { ROUTES } from '../helpers/navigation';

/** Tables & Data > Tree Grid (Nebular tree grid) — expand/collapse, filter, sort. */
test.describe('Tree Grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.treeGrid);
    await expect(page.locator('#search')).toBeVisible();
    await expect(page.locator('tr.nb-tree-grid-row').first()).toBeVisible();
  });

  test('shows the root folders and column headers', async ({ page }) => {
    for (const name of ['Projects', 'Reports', 'Other']) {
      await expect(page.locator('tr.nb-tree-grid-row', { hasText: name })).toBeVisible();
    }
    for (const col of ['name', 'size', 'kind', 'items']) {
      await expect(page.locator('button.nb-tree-grid-header-change-sort-button', { hasText: col })).toBeVisible();
    }
  });

  test('expands and collapses a folder', async ({ page }) => {
    const projects = page.locator('tr.nb-tree-grid-row', { hasText: 'Projects' });
    const child = page.locator('tr.nb-tree-grid-row', { hasText: 'project-1.doc' });

    await expect(child).toHaveCount(0);
    await projects.locator('button.row-toggle-button').click();
    await expect(child).toBeVisible();

    await projects.locator('button.row-toggle-button').click();
    await expect(child).toHaveCount(0);
  });

  test('filters rows via the search box', async ({ page }) => {
    await page.locator('#search').fill('backup');
    await expect(page.locator('tr.nb-tree-grid-row', { hasText: 'backup.bkp' })).toBeVisible();
    await expect(page.locator('tr.nb-tree-grid-row', { hasText: 'project-1.doc' })).toHaveCount(0);
  });

  test('sorts by size', async ({ page }) => {
    const sizeSort = page.locator('button.nb-tree-grid-header-change-sort-button', { hasText: 'size' });
    const firstName = () => page.locator('tr.nb-tree-grid-row').first().locator('td').first();

    await sizeSort.click();
    const ascendingFirst = await firstName().innerText();
    await sizeSort.click();
    const descendingFirst = await firstName().innerText();

    expect(ascendingFirst).not.toEqual(descendingFirst);
  });
});
