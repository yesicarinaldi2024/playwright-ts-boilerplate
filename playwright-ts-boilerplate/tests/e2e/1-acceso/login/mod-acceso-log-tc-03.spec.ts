import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Impedir fugas de acceso de agentes no reconocidos.
 */
test.describe('MOD-ACCESO-LOG-TC-03 | Intento de ingreso con usuario inexistente', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
  });

  test('Usuario inexistente', async ({ paginaLogin }) => {
     await paginaLogin.iniciarSesionUsuario('ghost@nobody.com', process.env.PASSWORD_TEST || 'test1234');
     await paginaLogin.comprobarAlertaCredencialesInvalidas();
  });
});
