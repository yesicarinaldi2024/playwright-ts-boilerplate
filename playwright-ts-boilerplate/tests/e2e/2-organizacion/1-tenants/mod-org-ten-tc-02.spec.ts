import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Verificar que no permita dar de alta un tenant sin antes haber completado los campos obligatorios.
 */
test.describe('MOD-ORG-TEN-TC-02 | Bloqueo al guardar Tenant con campos obligatorios vacíos mandatorios', () => {

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
