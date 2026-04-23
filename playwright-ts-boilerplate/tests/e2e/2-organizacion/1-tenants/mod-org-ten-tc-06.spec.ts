import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Intentar dar de alta un tenant que ya existe y validar el mensaje de error.
 */
test.describe('MOD-ORG-TEN-TC-06 | Intentar crear Tenant duplicado', () => {

  test.beforeEach(async ({ paginaLogin, paginaTenants }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaTenants.navegarASeccion();
  });

  test('Validar mensaje de error por duplicado en API y UI', async ({ paginaTenants, page }) => {
    const nombreTenantDuplicado = `AUTO_TENANT_DUP_${Date.now()}`;

    // 1) Crear tenant base para garantizar precondición
    await paginaTenants.crearTenant(nombreTenantDuplicado);
    await paginaTenants.buscar(nombreTenantDuplicado);
    await expect(paginaTenants.filaTenantPorNombre(nombreTenantDuplicado)).toBeVisible({ timeout: 15000 });

    // Cerrar modal de confirmación de alta exitosa antes del segundo intento
    const dialogConfirmacion = page
      .locator('mat-dialog-container, [role="dialog"], .cdk-dialog-container')
      .filter({ hasText: /confirmación/i })
      .first();
    if (await dialogConfirmacion.isVisible().catch(() => false)) {
      await dialogConfirmacion.getByRole('button', { name: /cerrar/i }).click();
      await expect(dialogConfirmacion).toBeHidden({ timeout: 10000 });
    }

    // 2) Intentar dar de alta nuevamente EXACTAMENTE el mismo tenant
    const [response] = await Promise.all([
      page.waitForResponse(response =>
        response.url().includes('/tenants') && response.request().method() === 'POST' && response.status() >= 400
      ),
      paginaTenants.crearTenant(nombreTenantDuplicado)
    ]);

    expect(response.status()).toBeGreaterThanOrEqual(400);

    // 3) Validar feedback visual estable en el mismo modal
    const dialogAlta = page
      .locator('mat-dialog-container, [role="dialog"], .cdk-dialog-container')
      .filter({ hasText: /crear un nuevo tenant/i })
      .first();
    await expect(dialogAlta.getByText(/error al crear el tenant/i)).toBeVisible({ timeout: 10000 });
  });
});
