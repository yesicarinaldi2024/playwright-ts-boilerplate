import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Dar de alta un tenant, consultarlo y asociarle una sucursal.
 */
test.describe('MOD-ORG-TEN-TC-11 | Flujo completo Alta y Asociación de Sucursal', () => {

  test.beforeEach(async ({ paginaLogin, paginaTenants }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaTenants.navegarASeccion();
  });

  test('Navegar a Sucursales desde un tenant nuevo', async ({ paginaTenants, page }) => {
    const nombreTenant = `AUTO_TENANT_BRANCH_${Date.now()}`;

    await paginaTenants.crearTenant(nombreTenant);
    await paginaTenants.cerrarConfirmacionSiExiste();
    await paginaTenants.entrarADetalle(nombreTenant);

    await expect(paginaTenants.btnIrASucursales).toBeVisible({ timeout: 10000 });
    await paginaTenants.btnIrASucursales.click();
    await expect(page).toHaveURL(/.*\/(stores|branches|sucursales).*/, { timeout: 15000 });
  });
});
