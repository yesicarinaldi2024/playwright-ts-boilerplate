import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Dar de alta un tenant, buscarlo y editar la definición del tema.
 */
test.describe('MOD-ORG-TEN-TC-12 | Flujo completo Alta y Asociación de Tema', () => {

  test.beforeEach(async ({ paginaLogin, paginaTenants }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaTenants.navegarASeccion();
  });

  test('Asociar tema a nuevo tenant', async ({ paginaTenants }) => {
    const nombreTenant = `AUTO_TENANT_THEME_${Date.now()}`;

    await paginaTenants.crearTenant(nombreTenant);
    await paginaTenants.cerrarConfirmacionSiExiste();
    await paginaTenants.entrarADetalle(nombreTenant);

    // Intentar asociar el tema 'Default' o el primero disponible
    const temaAplicado = await paginaTenants.configurarTema('Default');

    if (!temaAplicado) {
      // Caso emergente: el tenant puede no tener temas disponibles en QA
      await expect(paginaTenants.msgSinTemas).toBeVisible({ timeout: 10000 });
      return;
    }

    // Verificar persistencia visual cuando sí hay temas
    await expect(paginaTenants.selectTema).toContainText(temaAplicado);
  });
});
