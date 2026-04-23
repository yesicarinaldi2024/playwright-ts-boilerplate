import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Crear una sucursal y cargarle una dirección.
 * ESTABLE: Uso de login integrado, navegación directa y aserciones de campo precisas.
 */
test.describe('MOD-ORG-SUC-TC-05 | Edición de Dirección de Sucursal', () => {
  test.setTimeout(90000);

  test.beforeEach(async ({ paginaLogin, paginaSucursales }) => {
    // PASO: Autenticación inicial
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaSucursales.navegarASeccion();
  });

  test('Modificar dirección de una sucursal existente', async ({ paginaSucursales, page }) => {
    const ts = Date.now();
    const nombreSucursal = `AUTO_SUC_ADDR_${ts}`;
    const direccion = 'Nueva Calle 999';
    const ciudad = 'Avellaneda';

    // ========== PASO 1: CREAR LA SUCURSAL ==========
    console.log(`[Paso 1] Creando sucursal: ${nombreSucursal}`);
    const storeUrl = await paginaSucursales.crearSucursal(nombreSucursal);

    // ========== PASO 2: NAVEGAR AL DETALLE ==========
    console.log('[Paso 2] Navegando al detalle');
    if (storeUrl) {
      await page.goto(storeUrl, { waitUntil: 'networkidle' });
    } else {
      await paginaSucursales.irADetalle(nombreSucursal);
    }
    await expect(page).toHaveURL(/.*\/stores\/[a-zA-Z0-9-]{8,}/, { timeout: 15000 });

    // ========== PASO 3: COMPLETAR LA DIRECCIÓN ==========
    console.log(`[Paso 3] Completando dirección: ${direccion}, ${ciudad}`);
    await paginaSucursales.completarDireccion(direccion, ciudad);
    await page.waitForLoadState('networkidle');

    // ========== PASO 4: VALIDAR ACTUALIZACIÓN ==========
    console.log('[Paso 4] Validando persistencia de campos');
    const inputDireccion = page.locator('input[formControlName="address"]').first();
    await expect(inputDireccion).toHaveValue(direccion, { timeout: 10000 });

    const inputCiudad = page.locator('input[formControlName="city"]').first();
    await expect(inputCiudad).toHaveValue(ciudad, { timeout: 10000 });
  });
});
