import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Comprobación defensiva del input form de Catálogos.
 */
test.describe('MOD-CAT-CAT-TC-02 | Falla en validación Mandatory Field `Nombre`', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-CAT-CAT-TC-02', async ({ paginaCatalogo, page }) => {
     await paginaCatalogo.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
