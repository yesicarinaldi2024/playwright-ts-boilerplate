import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Ingresar al campo de búsqueda y buscar un tenant que exista. Verificar filtrado.
 */
test.describe('MOD-ORG-TEN-TC-08 | Búsqueda y filtrado de Tenants', () => {

  test.beforeEach(async ({ paginaLogin, paginaTenants }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaTenants.navegarASeccion();
  });

  test('Validar búsqueda por nombre en la grilla', async ({ paginaTenants }) => {
    const nombreBusqueda = `AUTO_TENANT_SEARCH_${Date.now()}`;

    // Precondición controlada para evitar dependencia de datos existentes
    await paginaTenants.crearTenant(nombreBusqueda);
    await paginaTenants.cerrarConfirmacionSiExiste();

    await paginaTenants.buscar(nombreBusqueda);
    await expect(paginaTenants.filaTenantPorNombre(nombreBusqueda)).toBeVisible({ timeout: 15000 });
  });
});
