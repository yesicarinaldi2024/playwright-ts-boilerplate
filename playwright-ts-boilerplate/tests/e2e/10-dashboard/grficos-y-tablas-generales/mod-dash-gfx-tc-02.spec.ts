import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Grilla complementaria se hidrata.
 */
test.describe('MOD-DASH-GFX-TC-02 | Integridad Componentes de Barras Top Puestos (Rankings)', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Super Ranking Tablas', async ({ paginaDashboard, page }) => {
     await page.waitForURL(/.*?\/(dashboard)?/i); await page.waitForLoadState('domcontentloaded');
     await paginaDashboard.verificarVisibilidadDatoBasico('top');
  });
});
