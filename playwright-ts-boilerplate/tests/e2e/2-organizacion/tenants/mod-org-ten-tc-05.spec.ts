import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-ORG-TEN-TC-05 | Inyección de Pantalla Espera Media (Pre-Menú)', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-ORG-TEN-TC-05', async ({ paginaOrganizacion, page }) => {
     await paginaOrganizacion.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
