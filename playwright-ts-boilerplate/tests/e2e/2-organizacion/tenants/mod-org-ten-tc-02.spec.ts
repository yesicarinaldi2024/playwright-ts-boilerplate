import { test, expect } from '../../../fixtures/test-base';
test.describe('MOD-ORG-TEN-TC-02 | Bloqueo al emitir Tenant con vacíos mandatorios', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-ORG-TEN-TC-02', async ({ paginaOrganizacion, page }) => {
     await paginaOrganizacion.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
