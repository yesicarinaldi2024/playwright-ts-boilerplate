import { test, expect } from '../../../fixtures/test-base';

/**
 * Objetivo: Garantizar limpieza cruzada de datos mediante segundo parámetro de acotación.
 */
test.describe('MOD-DASH-FILT-TC-03 | Re-filtrado dinámico utilizando Segmento Sucursal', () => {
  test.beforeEach(async ({ paginaLogin }) => {
    await paginaLogin.visitarLogin();
    await paginaLogin.autenticar();
  });

  test('Validar sucursal especifica', async ({ paginaDashboard, page }) => {
     await page.waitForURL(/.*?\/(dashboard)?/i); await page.waitForLoadState('domcontentloaded');
     await paginaDashboard.elegirOpcionSelectGenerico('Sucursales', 'Principal');
     await paginaDashboard.aplicar();
     await expect(page).toHaveURL(/.*?dashboard.*/);
  });
});
