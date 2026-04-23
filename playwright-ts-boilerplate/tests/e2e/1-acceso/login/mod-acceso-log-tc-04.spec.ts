import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Asegurar validaciones Web-forms (HTML5 / Cliente) para evitar peticiones basura al servidor.
 */
test.describe('MOD-ACCESO-LOG-TC-04 | Comportamiento frente a campos obligatorios en Blanco', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
  });

  test('Campos en blanco', async ({ paginaLogin, page }) => {
     await paginaLogin.botonIngresar.click();
     await expect(page).toHaveURL(/.*?keycloack.*/);
  });
});
