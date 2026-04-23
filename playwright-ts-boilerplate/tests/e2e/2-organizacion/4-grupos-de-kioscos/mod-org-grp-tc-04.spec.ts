import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Buscar un grupo recientemente creado y cambiarlo de sucursal.
 */
test.describe('MOD-ORG-GRP-TC-04 | Cambiar Sucursal de Grupo', () => {

  test.beforeEach(async ({ paginaLogin, paginaGruposKioscos }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaGruposKioscos.navegarASeccion();
  });

  test('Reasignar sucursal de un grupo desde su detalle', async ({ paginaGruposKioscos, page }) => {
    const nombre = `AUTO_GRP_SUC_${Date.now()}`;

    await paginaGruposKioscos.crearGrupo(nombre);
    await paginaGruposKioscos.irADetalle(nombre);

    // Editar y cambiar sucursal
    await paginaGruposKioscos.tabInformacion.click();
    await paginaGruposKioscos.btnEditarInfo.click();
    await paginaGruposKioscos.comboSucursalDetalle.click();

    const opciones = page.getByRole('option');
    if (await opciones.count() > 1) {
      await opciones.nth(1).click();
    } else if (await opciones.count() > 0) {
      await opciones.first().click();
    }

    await paginaGruposKioscos.btnGuardarCambios.click();
    await page.waitForLoadState('networkidle');

    // Verificar que se guardó sin error
    await expect(page.locator('.mat-mdc-card-title, h1, h2').filter({ hasText: nombre }).first()).toBeVisible();
  });
});
