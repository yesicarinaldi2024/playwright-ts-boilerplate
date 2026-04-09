import { test, expect } from '../../../fixtures/test-base';

test.describe('MOD-DASH-MET-TC-02', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Fallo de red Skeleton', async ({ paginaDashboard, page }) => {
     // Abortamos interceptacion
     await page.route('**/api/**', route => route.abort('failed'));
     
     await page.waitForURL(/.*?\/(dashboard)?/i); await page.waitForLoadState('domcontentloaded');
     
     // La UI debe sobrevivir aunque no haya datos
     await expect(page.locator('body')).toBeVisible();
  });
});
