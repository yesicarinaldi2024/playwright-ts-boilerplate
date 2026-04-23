import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: El rol Super Admin muta todo el canvas base al cambiar globalmente.
 */
test.describe('MOD-DASH-FILT-TC-06 | Multi-Tenant Selection desde Switcher Superior Admins', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Muti tenant switcher', async ({ paginaDashboard, page }) => {
     await page.waitForURL(/.*?\/(dashboard)?/i); await page.waitForLoadState('domcontentloaded');
     await paginaDashboard.elegirOpcionSelectGenerico('Tenant', 'Testing');
     await expect(page).toHaveURL(/.*?dashboard.*/);
  });
});
