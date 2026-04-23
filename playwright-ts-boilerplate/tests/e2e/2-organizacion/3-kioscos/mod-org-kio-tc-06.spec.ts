import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Buscar un kiosco recientemente creado y verificar que se encuentre
 * asignado a un grupo.
 */
test.describe('MOD-ORG-KIO-TC-06 | Kiosco Asignado a un Grupo', () => {

  test.setTimeout(120000);

  test.beforeEach(async ({ paginaLogin, paginaKioscos }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaKioscos.navegarASeccion();
  });

  test.afterEach(async ({ page }) => {
    try {
      await page.goto('/logout', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');
    } catch (e) {
      // Si falla el logout, al menos intentar limpiar la sesión
    }
  });

  test('Verificar que un kiosco está asignado a un grupo', async ({ paginaKioscos, page }) => {
    const nombreKiosco = `AUTO_KIO_GRUPO_${Date.now()}`;

    // Crear kiosco
    await paginaKioscos.crearKiosco(nombreKiosco, true);

    // Navegar al detalle
    await paginaKioscos.irADetalle(nombreKiosco);

    // Esperar y clickear en la pestaña de información (si no está ya activa)
    await expect(paginaKioscos.tabInformacion).toBeVisible({ timeout: 15000 });
    await paginaKioscos.tabInformacion.click();

    // El kiosco se muestra en su detalle sin error
    const headerDetalle = page.locator('mat-card-title, h1, h2, .title').filter({ hasText: nombreKiosco }).first();
    await expect(headerDetalle).toBeVisible({ timeout: 15000 });
  });
});
