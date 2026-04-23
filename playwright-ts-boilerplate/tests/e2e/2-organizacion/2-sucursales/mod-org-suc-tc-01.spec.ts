import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Crear una sucursal, completar información básica y habilitarla.
 * ESTABLE: Uso de login integrado, navegación directa y aserciones de estado robustas.
 */
test.describe('MOD-ORG-SUC-TC-01 | Alta Exitosa de Sucursal y Habilitación', () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ paginaLogin, paginaSucursales }) => {
    // PASO: Autenticación inicial
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaSucursales.navegarASeccion();
  });

  test('Crear sucursal, completar dirección y activar', async ({ paginaSucursales, page }) => {
    const ts = Date.now();
    const nombreSucursal = `AUTO_SUC_BASIC_${ts}`;

    // ========== PASO 1: CREAR SUCURSAL ==========
    console.log(`[Paso 1] Creando sucursal: ${nombreSucursal}`);
    const storeUrl = await paginaSucursales.crearSucursal(nombreSucursal);
    
    if (storeUrl) {
      await page.goto(storeUrl, { waitUntil: 'networkidle' });
    } else {
      await paginaSucursales.irADetalle(nombreSucursal);
    }
    await expect(page).toHaveURL(/.*\/stores\/[a-zA-Z0-9-]{8,}/);

    // ========== PASO 2: COMPLETAR INFORMACIÓN ==========
    console.log('[Paso 2] Completando dirección y ciudad');
    await paginaSucursales.completarDireccion('Calle Falsa 123', 'Springfield');
    await page.waitForLoadState('networkidle');

    // ========== PASO 3: HABILITAR SUCURSAL ==========
    console.log('[Paso 3] Habilitando la sucursal');
    await paginaSucursales.habilitar();
    
    // Verificación robusta del estado del toggle usando el PO
    await paginaSucursales.validarEstadoHabilitado(true);
  });
});
