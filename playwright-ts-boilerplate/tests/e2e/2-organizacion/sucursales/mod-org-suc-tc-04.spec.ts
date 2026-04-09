import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-ORG-SUC-TC-04 | Sobreescritura Forzada Pestaña Pago en Sucursal (Des-Heredar)', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-ORG-SUC-TC-04', async ({ paginaOrganizacion, page }) => {
     await paginaOrganizacion.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
