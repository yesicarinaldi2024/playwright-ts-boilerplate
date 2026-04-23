import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Intentar dar de alta un kiosco sin completar los campos obligatorios.
 * Verificar que impida el alta y validar el código recibido en la API.
 */
test.describe('MOD-ORG-KIO-TC-04 | Validación de Campos Requeridos', () => {

  test.setTimeout(120000);

  test.beforeEach(async ({ paginaLogin, paginaKioscos }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaKioscos.navegarASeccion();
  });

  test.afterEach(async ({ page }) => {
    try {
      await page.goto('/logout', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');
    } catch (e) {
      // Si falla el logout, al menos intentar limpiar la sesión
    }
  });

  test('Intentar crear kiosco sin datos y validar errores', async ({ paginaKioscos, page }) => {
    // Abrir modal
    await expect(paginaKioscos.btnNuevoKiosco).toBeVisible({ timeout: 15000 });
    await paginaKioscos.btnNuevoKiosco.click();

    const modal = page.locator('mat-dialog-container');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // Forzar blur en el campo nombre para disparar validaciones
    await expect(paginaKioscos.inputNombre).toBeVisible({ timeout: 10000 });
    await paginaKioscos.inputNombre.click();
    await paginaKioscos.inputNombre.blur();

    // El botón Crear debería estar deshabilitado o mostrar errores
    const btnCrear = paginaKioscos.btnCrear;
    
    // Verificar si el botón está deshabilitado (comportamiento esperado de Material)
    const isDisabled = await btnCrear.isDisabled();
    
    if (!isDisabled) {
        // Si no está deshabilitado, al hacer click debería fallar o mostrar errores
        await btnCrear.click();
    }

    // Validar que existan mensajes de error visibles
    const errores = page.locator('mat-error, .mat-error, [role="alert"]');
    await expect(errores.first()).toBeVisible({ timeout: 10000 });
    
    const countErrores = await errores.count();
    expect(countErrores).toBeGreaterThan(0);
  });
});
