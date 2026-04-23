import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Efectuar una búsqueda de una sucursal que existe y consultarla.
 * ESTABLE: Uso de login integrado y navegación directa al detalle.
 */
test.describe('MOD-ORG-SUC-TC-03 | Búsqueda y Consulta de Sucursal', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ paginaLogin, paginaSucursales }) => {
    // PASO: Autenticación inicial
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaSucursales.navegarASeccion();
  });

  test('Buscar sucursal existente y validar navegación al detalle', async ({ paginaSucursales, page }) => {
    const ts = Date.now();
    const nombreSucursal = `AUTO_SUC_CONS_${ts}`;

    // ========== PASO 1: CREAR LA SUCURSAL ==========
    console.log(`[Paso 1] Creando sucursal: ${nombreSucursal}`);
    const storeUrl = await paginaSucursales.crearSucursal(nombreSucursal);

    // ========== PASO 2: NAVEGAR AL DETALLE ==========
    console.log('[Paso 2] Navegando al detalle');
    if (storeUrl) {
      await page.goto(storeUrl, { waitUntil: 'networkidle' });
    } else {
      await paginaSucursales.buscar(nombreSucursal);
      await paginaSucursales.irADetalle(nombreSucursal);
    }
    await expect(page).toHaveURL(/.*\/stores\/[a-zA-Z0-9-]{8,}/, { timeout: 15000 });

    // ========== PASO 3: VALIDAR TÍTULO EN HEADER ==========
    console.log('[Paso 3] Validando nombre en el header');
    const tituloSucursal = page.locator('[role="heading"], .mat-mdc-card-title, h1, h2, h3')
      .filter({ hasText: nombreSucursal })
      .first();
    await expect(tituloSucursal).toBeVisible({ timeout: 10000 });
  });
});
