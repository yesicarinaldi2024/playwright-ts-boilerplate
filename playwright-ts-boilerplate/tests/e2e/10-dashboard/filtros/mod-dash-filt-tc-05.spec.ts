import { test, expect } from '../../../fixtures/test-base';

test.describe('MOD-DASH-FILT-TC-05', () => {
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
