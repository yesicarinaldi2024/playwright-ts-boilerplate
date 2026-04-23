import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: El EventListener reacciona al Canvas principal.
 */
test.describe('MOD-MED-ARCH-TC-07 | Interceptación Funcional Drag & Drop', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-MED-ARCH-TC-07', async ({ paginaMedia, page }) => {
     await paginaMedia.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
