import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Garantizar que el sistema habilita el ingreso a quien provea datos verificados.
 */
test.describe('MOD-ACCESO-LOG-TC-01 | Ingreso exitoso con credenciales válidas', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
  });

  test('Ingreso exitoso', async ({ paginaLogin, page }) => {
     await paginaLogin.ingresarComoAdministrador();
     
     // Confirmar acceso al sistema validando explícitamente un selector estable (Logo/Brand SELFORDER)
     await expect(page.locator('text=SELFORDER').first()).toBeVisible({ timeout: 15000 });
  });
});
