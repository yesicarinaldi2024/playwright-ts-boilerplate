import { test, expect } from '../../../fixtures/test-base';

test.describe('MOD-ACCESO-LOG-TC-01', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
  });

  test('Ingreso exitoso', async ({ paginaLogin, page }) => {
     await paginaLogin.ingresarComoAdministrador();
     await expect(page.locator('#kc-login')).not.toBeVisible();
     await expect(page).not.toHaveURL(/.*?keycloack.*/);
  });
});
