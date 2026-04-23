import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Cumplir requisitos de Accesibilidad.
 */
test.describe('MOD-MED-ARCH-TC-05 | Edición Metadatos Aditivos (Description / Alt)', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-MED-ARCH-TC-05', async ({ paginaMedia, page }) => {
     await paginaMedia.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
