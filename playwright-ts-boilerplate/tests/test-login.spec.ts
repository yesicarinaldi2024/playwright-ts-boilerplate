import { test, expect } from './fixtures/test-base';

test('verify login', async ({ paginaLogin, page }) => {
  await paginaLogin.visitarLogin();
  await paginaLogin.autenticar();
  await expect(page).not.toHaveURL(/.*login.*/);
});
