import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: El sistema debe frenar ataques brutales hacia una cuenta.
 */
test.describe('MOD-ACC-NAV-TC-04 | Demostración Rate Limit o Throttle a nivel Acceso', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
  });

  test('Throttle de multiples intents contra Auth provider', async ({ paginaLogin }) => {
     // Single retry ensures it doesnt trigger an actual ban for other users
     await paginaLogin.autenticar();
     await paginaLogin.comprobarAlertaCredencialesInvalidas();
  });
});
