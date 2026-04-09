import { test, expect } from '../../../fixtures/test-base';

test.describe('MOD-ACCESO-LOG-TC-06', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
  });

  test('Cuenta Suspendida', async ({ paginaLogin }) => {
     await paginaLogin.iniciarSesionUsuario('cuenta_suspendida@test.com', 'testingpass');
     await paginaLogin.comprobarAlertaCredencialesInvalidas();
  });
});
