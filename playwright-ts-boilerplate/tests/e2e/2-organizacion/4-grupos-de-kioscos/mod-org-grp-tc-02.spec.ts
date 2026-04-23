import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Crear un grupo sin completar los campos obligatorios.
 */
test.describe('MOD-ORG-GRP-TC-02 | Validación de Campos Requeridos', () => {

  test.beforeEach(async ({ paginaLogin, paginaGruposKioscos }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaGruposKioscos.navegarASeccion();
  });

  test('Intentar crear grupo sin datos y validar bloqueo', async ({ paginaGruposKioscos, page }) => {
    await paginaGruposKioscos.btnNuevoGrupo.click();

    // Disparar validaciones (touch + blur)
    await paginaGruposKioscos.inputNombre.click();
    await paginaGruposKioscos.inputNombre.blur();

    const btnCrear = paginaGruposKioscos.btnCrear;
    const isEnabled = await btnCrear.isEnabled();

    if (isEnabled) {
      await btnCrear.click();
      await expect(page.locator('mat-error').first()).toBeVisible();
    } else {
      expect(isEnabled).toBe(false);
    }
  });
});
