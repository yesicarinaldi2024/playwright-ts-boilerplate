import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Crear kiosko, Buscar y consultar el kiosco recientemente creado.
 */
test.describe('MOD-ORG-KIO-TC-03 | Búsqueda y Consulta de Kiosco', () => {

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

  test('Buscar kiosco existente y acceder a su detalle', async ({ paginaKioscos, page }) => {
    const nombre = `AUTO_KIO_CONSULTA_${Date.now()}`;

    // Crear el kiosco primero
    await paginaKioscos.crearKiosco(nombre, true);

    // Buscar y entrar al detalle
    await paginaKioscos.irADetalle(nombre);

    // Verificar que estamos en el detalle - El nombre debe aparecer en el título o header
    // Usamos un selector flexible que busque el nombre en elementos de encabezado o títulos de tarjeta
    const headerDetalle = page.locator('mat-card-title, h1, h2, .title').filter({ hasText: nombre }).first();
    await expect(headerDetalle).toBeVisible({ timeout: 15000 });
    
    // También verificar que la URL es la correcta
    await expect(page).toHaveURL(/.*\/kiosks\/.*/);
  });
});
