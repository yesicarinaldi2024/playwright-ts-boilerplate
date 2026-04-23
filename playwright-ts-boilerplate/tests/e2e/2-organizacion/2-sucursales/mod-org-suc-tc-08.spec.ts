import { test, expect } from '../../../fixtures/test-base';

/**
 * MOD-ORG-SUC-TC-08: Configuración de Métodos de Pago por Sucursal
 *
 * Objetivo: Crear una sucursal, habilitar métodos de pago personalizados,
 * guardar los cambios y verificar la persistencia.
 *
 * PASOS EJECUTADOS (documentados con emojis):
 * 1. De alta una sucursal
 * 2. Consulte el detalle de la sucursal
 * 3. Complete la dirección (requisito)
 * 4. Navegue a solapa MÉTODOS DE PAGO
 * 5. Habilite método de pago personalizado
 * 6. Vuelva a la grilla
 * 7. Busque la sucursal
 * 8. Consulte nuevamente y verifique persistencia
 *
 * ESTABLE: Usa métodos existentes de PaginaSucursales que ya están probados
 */
test.describe('MOD-ORG-SUC-TC-08 | Métodos de Pago y Habilitación', () => {
  test.setTimeout(300000); // 5 minutos

  test.beforeEach(async ({ paginaLogin, paginaSucursales }) => {
    console.log('\n=== SETUP: Autenticación ===');
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaSucursales.navegarASeccion();
    console.log('✓ Setup completado\n');
  });

  test('Habilitar métodos de pago personalizados y verificar persistencia', async ({
    paginaSucursales,
    page
  }) => {
    const ts = Date.now();
    const nombreSucursal = `AUTO_PAY_${ts}`;

    // ========== PASO 1: DE ALTA SUCURSAL ==========
    console.log('📝 PASO 1: De alta una sucursal');
    const storeUrl = await paginaSucursales.crearSucursal(nombreSucursal);
    console.log(`  ✓ Sucursal creada: "${nombreSucursal}"`);

    // ========== PASO 2: CONSULTE DETALLE ==========
    console.log('🔍 PASO 2: Consulte el detalle');
    if (storeUrl) {
      await page.goto(storeUrl, { waitUntil: 'networkidle' });
      console.log(`  ✓ Navegado directamente`);
    } else {
      await paginaSucursales.irADetalle(nombreSucursal);
      console.log(`  ✓ Navegado mediante búsqueda`);
    }
    await expect(page).toHaveURL(/.*\/stores\/[a-zA-Z0-9-]{8,}/);

    // ========== PASO 3: COMPLETE DIRECCIÓN ==========
    console.log('📍 PASO 3: Completando dirección (requisito)');
    await paginaSucursales.completarDireccion(`Calle Auto ${ts}`, 'Lanus');
    console.log(`  ✓ Dirección completada`);

    // ========== PASO 4: NAVEGUE A MÉTODOS DE PAGO ==========
    console.log('📑 PASO 4: Navegando a MÉTODOS DE PAGO');
    const tab = page.getByRole('tab', { name: /métodos de pago/i });
    await expect(tab).toBeVisible();
    await tab.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    console.log('  ✓ Solapa MÉTODOS DE PAGO abierta');

    // ========== PASO 5: HABILITAR MÉTODO DE PAGO NO UTILIZADO ==========
    console.log('💳 PASO 5: Habilitando método de pago nuevo (no utilizado antes)');

    // Navegar nuevamente a tab para estar seguro
    const tabMP = page.getByRole('tab', { name: /métodos de pago/i });
    if (!await tabMP.isVisible()) {
      await tabMP.click();
      await page.waitForTimeout(1000);
    }

    // Buscar el toggle "Personalizar para esta sucursal" y activarlo si no está
    const personalizeLabel = page.locator('text=/Personalizar para esta sucursal/i').first();
    await expect(personalizeLabel).toBeVisible({ timeout: 10000 });

    const personalizeToggle = personalizeLabel.locator('..').locator('[role="switch"], mat-slide-toggle, .mdc-switch').first();
    const isPersonalizeOn = await personalizeToggle.getAttribute('aria-checked') === 'true';

    if (!isPersonalizeOn) {
      console.log('  → Activando toggle "Personalizar para esta sucursal"...');
      await personalizeToggle.click({ force: true });
      await page.waitForTimeout(1500);
    }

    // Buscar todos los switches de métodos disponibles
    const allSwitches = page.locator('[role="switch"], mat-slide-toggle, .mdc-switch, button[class*="mdc-switch"]');
    const count = await allSwitches.count();

    console.log(`  → Encontrados ${count} switches en total`);

    // Habilitar cada uno y mostrar su estado actual
    let habilitados = 0;
    for (let i = 0; i < count; i++) {
      const sw = allSwitches.nth(i);
      const swContainer = sw.locator('..');
      const swText = await swContainer.textContent().catch(() => '');
      const isChecked = await sw.getAttribute('aria-checked') === 'true';

      // Saltar el toggle de Personalizar
      if (!swText?.toLowerCase().includes('personalizar')) {
        console.log(`  → ${swText?.trim()}: ${isChecked ? 'YA HABILITADO' : 'DESHABILITADO -> Habilitando...'}`);

        if (!isChecked) {
          await sw.click({ force: true });
          await page.waitForTimeout(800);
          habilitados++;
        }
      }
    }

    console.log(`  ✓ Habilitados ${habilitados} métodos nuevos`);

    // Guardar cambios
    console.log('  → Buscando botón GUARDAR CAMBIOS...');
    const btnGuardar = page.locator('button').filter({ hasText: /guardar cambios/i }).first();

    const btnGuardarVisible = await btnGuardar.isVisible({ timeout: 3000 }).catch(() => false);

    if (btnGuardarVisible) {
      console.log('  ✓ Botón GUARDAR CAMBIOS encontrado');
      console.log('  → Clickeando GUARDAR CAMBIOS...');

      const savePromise = page.waitForResponse(
        r => r.url().includes('/stores') && ['PUT', 'PATCH'].includes(r.request().method()),
        { timeout: 20000 }
      ).catch(() => null);

      await btnGuardar.click({ force: true });
      await page.waitForTimeout(1000);

      const response = await savePromise;

      if (response && response.status() < 400) {
        console.log(`  ✓ Guardado exitoso (HTTP ${response.status()})`);
      } else {
        console.log(`  ⚠️  Guardado completado (sin respuesta HTTP confirmada)`);
      }
    } else {
      console.log('  ❌ Botón GUARDAR CAMBIOS NO encontrado');
    }

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // ========== PASO 6: VOLVER A GRILLA ==========
    console.log('🔙 PASO 6: Volviendo a la grilla de sucursales');
    await paginaSucursales.navegarASeccion();
    await page.waitForTimeout(800);
    console.log('  ✓ En grilla de sucursales');

    // ========== PASO 7: BUSCAR SUCURSAL ==========
    console.log('🔍 PASO 7: Buscando la sucursal');
    await paginaSucursales.buscar(nombreSucursal);
    console.log('  ✓ Búsqueda completada');

    // ========== PASO 8: CONSULTAR NUEVAMENTE ==========
    console.log('📑 PASO 8: Abriendo detalle y consultando MÉTODOS DE PAGO');
    await paginaSucursales.irADetalle(nombreSucursal);
    const tab2 = page.getByRole('tab', { name: /métodos de pago/i });
    await expect(tab2).toBeVisible();
    await tab2.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    console.log('  ✓ Solapa MÉTODOS DE PAGO abierta nuevamente');

    // ========== PASO 9: VERIFICAR PERSISTENCIA ==========
    console.log('\n✅ PASO 9: Verificando persistencia de cambios');

    // Verificar que el toggle Personalizar está ON
    const toggleLabel = page.locator('text=/Personalizar para esta sucursal/i');
    const toggleParent = toggleLabel.locator('..');
    const toggle = toggleParent.locator('[role="switch"], mat-slide-toggle, .mdc-switch').first();

    const isPersonalizarOn = await toggle.getAttribute('aria-checked') === 'true';
    console.log(`  ${isPersonalizarOn ? '✅' : '❌'} Toggle "Personalizar": ${isPersonalizarOn ? 'HABILITADO' : 'deshabilitado'}`);

    // Verificar que EFECTIVO y MERCADOPAGO están habilitados
    const switches = page.locator('[role="switch"], mat-slide-toggle, .mdc-switch, button[class*="mdc-switch"]');
    const totalSwitches = await switches.count();

    let efectivoOk = false;
    let mercadopagoOk = false;

    for (let i = 0; i < totalSwitches; i++) {
      const sw = switches.nth(i);
      const swContainer = sw.locator('..');
      const swText = await swContainer.textContent().catch(() => '');
      const swTextLower = swText?.toLowerCase() || '';
      const isChecked = await sw.getAttribute('aria-checked') === 'true';

      if (swTextLower.includes('efectivo')) {
        efectivoOk = isChecked;
        console.log(`  ${isChecked ? '✅' : '❌'} EFECTIVO: ${isChecked ? 'HABILITADO' : 'deshabilitado'}`);
      }

      if ((swTextLower.includes('mercado pago') || swTextLower.includes('mercadopago')) && !swTextLower.includes('clover')) {
        mercadopagoOk = isChecked;
        console.log(`  ${isChecked ? '✅' : '❌'} MERCADOPAGO: ${isChecked ? 'HABILITADO' : 'deshabilitado'}`);
      }
    }

    // Validación final
    console.log('\n' + '='.repeat(60));
    if (isPersonalizarOn && efectivoOk && mercadopagoOk) {
      console.log('✅ TEST 100% EXITOSO - TODOS LOS CAMBIOS PERSISTIERON ✅');
      console.log('='.repeat(60) + '\n');
    } else {
      console.log('❌ TEST FALLIDO - NO TODOS LOS CAMBIOS PERSISTIERON ❌');
      console.log('='.repeat(60) + '\n');

      const detalles: string[] = [];
      if (!isPersonalizarOn) detalles.push('Toggle Personalizar NO persistió');
      if (!efectivoOk) detalles.push('EFECTIVO NO persistió');
      if (!mercadopagoOk) detalles.push('MERCADOPAGO NO persistió');

      throw new Error(`Cambios no persistieron: ${detalles.join(', ')}`);
    }
  });
});
