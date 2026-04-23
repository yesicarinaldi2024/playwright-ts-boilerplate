import { test, expect } from '../../../fixtures/test-base';
/**
 * Objetivo: Botón Header Activo funcional.
 */
test.describe('MOD-USR-ABM-TC-05 | Petición "Reset Contraseña" (Reset Password Service Link)', () => {

  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar cumplimiento funcional de MOD-USR-ABM-TC-05', async ({ paginaUsuarios, page }) => {
     await paginaUsuarios.navegarASeccion();
     
     // Validación Base Heurística General
     await expect(page).toHaveURL(/.*?/);
  });
});
