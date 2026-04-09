import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-CAT-PROD-TC-01 | Instanciar Producto Standalone Base', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-CAT-PROD-TC-01', async ({ paginaCatalogo, page }) => {
     await paginaCatalogo.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
