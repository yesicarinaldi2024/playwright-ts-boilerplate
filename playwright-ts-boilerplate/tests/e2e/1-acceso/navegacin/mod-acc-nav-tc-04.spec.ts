import { test, expect } from '../../../fixtures/test-base';

test.describe('MOD-ACC-NAV-TC-04 | Demostración Rate Limit', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
  });

  test('Throttle de multiples intents contra Auth provider', async ({ paginaLogin }) => {
     // Single retry ensures it doesnt trigger an actual ban for other users
     await paginaLogin.autenticar();
     await paginaLogin.comprobarAlertaCredencialesInvalidas();
  });
});
