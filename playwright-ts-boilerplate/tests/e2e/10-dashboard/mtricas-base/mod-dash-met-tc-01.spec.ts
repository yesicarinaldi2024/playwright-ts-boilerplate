import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Confirmar diseño íntegro descripto en el manual pág 5.
 */
test.describe('MOD-DASH-MET-TC-01 | Presencia de Tarjetones Principales Básicos (KPI Check)', () => {
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
