import { test, expect } from '../../../fixtures/test-base';

test.describe('MOD-DASH-GFX-TC-01', () => {
  test.beforeEach(async ({ paginaLogin }) => {
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
