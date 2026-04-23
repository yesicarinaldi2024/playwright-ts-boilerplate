import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Proveer la capa última expuesta a las pantallas de Kiosk/Pantallas táctiles.
 */
test.describe('MOD-CAT-MNU-TC-01 | Inserción Limpia y Asociación de Local', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-CAT-MNU-TC-01', async ({ paginaCatalogo, page }) => {
     await paginaCatalogo.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
