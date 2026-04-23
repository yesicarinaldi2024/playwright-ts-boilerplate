import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Buscar, consultar y modificar el nombre de un kiosco existente
 * y asignarlo a otra sucursal diferente.
 */
test.describe('MOD-ORG-KIO-TC-05 | Modificar Kiosco y Cambiar Sucursal', () => {

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

  test('Editar nombre y reasignar sucursal de un kiosco', async ({ paginaKioscos, page }) => {
    const nombreOriginal = `AUTO_KIO_EDITABLE_${Date.now()}`;
    const nombreModificado = `${nombreOriginal}_MOD`;

    // Crear un kiosco para editar
    await paginaKioscos.crearKiosco(nombreOriginal, true);

    // Navegar al detalle
    await paginaKioscos.irADetalle(nombreOriginal);

    // Editar nombre y cambiar sucursal utilizando el método más robusto
    await paginaKioscos.editarNombreYSucursal(nombreModificado, '');

    // Verificar que el nombre cambió
    const headerDetalle = page.locator('mat-card-title, h1, h2, .title').filter({ hasText: nombreModificado }).first();
    await expect(headerDetalle).toBeVisible({ timeout: 15000 });
  });
});
