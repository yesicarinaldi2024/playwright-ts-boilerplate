import { test, expect } from '../../../fixtures/test-base';

test.describe('MOD-DASH-GFX-TC-02', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Super Ranking Tablas', async ({ paginaDashboard, page }) => {
     await page.waitForURL(/.*?\/(dashboard)?/i); await page.waitForLoadState('domcontentloaded');
     await paginaDashboard.verificarVisibilidadDatoBasico('top');
  });
});
