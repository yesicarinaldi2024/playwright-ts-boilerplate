import { test, expect } from '../../../fixtures/test-base';

test.describe('MOD-DASH-MET-TC-01', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Métricas Base Check', async ({ paginaDashboard, page }) => {
     await page.waitForURL(/.*?\/(dashboard)?/i); await page.waitForLoadState('domcontentloaded');
     // Validar que los KPIs estén en pantalla
     await paginaDashboard.verificarVisibilidadDatoBasico('ventas netas');
     await paginaDashboard.verificarVisibilidadDatoBasico('órdenes totales');
     await paginaDashboard.verificarVisibilidadDatoBasico('promedio');
  });
});
