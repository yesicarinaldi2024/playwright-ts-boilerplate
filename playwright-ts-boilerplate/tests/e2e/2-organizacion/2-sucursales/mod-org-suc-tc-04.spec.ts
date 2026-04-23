import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Crear una sucursal y editar su nombre.
 * ESTABLE: Uso de login integrado, navegación directa y recarga de validación.
 */
test.describe('MOD-ORG-SUC-TC-04 | Edición de Información de Sucursal', () => {
  test.setTimeout(90000);

  test.beforeEach(async ({ paginaLogin, paginaSucursales }) => {
    // PASO: Autenticación inicial
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaSucursales.navegarASeccion();
  });

  test('Crear sucursal y modificar su nombre técnico', async ({ paginaSucursales, page }) => {
    const ts = Date.now();
    const nombreBase = `AUTO_SUC_EDIT_${ts}`;
    const nombreModificado = `${nombreBase}_MOD`;

    // ========== PASO 1: CREAR LA SUCURSAL ==========
    console.log(`[Paso 1] Creando sucursal base: ${nombreBase}`);
    const storeUrl = await paginaSucursales.crearSucursal(nombreBase);

    // ========== PASO 2: NAVEGAR AL DETALLE ==========
    console.log('[Paso 2] Navegando al detalle');
    if (storeUrl) {
      await page.goto(storeUrl, { waitUntil: 'networkidle' });
    } else {
      await paginaSucursales.irADetalle(nombreBase);
    }
    await expect(page).toHaveURL(/.*\/stores\/[a-zA-Z0-9-]{8,}/, { timeout: 15000 });

    // ========== PASO 3: EDITAR EL NOMBRE ==========
    console.log(`[Paso 3] Modificando nombre a: ${nombreModificado}`);
    await paginaSucursales.editarNombre(nombreModificado);
    await page.waitForLoadState('networkidle');

    // ========== PASO 4: VALIDAR ACTUALIZACIÓN ==========
    console.log('[Paso 4] Validando cambio en caliente');
    const tituloActualizado = page.locator('[role="heading"], .mat-mdc-card-title, h1, h2, h3')
      .filter({ hasText: nombreModificado })
      .first();
    await expect(tituloActualizado).toBeVisible({ timeout: 10000 });

    // ========== PASO 5: VALIDAR PERSISTENCIA (RELOAD) ==========
    console.log('[Paso 5] Validando persistencia tras recargar');
    await page.reload({ waitUntil: 'networkidle' });
    await expect(tituloActualizado).toBeVisible({ timeout: 10000 });
  });
});
