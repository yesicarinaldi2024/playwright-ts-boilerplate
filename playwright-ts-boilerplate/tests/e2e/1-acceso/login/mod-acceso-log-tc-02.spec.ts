import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Comprobar la negación ante fallos de coincidencia Auth garantizando seguridad de cuentas.
 */
test.describe('MOD-ACCESO-LOG-TC-02 | Intento de ingreso con contraseña inválida', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
  });

  test('Intento contraseña inválida', async ({ paginaLogin, page }) => {
     await paginaLogin.iniciarSesionUsuario(process.env.USUARIO_TEST || 'admin', 'ClaveIncorrecta123*');
     await paginaLogin.comprobarAlertaCredencialesInvalidas();
      await expect(page).toHaveURL(/.*?keycloack.*/);
  });
});
