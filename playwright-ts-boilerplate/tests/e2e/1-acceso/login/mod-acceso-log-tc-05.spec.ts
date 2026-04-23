import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Verificar parseo Regex de correos antes del submit.
 */
test.describe('MOD-ACCESO-LOG-TC-05 | Chequeo de Patrón de Email inválido', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
  });

  test('Email invalido', async ({ paginaLogin }) => {
     await paginaLogin.iniciarSesionUsuario('usuariosecreto#testing.com', 'clavesecreta');
     await paginaLogin.comprobarAlertaCredencialesInvalidas();
  });
});
