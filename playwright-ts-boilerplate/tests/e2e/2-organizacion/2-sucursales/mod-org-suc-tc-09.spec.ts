import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Configurar Pantalla de Espera cargando Media y texto.
 * ESTABLE: Navegación directa y comprobación de persistencia.
 */
test.describe('MOD-ORG-SUC-TC-09 | Personalización: Pantalla de Espera', () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ paginaLogin, paginaSucursales }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaSucursales.navegarASeccion();
  });

  test('Cargar fondo desde Media y guardar configuración visual', async ({ paginaSucursales, page }) => {
    const ts = Date.now();
    const nombreSucursal = `AUTO_SUC_ESPERA_${ts}`;
    const textoEspera = `Su pedido ${ts} está siendo preparado`;

    // ========== PASO 1: CREAR SUCURSAL ==========
    const storeUrl = await paginaSucursales.crearSucursal(nombreSucursal);
    if (storeUrl) {
      await page.goto(storeUrl, { waitUntil: 'networkidle' });
    } else {
      await paginaSucursales.irADetalle(nombreSucursal);
    }

    // ========== PASO 2: IR A PANTALLA DE ESPERA ==========
    await paginaSucursales.tabPantallaEspera.click();
    await page.waitForLoadState('networkidle');

    // Habilitar personalización si está OFF (Uso de aria-checked para MDC)
    const toggleEspera = paginaSucursales.togglePersonalizarEspera;
    const isChecked = await toggleEspera.getAttribute('aria-checked') === 'true';
    if (!isChecked) {
      console.log('[Paso 2] Activando toggle de personalización');
      await toggleEspera.click({ force: true });
      await page.waitForTimeout(1000);
    }

    // ========== PASO 3: SELECCIONAR MEDIA ==========
    console.log('[Paso 3] Seleccionando media "a"');
    await paginaSucursales.seleccionarMedia('a');

    // ========== PASO 4: COMPLETAR TEXTO Y GUARDAR ==========
    await paginaSucursales.inputTextoEspera.fill(textoEspera);
    
    const saveResponse = page.waitForResponse(
      r => r.url().includes('/stores') && ['PUT', 'PATCH'].includes(r.request().method()),
      { timeout: 15000 }
    ).catch(() => null);

    await paginaSucursales.btnGuardarCambios.click({ force: true });
    await saveResponse;

    // ========== PASO 5: VALIDACIÓN DE PERSISTENCIA ==========
    await page.reload({ waitUntil: 'networkidle' });
    await paginaSucursales.tabPantallaEspera.click();
    
    await expect(paginaSucursales.inputTextoEspera).toHaveValue(textoEspera, { timeout: 10000 });
  });
});
