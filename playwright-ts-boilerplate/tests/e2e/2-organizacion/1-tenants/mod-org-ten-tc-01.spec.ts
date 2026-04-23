import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Alta exitosa de un Tenant básico.
 */
test.describe('MOD-ORG-TEN-TC-01 | Alta Exitosa de Tenant Básico', () => {

   test.beforeEach(async ({ paginaLogin, paginaTenants }) => {
      await paginaLogin.visitarLogin();
      await paginaLogin.autenticar();
      await paginaTenants.navegarASeccion();
   });

   test('Crear un nuevo tenant básico', async ({ paginaTenants, page }) => {
      const nombreTenant = `AUTO_TEN_TC01_${Date.now()}`;

      // Validar alta por API para mayor robustez del caso de éxito
      const altaTenantOk = page.waitForResponse(
         response =>
            response.url().includes('/tenants') &&
            response.request().method() === 'POST' &&
            response.ok()
      );

      await paginaTenants.crearTenant(nombreTenant);

      const responseAlta = await altaTenantOk;
      expect(responseAlta.status()).toBeGreaterThanOrEqual(200);
      expect(responseAlta.status()).toBeLessThan(300);

      // Validar persistencia en grilla
      await paginaTenants.buscar(nombreTenant);
      await expect(paginaTenants.filaTenantPorNombre(nombreTenant)).toBeVisible({ timeout: 15000 });
   });
});
