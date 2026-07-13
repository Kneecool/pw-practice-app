import { Page, expect } from '@playwright/test';

/**
 * Helpers for navigating the ngx-admin sidebar menu.
 *
 * Feature specs navigate straight to a route with `page.goto(...)` for speed and
 * stability; `navigation.spec.ts` exercises the menu itself via `openMenuItem`.
 */

/**
 * Click a top-level group (if needed to reveal its children) then its child
 * leaf. Nebular renders each menu entry as `<a title="...">`, so we match on the
 * stable `title` attribute.
 *
 * Note: we gate the expand on the group's `aria-expanded` attribute, NOT on the
 * child link's visibility. Nebular keeps collapsed submenu links in the DOM with
 * a non-zero bounding box, so `childLink.isVisible()` returns `true` even when
 * the group is closed — the child is simply stacked underneath the sibling group
 * headers. Trusting visibility skips the expand, leaving the child covered so its
 * click is intercepted and times out.
 */
export async function openMenuItem(page: Page, group: string, child: string): Promise<void> {
  const groupLink = page.locator(`nb-menu a[title="${group}"]`);
  if ((await groupLink.getAttribute('aria-expanded')) !== 'true') {
    await groupLink.click();
    await expect(groupLink).toHaveAttribute('aria-expanded', 'true');
  }
  const childLink = page.locator(`nb-menu a[title="${child}"]`);
  await expect(childLink).toBeVisible();
  await childLink.click();
}

/** Route table keyed by feature, used by feature specs' beforeEach. */
export const ROUTES = {
  dashboard: '/pages/iot-dashboard',
  formLayouts: '/pages/forms/layouts',
  datepicker: '/pages/forms/datepicker',
  dialog: '/pages/modal-overlays/dialog',
  window: '/pages/modal-overlays/window',
  popover: '/pages/modal-overlays/popover',
  toastr: '/pages/modal-overlays/toastr',
  tooltip: '/pages/modal-overlays/tooltip',
  calendar: '/pages/extra-components/calendar',
  echarts: '/pages/charts/echarts',
  smartTable: '/pages/tables/smart-table',
  treeGrid: '/pages/tables/tree-grid',
  login: '/auth/login',
  register: '/auth/register',
  requestPassword: '/auth/request-password',
  resetPassword: '/auth/reset-password',
} as const;
