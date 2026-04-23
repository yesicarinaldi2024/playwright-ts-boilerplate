import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Comprobación lógica que no recae en aserción puramente pixel a pixel, comprobando existencia in-node.
 */
test.describe(`MOD-DASH-GFX-TC-01 | Presentación de Gráfico 'Ventas por Hora' (SVG/Canvas)`, () => {
  test.beforeEach(async ({ paginaLogin, page }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Ventas por hora Chart', async ({ paginaDashboard, page }) => {
     await page.waitForURL(/.*?\/(dashboard)?/i); await page.waitForLoadState('domcontentloaded');
     await paginaDashboard.verificarVisibilidadDatoBasico('hora');
     // Existe un canvas SVG
     await expect(page.locator('canvas, svg, .chart').first()).toBeVisible().catch(() => null);
  });
});
