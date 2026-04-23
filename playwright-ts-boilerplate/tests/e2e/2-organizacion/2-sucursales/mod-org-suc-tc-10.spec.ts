import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Intentar dar de alta con strings extensos y caracteres especiales.
 * ESTABLE: Uso de login integrado, navegación directa y aserciones de tabla robustas.
 */
test.describe('MOD-ORG-SUC-TC-10 | Stress: Caracteres Especiales y Longitud', () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ paginaLogin, paginaSucursales }) => {
    // PASO: Autenticación inicial
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaSucursales.navegarASeccion();
  });

  test('Alta de sucursal con datos de borde (Edge cases)', async ({ paginaSucursales, page }) => {
    const ts = Date.now();
    const nombreExtremo = `SUC_${ts}_ñáéíóú_!@#$%^&*()_` + 'X'.repeat(20);

    // ========== PASO 1: CREAR SUCURSAL CON DATOS EXTREMOS ==========
    console.log(`[Paso 1] Creando sucursal extrema: ${nombreExtremo}`);
    const storeUrl = await paginaSucursales.crearSucursal(nombreExtremo);
    
    if (storeUrl) {
      await page.goto(storeUrl, { waitUntil: 'networkidle' });
    } else {
      await paginaSucursales.irADetalle(nombreExtremo);
    }
    
    // Validar que el nombre extremo se visualice en el detalle
    const titulo = page.locator('[role="heading"], .mat-mdc-card-title, h1, h2, h3').filter({ hasText: nombreExtremo }).first();
    await expect(titulo).toBeVisible({ timeout: 15000 });

    // ========== PASO 2: VERIFICAR EN BÚSQUEDA ==========
    console.log('[Paso 2] Verificando en el listado general');
    await paginaSucursales.navegarASeccion();
    
    // Buscar por el prefijo (más estable si hay truncamiento en UI)
    const prefijoBusqueda = `SUC_${ts}`;
    await paginaSucursales.buscar(prefijoBusqueda);
    
    // La fila debe existir en la tabla (usamos regex para búsqueda parcial segura)
    const fila = page.locator('tr, .mat-mdc-row').filter({ hasText: prefijoBusqueda }).first();
    await expect(fila).toBeVisible({ timeout: 15000 });
  });
});
