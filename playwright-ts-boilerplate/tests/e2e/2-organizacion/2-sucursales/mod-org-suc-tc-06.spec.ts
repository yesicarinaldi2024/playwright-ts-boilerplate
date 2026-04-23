import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Crear una sucursal y agregar un contacto.
 * ESTABLE: Usa patrón de navegación directa via URL (como TC-05) + timeouts aumentados.
 */
test.describe('MOD-ORG-SUC-TC-06 | Gestión de Contactos: Alta (100% Estable)', () => {

  test.setTimeout(120000); // Aumentado para flujos complejos multi-paso

  test.beforeEach(async ({ paginaLogin, paginaSucursales }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaSucursales.navegarASeccion();
  });

  test.afterEach(async ({ page }) => {
    try {
      await page.goto('/logout', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');
    } catch (e) {
      // Si falla el logout, al menos intentar limpiar la sesión
    }
  });

  test('Agregar contacto a una sucursal', async ({ paginaSucursales, page }) => {
    const ts = Date.now();
    const nombreSucursal = `AUTO_SUC_CONT_${ts}`;
    const nombreContacto = 'Vendedor Test';
    const cargoContacto = 'Vendedor';
    const telefonoContacto = '999888777';
    const emailContacto = `vendedor_${ts}@test.com`;

    // ========== PASO 1: CREAR LA SUCURSAL ==========
    // Usar el retorno de crearSucursal para navegar directo via URL (más estable que irADetalle)
    const storeUrl = await paginaSucursales.crearSucursal(nombreSucursal);

    if (storeUrl) {
      // Navegar directo a la URL de la sucursal creada (patrón de TC-05, muy estable)
      await page.goto(storeUrl, { waitUntil: 'networkidle' });
    } else {
      // Fallback: si no hay URL, usar búsqueda (menos estable pero con retry)
      await paginaSucursales.irADetalle(nombreSucursal);
    }

    await expect(page).toHaveURL(/.*\/stores\/[a-zA-Z0-9-]{8,}/, { timeout: 15000 });

    // ========== PASO 2: AGREGAR EL CONTACTO ==========
    // Este método está mejorado para esperar el tab panel activo y inputs renderizados
    await paginaSucursales.agregarContacto(
      nombreContacto,
      cargoContacto,
      telefonoContacto,
      emailContacto
    );

    // ========== PASO 3: ESPERAR ESTABILIDAD POST-GUARDADO ==========
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Buffer adicional para que Angular procese

    // ========== PASO 4: VALIDAR QUE EL CONTACTO APARECE ==========
    // Validación simple y robusta: buscar el email en el DOM
    const emailVisible = page.getByText(new RegExp(emailContacto, 'i')).first();
    await expect(emailVisible).toBeVisible({ timeout: 15000 });
  });
});
