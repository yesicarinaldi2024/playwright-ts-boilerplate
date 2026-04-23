import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Buscar y modificar un tenant que ya existe (el creado en TC-01).
 */
test.describe('MOD-ORG-TEN-TC-07 | Modificar Tenant existente', () => {

  test.beforeEach(async ({ paginaLogin, paginaTenants }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaTenants.navegarASeccion();
  });

  test('Modificar nombre y estado del tenant TC-01', async ({ paginaTenants, page }) => {
    const nombreActual = `AUTO_TENANT_TC07_${Date.now()}`;
    const nuevoNombre = `${nombreActual}_MOD`;

    // Crear precondición del test para evitar dependencia entre casos
    await paginaTenants.crearTenant(nombreActual);

    // Cerrar confirmación de alta si quedó abierta (puede bloquear clicks en fondo)
    const dialogConfirmacion = page
      .locator('mat-dialog-container, [role="dialog"], .cdk-dialog-container')
      .filter({ hasText: /confirmación/i })
      .first();
    if (await dialogConfirmacion.isVisible().catch(() => false)) {
      await dialogConfirmacion.getByRole('button', { name: /cerrar/i }).click();
      await expect(dialogConfirmacion).toBeHidden({ timeout: 10000 });
    }

    await paginaTenants.entrarADetalle(nombreActual);
    await paginaTenants.editarInformacion(nuevoNombre, true);

    // Volver y verificar el cambio en la lista
    await paginaTenants.navegarASeccion();
    await paginaTenants.buscar(nuevoNombre);
    await expect(paginaTenants.filaTenantPorNombre(nuevoNombre)).toBeVisible({ timeout: 15000 });
  });
});
