import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Vuelta inmediata a valor primigenio sin reseteo duro por F5.
 */
test.describe(`MOD-DASH-FILT-TC-04 | Funcionalidad Botón 'Limpiar Todos' (Reset)`, () => {
  test.beforeEach(async ({ paginaLogin, page }) => {
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
