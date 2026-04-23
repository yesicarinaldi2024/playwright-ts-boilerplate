import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Evaluador de Guards en app cliente.
 */
test.describe('MOD-ACC-NAV-TC-02 | Bloqueo perimetral a rutas sin token', () => {
  test('Validar bloqueo y redirect por JWT nulo', async ({ page }) => {
     await page.goto('https://bo-dexorder-qa.dexmanager.com/dashboard/organization');
     // Al no estar autorizado, el Router JS debería mandarnos hacia un login
     await expect(page).toHaveURL(/.*?login.*?|.*?keycloack.*/);
  });
});
