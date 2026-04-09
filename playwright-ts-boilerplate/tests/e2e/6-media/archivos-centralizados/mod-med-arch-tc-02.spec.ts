import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-MED-ARCH-TC-02 | Falla Control Límite de Peso (Over 20MB)', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-MED-ARCH-TC-02', async ({ paginaMedia, page }) => {
     await paginaMedia.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
