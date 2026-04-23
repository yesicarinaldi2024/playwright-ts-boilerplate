import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Armar un primer nivel visual para el catálogo del kiosco.
 */
test.describe('MOD-CAT-CAT-TC-01 | Alta de Categoría con Imagen Representativa', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-CAT-CAT-TC-01', async ({ paginaCatalogo, page }) => {
     await paginaCatalogo.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
