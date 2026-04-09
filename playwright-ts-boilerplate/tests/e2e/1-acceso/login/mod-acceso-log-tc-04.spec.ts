import { test, expect } from '../../../fixtures/test-base';

test.describe('MOD-ACCESO-LOG-TC-04', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
  });

  test('Campos en blanco', async ({ paginaLogin, page }) => {
     await paginaLogin.botonIngresar.click();
     await expect(page).toHaveURL(/.*?keycloack.*/);
  });
});
