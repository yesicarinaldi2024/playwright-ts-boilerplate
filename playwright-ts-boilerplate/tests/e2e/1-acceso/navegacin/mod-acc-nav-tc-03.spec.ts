import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-ACC-NAV-TC-03 | Persistencia Session', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar no perdida de session al hacer F5', async ({ page }) => {
     await expect(page).not.toHaveURL(/.*?keycloack.*/, { timeout: 15000 });
     
     // Hard refresh browser side
     await page.reload({ waitUntil: 'domcontentloaded' });
     
     // We still belong to the app (no token loss)
     await expect(page).not.toHaveURL(/.*?keycloack.*/);
  });
});
