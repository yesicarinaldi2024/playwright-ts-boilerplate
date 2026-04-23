import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Dar de alta un tenant, consultarlo y editar datos (Nombre y Habilitación).
 */
test.describe('MOD-ORG-TEN-TC-10 | Flujo completo Alta y Edición de Info', () => {

  test.beforeEach(async ({ paginaLogin, paginaTenants }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaTenants.navegarASeccion();
  });

  test('Crear, consultar y editar información básica', async ({ paginaTenants }) => {
    const nombreBase = `AUTO_TENANT_INFO_${Date.now()}`;
    const nombreEditado = `${nombreBase}_MOD`;

    await paginaTenants.crearTenant(nombreBase);
    await paginaTenants.cerrarConfirmacionSiExiste();
    await paginaTenants.entrarADetalle(nombreBase);
    await paginaTenants.editarInformacion(nombreEditado, true);

    // Verificar persistencia del cambio al volver al listado
    await paginaTenants.navegarASeccion();
    await paginaTenants.buscar(nombreEditado);
    await expect(paginaTenants.filaTenantPorNombre(nombreEditado)).toBeVisible({ timeout: 15000 });
  });
});
