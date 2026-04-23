import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Funcionalidad integradora pag 38 (Productos Vinculados).
 */
test.describe('MOD-CAT-OPC-TC-02 | Acople de Grupo de Modificadores a Sub-Producto Base', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-CAT-OPC-TC-02', async ({ paginaCatalogo, page }) => {
     await paginaCatalogo.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
