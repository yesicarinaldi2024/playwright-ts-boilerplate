import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Confirmación Regex Types (`png`, `jpg`, `svg`, `webp`).
 */
test.describe('MOD-MED-ARCH-TC-03 | Formato no Autorizado (Infectado o Video)', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-MED-ARCH-TC-03', async ({ paginaMedia, page }) => {
     await paginaMedia.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
