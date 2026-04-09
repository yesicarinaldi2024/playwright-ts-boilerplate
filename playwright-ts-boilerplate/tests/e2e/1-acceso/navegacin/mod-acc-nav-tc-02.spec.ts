import { test, expect } from '../../../fixtures/test-base';

test.describe('MOD-ACC-NAV-TC-02 | Guard Perimentral', () => {
  test('Validar bloqueo y redirect por JWT nulo', async ({ page }) => {
     await page.goto('https://bo-dexorder-qa.dexmanager.com/dashboard/organization');
     // Al no estar autorizado, el Router JS debería mandarnos hacia un login
     await expect(page).toHaveURL(/.*?login.*?|.*?keycloack.*/);
  });
});
