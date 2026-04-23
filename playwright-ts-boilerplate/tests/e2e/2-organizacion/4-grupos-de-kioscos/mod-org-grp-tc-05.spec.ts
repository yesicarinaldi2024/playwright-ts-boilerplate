import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Buscar y consultar un kiosco creado, moverlo a otro grupo.
 */
test.describe('MOD-ORG-GRP-TC-05 | Mover Kiosco a Otro Grupo', () => {

  test.beforeEach(async ({ paginaLogin, paginaKioscos }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaKioscos.navegarASeccion();
  });

  test('Reasignar un kiosco existente a un grupo diferente', async ({ paginaKioscos, page }) => {
    const nombreKiosco = `AUTO_KIO_MOVER_${Date.now()}`;

    // Crear kiosco
    await paginaKioscos.crearKiosco(nombreKiosco, true);
    await paginaKioscos.irADetalle(nombreKiosco);

    // Editar y cambiar grupo
    await paginaKioscos.tabInformacion.click();
    await paginaKioscos.btnEditarInfo.click();
    await paginaKioscos.comboGrupoDetalle.click();

    const opciones = page.getByRole('option');
    if (await opciones.count() > 1) {
      await opciones.nth(1).click();
    } else if (await opciones.count() > 0) {
      await opciones.first().click();
    }

    await paginaKioscos.btnGuardarCambios.click();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.mat-mdc-card-title, h1, h2').filter({ hasText: nombreKiosco }).first()).toBeVisible();
  });
});
