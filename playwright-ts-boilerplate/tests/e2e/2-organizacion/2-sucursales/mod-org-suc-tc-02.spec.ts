import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Crear una sucursal, intentar crearla nuevamente con el mismo nombre
 * y validar que la API rechaza la solicitud duplicada con código de error >= 400.
 * ESTABLE: Uso de login integrado y aserciones de API robustas.
 */
test.describe('MOD-ORG-SUC-TC-02 | Alta de Sucursal Duplicada', () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ paginaLogin, paginaSucursales }) => {
    // PASO: Autenticación inicial
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaSucursales.navegarASeccion();
  });

  test('Validar error al intentar crear sucursal existente', async ({ paginaSucursales, page }) => {
    const ts = Date.now();
    const nombreSucursal = `AUTO_SUC_DUP_${ts}`;

    // ========== PASO 1: CREAR LA PRIMERA SUCURSAL EXITOSAMENTE ==========
    console.log(`[Paso 1] Creando sucursal base: ${nombreSucursal}`);
    const storeUrl = await paginaSucursales.crearSucursal(nombreSucursal);
    
    // Validar creación exitosa navegando al detalle si es posible
    if (storeUrl) {
      await page.goto(storeUrl, { waitUntil: 'networkidle' });
    } else {
      await paginaSucursales.irADetalle(nombreSucursal);
    }
    await expect(page).toHaveURL(/.*\/stores\/.*/);

    // ========== PASO 2: VOLVER A LA SECCIÓN Y REINTENTAR ALTA ==========
    console.log('[Paso 2] Volviendo al listado para intentar duplicado');
    await paginaSucursales.navegarASeccion();
    await page.waitForLoadState('networkidle');

    // ========== PASO 3: INTENTAR CREAR SUCURSAL DUPLICADA ==========
    console.log(`[Paso 3] Intentando recrear sucursal con nombre: ${nombreSucursal}`);
    await paginaSucursales.btnNuevaSucursal.click();
    
    await expect(paginaSucursales.inputNombre).toBeVisible({ timeout: 10000 });
    await paginaSucursales.inputNombre.fill(nombreSucursal);

    const btnCrear = page.locator('mat-dialog-container').getByRole('button', { name: /crear/i }).first();
    await expect(btnCrear).toBeVisible({ timeout: 10000 });

    // PASO 4: CAPTURAR LA RESPUESTA DE ERROR (POST /stores)
    const errorResponsePromise = page.waitForResponse(
      r => r.url().includes('/stores') && r.request().method() === 'POST',
      { timeout: 20000 }
    );

    await btnCrear.click();
    const errorResponse = await errorResponsePromise;

    // ========== PASO 5: VALIDAR RECHAZO DE LA API ==========
    console.log(`[Paso 5] Validando código de error: ${errorResponse.status()}`);
    expect(errorResponse.status()).toBeGreaterThanOrEqual(400);

    // Opcional: Cerrar el diálogo si permanece abierto tras el error
    try {
      await page.keyboard.press('Escape');
    } catch {}
  });
});
