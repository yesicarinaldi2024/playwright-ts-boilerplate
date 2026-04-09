import { test, expect } from '../../../fixtures/test-base';

test.describe('MOD-ACCESO-LOG-TC-05', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
  });

  test('Email invalido', async ({ paginaLogin }) => {
     await paginaLogin.iniciarSesionUsuario('usuariosecreto#testing.com', 'clavesecreta');
     await paginaLogin.comprobarAlertaCredencialesInvalidas();
  });
});
