import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: DatePicker reacciona correctamente a inserciones custom.
 */
test.describe('MOD-DASH-FILT-TC-02 | Set de Calendario Personalizado', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar rango personalizado', async ({ paginaDashboard, page }) => {
     await page.waitForURL(/.*?\/(dashboard)?/i); await page.waitForLoadState('domcontentloaded');
     await paginaDashboard.elegirOpcionSelectGenerico('Período', 'Rango');
     await paginaDashboard.aplicar();
     await expect(page).toHaveURL(/.*?dashboard.*/);
  });
});
