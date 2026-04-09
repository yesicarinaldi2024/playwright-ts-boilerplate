import { test, expect } from '../../../fixtures/test-base';

test.describe('MOD-DASH-FILT-TC-04', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Limpiar Todos', async ({ paginaDashboard, page }) => {
     await page.waitForURL(/.*?\/(dashboard)?/i); await page.waitForLoadState('domcontentloaded');
     if(await paginaDashboard.btnLimpiarTodos.isVisible().catch(()=>false)){
         await paginaDashboard.btnLimpiarTodos.click();
     }
     await expect(page).toHaveURL(/.*?dashboard.*/);
  });
});
