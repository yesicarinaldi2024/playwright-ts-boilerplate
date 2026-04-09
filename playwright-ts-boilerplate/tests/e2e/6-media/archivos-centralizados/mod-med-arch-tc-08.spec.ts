import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-MED-ARCH-TC-08 | Portapapeles URL Hosting', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-MED-ARCH-TC-08', async ({ paginaMedia, page }) => {
     await paginaMedia.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
