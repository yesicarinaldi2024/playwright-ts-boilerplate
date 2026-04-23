import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Dar de alta un kiosco de manera exitosa que NO sea Canal Virtual.
 */
test.describe('MOD-ORG-KIO-TC-02 | Alta de Kiosco – No Canal Virtual', () => {

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

  test('Crear kiosco sin canal virtual exitosamente', async ({ paginaKioscos, page }) => {
    const nombre = `AUTO_KIO_FISICO_${Date.now()}`;

    // Interceptar la creación
    const altaOkPromise = page.waitForResponse(r =>
      r.url().includes('/kiosks') && r.request().method() === 'POST' && r.ok(),
      { timeout: 30000 }
    );

    await paginaKioscos.crearKiosco(nombre, false);

    // Esperar explícitamente por la respuesta de API
    await altaOkPromise;

    // Verificar que aparece en la grilla
    await paginaKioscos.buscar(nombre);

    // Buscar la fila de manera más estable
    const filaKiosco = page.locator('mat-table mat-row, table tr').filter({ hasText: nombre }).first();
    await expect(filaKiosco).toBeVisible({ timeout: 15000 });
  });
});
