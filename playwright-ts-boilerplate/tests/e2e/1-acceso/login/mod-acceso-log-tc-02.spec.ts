import { test, expect } from '../../../fixtures/test-base';

test.describe('MOD-ACCESO-LOG-TC-02', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
  });

  test('Intento contraseña inválida', async ({ paginaLogin, page }) => {
     await paginaLogin.iniciarSesionUsuario(process.env.USUARIO_TEST || 'admin', 'ClaveIncorrecta123*');
     await paginaLogin.comprobarAlertaCredencialesInvalidas();
     await expect(page).toHaveURL(/.*?keycloack.*/);
  });
});
