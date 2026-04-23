import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Validar el ciclo de vida completo de un contacto en una sucursal:
 * 1. Crear Sucursal.
 * 2. Agregar Contacto y Guardar.
 * 3. Salir y volver a buscar la sucursal.
 * 4. Consultar y eliminar el contacto.
 * 5. Verificar que la eliminación persiste.
 */
test.describe('MOD-ORG-SUC-TC-07 | Ciclo de Vida de Contacto: Alta, Búsqueda y Baja', () => {
  test.setTimeout(120000); // Tiempo extendido para proceso multi-paso

  test.beforeEach(async ({ paginaLogin, paginaSucursales }) => {
    // PASO: Login e ir a la sección de Sucursales
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaSucursales.navegarASeccion();
  });

  test.afterEach(async ({ page }) => {
    // PASO: Logout para mantener ambiente limpio
    try {
      await page.goto('/logout', { waitUntil: 'domcontentloaded' });
    } catch (e) {
      // Ignorar si el logout falla
    }
  });

  test('Debe permitir crear sucursal, agregar contacto, guardarlo y luego eliminarlo tras búsqueda', async ({ paginaSucursales, page }) => {
    const ts = Date.now();
    const nombreSucursal = `AUTO_SUC_CONTACT_LIFE_${ts}`;
    const emailContacto = `test_${ts}@sucursal.com`;

    // ========== PASO 1: CREAR SUCURSAL ==========
    // Se crea la sucursal base y se captura la URL de detalle
    console.log(`[Paso 1] Creando sucursal: ${nombreSucursal}`);
    const storeUrl = await paginaSucursales.crearSucursal(nombreSucursal);
    
    // Si tenemos la URL navegamos directo, sino usamos búsqueda
    if (storeUrl) {
      await page.goto(storeUrl, { waitUntil: 'networkidle' });
    } else {
      await paginaSucursales.irADetalle(nombreSucursal);
    }
    await expect(page).toHaveURL(/.*\/stores\/[a-zA-Z0-9-]{8,}/);

    // ========== PASO 2: AGREGAR CONTACTO Y GUARDAR ==========
    // Se agregan los datos y se presiona el botón Guardar Cambios global
    console.log(`[Paso 2] Agregando contacto: ${emailContacto}`);
    await paginaSucursales.agregarContacto(
      'Contacto de Prueba',
      'Responsable',
      '123456789',
      emailContacto
    );

    // ========== PASO 3: VOLVER A LA LISTA Y BUSCAR ==========
    // Para validar persistencia, salimos al listado y volvemos a entrar tras buscar
    console.log('[Paso 3] Volviendo al listado y buscando la sucursal');
    await paginaSucursales.navegarASeccion();
    await page.waitForLoadState('networkidle');
    await paginaSucursales.buscar(nombreSucursal);
    await paginaSucursales.irADetalle(nombreSucursal);
    
    // Validar que el contacto sigue allí
    await paginaSucursales.tabContactos.click();
    await expect(page.getByText(emailContacto)).toBeVisible({ timeout: 10000 });

    // ========== PASO 4: ELIMINAR CONTACTO Y GUARDAR ==========
    // Se ejecuta la baja del contacto y se guardan los cambios nuevamente
    console.log(`[Paso 4] Eliminando contacto: ${emailContacto}`);
    await paginaSucursales.eliminarContacto(emailContacto);

    // ========== PASO 5: VERIFICACIÓN FINAL ==========
    // Se valida que el email ya no exista en el listado de este detalle
    console.log('[Paso 5] Verificando eliminación persistente');
    await page.waitForLoadState('networkidle');
    await page.reload({ waitUntil: 'networkidle' }); // Recargar para asegurar que la API no lo trae
    
    await paginaSucursales.tabContactos.click();
    await expect(page.getByText(emailContacto)).not.toBeVisible({ timeout: 10000 });
  });
});
