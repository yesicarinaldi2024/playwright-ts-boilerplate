import { test, expect } from '../../../fixtures/test-base';

test.describe('MOD-ACCESO-LOG-TC-03', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
  });

  test('Usuario inexistente', async ({ paginaLogin }) => {
     await paginaLogin.iniciarSesionUsuario('ghost@nobody.com', process.env.PASSWORD_TEST || 'test1234');
     await paginaLogin.comprobarAlertaCredencialesInvalidas();
  });
});
