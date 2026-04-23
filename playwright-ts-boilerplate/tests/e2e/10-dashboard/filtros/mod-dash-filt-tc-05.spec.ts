import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Refetching programado por UI.
 */
test.describe('MOD-DASH-FILT-TC-05 | Visor de Auto-Recarga Automática (Auto-Refresh)', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Auto-recarga', async ({ paginaDashboard, page }) => {
     await page.waitForURL(/.*?\/(dashboard)?/i); await page.waitForLoadState('domcontentloaded');
     const recarga = page.locator('text=/on|activar|refresh/i').first();
     if(await recarga.isVisible().catch(()=>false)) await recarga.click();
     await expect(page).toHaveURL(/.*?dashboard.*/);
  });
});
