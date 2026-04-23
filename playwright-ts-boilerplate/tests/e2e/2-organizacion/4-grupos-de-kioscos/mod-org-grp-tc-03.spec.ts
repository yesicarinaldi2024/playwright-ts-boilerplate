import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Crear un nuevo grupo con un nombre que ya existe y verificar
 * que impida realizar esa acción.
 */
test.describe('MOD-ORG-GRP-TC-03 | Grupo Duplicado', () => {

  test.beforeEach(async ({ paginaLogin, paginaGruposKioscos }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
    await paginaGruposKioscos.navegarASeccion();
  });

  test('Validar error al crear grupo con nombre existente', async ({ paginaGruposKioscos, page }) => {
    const nombreExistente = `AUTO_GRP_DUP_${Date.now()}`;

    // Crear el original
    await paginaGruposKioscos.crearGrupo(nombreExistente);

    // Intentar crear duplicado monitoreando la API
    const responsePromise = page.waitForResponse(response =>
      response.url().includes('/api/kiosk-groups') && response.request().method() === 'POST'
    );

    await paginaGruposKioscos.crearGrupo(nombreExistente);

    const response = await responsePromise;
    expect(response.status()).toBeGreaterThanOrEqual(400);

    // Validar mensaje de error en pantalla
    await expect(page.locator('mat-error, .mat-mdc-snack-bar-container, .error-message').first()).toBeVisible();
  });
});
